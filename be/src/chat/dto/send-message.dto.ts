import { IsString, IsOptional, IsArray } from 'class-validator';

export class SendMessageDto {
    @IsString()
    conversationId: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    replyTo?: string;

    @IsOptional()
    @IsArray()
    attachments?: { url: string; mimeType?: string; size?: number }[];
}
