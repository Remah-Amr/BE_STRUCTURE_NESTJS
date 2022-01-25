import { IsMongoId, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  description: string;

  @IsMongoId()
  course: string;
}
