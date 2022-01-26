import { IsMongoId, IsNumber } from 'class-validator';

export class addQuestionToExamDto {
  @IsMongoId()
  question: string;

  @IsNumber()
  point: number;
}
