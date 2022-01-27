import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ModelAnswerType } from 'src/questions/customValidation';
import { IsNonPrimitiveArray } from 'src/utils/customValidationDecorator';
import { addNameDto } from './add-names.dto';

export class CreateClassDto {
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => addNameDto)
  names: addNameDto[];

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ type: 'string', format: 'binary' })
  // photo?: string;
}
