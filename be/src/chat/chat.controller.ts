import { Controller, Post, Body, UseGuards, Req, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ReadMessagesDto } from './dto/read-messages.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post('conversations')
    createConversation(@Req() req: any, @Body() dto: CreateConversationDto) {
        return this.chatService.createConversation(dto);
    }

    @Get('conversations')
    listConversations(@Req() req: any) {
        return this.chatService.listConversations(req.user.sub);
    }

    @Get('conversations/:id/messages')
    getMessages(@Param('id') id: string, @Query() query: PaginationDto) {
        return this.chatService.getMessages(id, query.limit || 30, query.before);
    }

    @Post('messages')
    sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
        return this.chatService.createMessage(req.user.sub, dto);
    }

    @Post('messages/read')
    markRead(@Req() req: any, @Body() dto: ReadMessagesDto) {
        return this.chatService.markRead(req.user.sub, dto.conversationId);
    }

    @Post('messages/react')
    react(@Req() req: any, @Body() dto: { messageId: string; emoji: string }) {
        return this.chatService.addReaction(req.user.sub, dto.messageId, dto.emoji);
    }
}
