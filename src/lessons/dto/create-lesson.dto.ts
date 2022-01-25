import { Type } from 'class-transformer';
import { IsMongoId, ValidateNested } from 'class-validator';
import { addNameDto } from 'src/classes/dto/add-names.dto';
import { IsNonPrimitiveArray } from 'src/utils/customValidationDecorator';

export class CreateLessonDto {
  @IsMongoId()
  unit: string;

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => addNameDto)
  names: addNameDto[];
}
