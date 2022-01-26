import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';
import { UserRole } from '../models/_user.model';

export class FilterQueryUser {
  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.username), 'i');
  })
  username?: string;

  @IsOptional()
  @IsString()
  role?: UserRole;
}

export class FilterQueryOptionsUser extends IntersectionType(
  FilterQueryUser,
  PaginationParams,
) {}
