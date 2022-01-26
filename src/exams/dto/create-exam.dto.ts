import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from 'src/utils/customValidationDecorator';
import { addQuestionToExamDto } from './add-question-to-exam.dto';

export class CreateExamDto {
  @IsString()
  title: string;

  @ValidateNested({each:true})
  @IsNonPrimitiveArray()
  @Type(()=> addQuestionToExamDto)
  questions: addQuestionToExamDto[]
}
