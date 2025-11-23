import { IsString } from 'class-validator';

export class ReadMessagesDto {
    @IsString()
    conversationId: string;

    // optionally timestamp or messageId up to which read
    @IsString()
    upToMessageId?: string;
}
