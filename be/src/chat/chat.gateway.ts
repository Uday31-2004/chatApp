import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private server: Server;
    private logger = new Logger('ChatGateway');
    // in-memory map userId -> socketIds[]
    private userSockets = new Map<string, string[]>();

    constructor(private jwtService: JwtService, private chatService: ChatService) { }

    afterInit(server: Server) {
        this.server = server;
        this.logger.log('Gateway initialized');
    }

    handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            client.data.userId = payload.sub;
            const arr = this.userSockets.get(payload.sub) || [];
            arr.push(client.id);
            this.userSockets.set(payload.sub, arr);
            this.logger.log(`User ${payload.sub} connected with socket ${client.id}`);
        } catch (err) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (!userId) return;
        const arr = this.userSockets.get(userId) || [];
        const filtered = arr.filter(id => id !== client.id);
        if (filtered.length) this.userSockets.set(userId, filtered);
        else this.userSockets.delete(userId);
        this.logger.log(`User ${userId} disconnected socket ${client.id}`);
    }

    // Client → Server
    @SubscribeMessage('message:send')
    async onMessageSend(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        // payload: { tempId, conversationId, text, attachments, replyTo }
        const userId = client.data.userId;
        const saved = await this.chatService.createMessage(userId, payload);

        // emit to all participants
        const conv = await this.chatService['convModel'].findById(saved.conversationId).lean(); // or create service fn
        if (!conv) return;
        conv.participants.forEach((pid: any) => {
            const sockets = this.userSockets.get(pid.toString()) || [];
            sockets.forEach(socketId => {
                this.server.to(socketId).emit('message:new', saved);
            });
        });

        // also send ack to sender so tempId replacement happens
        const senderSockets = this.userSockets.get(userId) || [];
        senderSockets.forEach(id => this.server.to(id).emit('message:sent', saved));
    }

    @SubscribeMessage('typing')
    async onTyping(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string; isTyping: boolean }) {
        const userId = client.data.userId;
        // broadcast typing to other participants
        const conv = await this.chatService['convModel'].findById(payload.conversationId).lean();
        if (!conv) return;
        conv.participants.forEach((pid: any) => {
            if (pid.toString() === userId) return;
            const sockets = this.userSockets.get(pid.toString()) || [];
            sockets.forEach(socketId => this.server.to(socketId).emit('typing', { conversationId: payload.conversationId, userId, isTyping: payload.isTyping }));
        });
    }

    @SubscribeMessage('message:read')
    async onMessageRead(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }) {
        const userId = client.data.userId;
        await this.chatService.markRead(userId, payload.conversationId);
        // notify participants
        const conv = await this.chatService['convModel'].findById(payload.conversationId).lean();
        if (!conv) return;
        conv.participants.forEach((pid: any) => {
            const sockets = this.userSockets.get(pid.toString()) || [];
            sockets.forEach(socketId => this.server.to(socketId).emit('read', { conversationId: payload.conversationId, userId }));
        });
    }

    // add more: reactions, edit, delete...
}
