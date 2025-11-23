import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema()
export class Attachment {
    @Prop() url: string;
    @Prop() mimeType?: string;
    @Prop() size?: number;
}
export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
