import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
    conversationId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    senderId: Types.ObjectId;

    @Prop() text?: string;

    @Prop([{ url: String, mimeType: String, size: Number }])
    attachments?: any[];

    @Prop([{ userId: Types.ObjectId, emoji: String }])
    reactions?: { userId: Types.ObjectId; emoji: string }[];

    @Prop({ default: false })
    edited: boolean;

    @Prop()
    replyTo?: Types.ObjectId;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    createdAt: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
