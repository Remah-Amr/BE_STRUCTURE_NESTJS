import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmptyObject,
  ValidateIf,
  Validate,
} from 'class-validator';
import { ModelAnswerType } from '../customValidation';
import { QuestionType } from '../models/_question.model';

export class createQuestionDto {
  @IsMongoId()
  lesson: string;

  @IsString()
  head: string;

  @IsString()
  @IsEnum(QuestionType)
  type: QuestionType;

  @ValidateIf((o) => o.type === QuestionType.CHOOSE)
  @IsString({ each: true })
  choices?: string[];

  @Validate(ModelAnswerType)
  modelAnswer: boolean | number;
}
