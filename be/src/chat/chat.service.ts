import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Conversation.name) private convModel: Model<ConversationDocument>,
        @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    ) { }

    async createConversation(dto: CreateConversationDto) {
        // If DM check existing conversation between same participants (2)
        if (dto.participants.length === 2) {
            const existing = await this.convModel.findOne({
                type: 'dm',
                participants: { $all: dto.participants, $size: 2 },
            });
            if (existing) return existing;
        }
        const conv = new this.convModel({
            participants: dto.participants.map(id => new Types.ObjectId(id)),
            type: dto.participants.length > 2 ? 'group' : 'dm',
            name: dto.name,
            unreadCounts: {},
        });
        return conv.save();
    }

    async listConversations(userId: string) {
        return this.convModel
            .find({ participants: userId })
            .sort({ 'lastMessage.createdAt': -1 })
            .lean()
            .exec();
    }

    async getMessages(conversationId: string, limit = 30, before?: string) {
        const query: any = { conversationId: new Types.ObjectId(conversationId) };
        if (before) {
            query.createdAt = { $lt: new Date(before) }; // or id based
        }
        return this.msgModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
    }

    async createMessage(userId: string, dto: SendMessageDto) {
        // check conversation exists
        const conv = await this.convModel.findById(dto.conversationId);
        if (!conv || !conv?.unreadCounts) throw new NotFoundException('Conversation not found');

        const message = new this.msgModel({
            conversationId: conv._id,
            senderId: new Types.ObjectId(userId),
            text: dto.text,
            attachments: dto.attachments,
            replyTo: dto.replyTo ? new Types.ObjectId(dto.replyTo) : undefined,
        });
        const saved = await message.save();

        // Update conversation lastMessage and unreadCounts
        conv.lastMessage = { _id: saved._id, senderId: saved.senderId, text: saved.text, createdAt: saved?.createdAt };
        // increment unread counts for other participants
        conv.participants.forEach(pId => {
            const pid = pId.toString();
            if (pid !== userId) {
                const prev = conv.unreadCounts?.get(pid) || 0;
                if (conv?.unreadCounts)
                    conv?.unreadCounts.set(pid, prev + 1);
            }
        });
        await conv.save();
        return saved;
    }

    async markRead(userId: string, conversationId: string) {
        const conv = await this.convModel.findById(conversationId);
        if (!conv || !conv?.unreadCounts) throw new NotFoundException();
        conv.unreadCounts.set(userId, 0);
        await conv.save();
        return true;
    }

    async addReaction(userId: string, messageId: string, emoji: string) {
        const msg = await this.msgModel.findById(messageId);
        if (!msg || !msg?.reactions) throw new NotFoundException();
        const existing = msg.reactions.find(r => r.userId?.toString() === userId && r.emoji === emoji);
        if (!existing) msg.reactions.push({ userId: new Types.ObjectId(userId), emoji });
        else {
            // toggle off
            msg.reactions = msg.reactions.filter(r => !(r.userId.toString() === userId && r.emoji === emoji));
        }
        await msg.save();
        return msg;
    }

    // other helper methods: editMessage, deleteMessage, search...
}
