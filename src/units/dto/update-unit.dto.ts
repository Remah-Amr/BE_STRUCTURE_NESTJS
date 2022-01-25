import { OmitType } from '@nestjs/swagger';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends OmitType(CreateUnitDto, [
  'course',
] as const) {}
