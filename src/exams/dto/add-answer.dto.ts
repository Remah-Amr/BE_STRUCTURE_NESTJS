import { IsMongoId, IsNotEmpty } from 'class-validator';

export class addAnswerDto {
  @IsNotEmpty()
  answer: boolean | number;
}
