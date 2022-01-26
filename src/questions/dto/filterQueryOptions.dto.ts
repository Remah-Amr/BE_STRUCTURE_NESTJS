import { isMongoId, IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';

export class FilterQueryQuestion {
  @IsOptional()
  @IsMongoId()
  lesson?: string;
}

export class FilterQueryOptionsQuestion extends IntersectionType(
  FilterQueryQuestion,
  PaginationParams,
) {}
