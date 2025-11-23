import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    before?: string; // message id or ISO date
    @IsOptional()
    limit?: number = 30;
}
