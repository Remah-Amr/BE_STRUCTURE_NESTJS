import { Type } from 'class-transformer';
import { IsString, Validate, ValidateNested } from 'class-validator';
import { ModelAnswerType } from 'src/questions/customValidation';
import { IsNonPrimitiveArray } from 'src/utils/customValidationDecorator';
import { addNameDto } from './add-names.dto';

export class CreateClassDto {
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => addNameDto)
  names: addNameDto[];
}
