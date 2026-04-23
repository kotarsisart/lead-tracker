import { IsString, IsNumber, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsString()
  @Length(1, 500)
  text: string;

  @Type(() => Number)
  @IsNumber()
  leadId: number;
}
