import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
    @Prop({ enum: ['dm', 'group'], default: 'dm' })
    type: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    participants: Types.ObjectId[];

    @Prop({ type: Object, default: {} })
    lastMessage?: {
        _id?: Types.ObjectId;
        senderId?: Types.ObjectId;
        text?: string;
        createdAt?: Date;
    };

    @Prop({ type: Map, of: Number, default: {} })
    unreadCounts?: Map<string, number>; // userId -> count

    @Prop() name?: string; // group
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ 'lastMessage.createdAt': -1 });
