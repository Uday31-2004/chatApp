import { IsArray, ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateConversationDto {
    @IsArray()
    @ArrayMinSize(2)
    participants: string[]; // user ids

    @IsOptional()
    @IsString()
    name?: string; // for group
}
