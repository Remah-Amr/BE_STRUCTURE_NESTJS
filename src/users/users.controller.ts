import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Inject,
  UseFilters,
  UploadedFiles,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { request } from 'http';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole } from './models/_user.model';
import { UsersService } from './users.service';
import { REQUEST } from '@nestjs/core';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FilterQuery, PaginateResult } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseGeneral } from 'src/utils/pagination/ApiOkResponseGeneral';
import { Student } from './models/student.model';
import { Teacher } from './models/teacher.model';
import { FilterQueryOptionsUser } from './dto/filterQueryOptions.dto';

@ApiBearerAuth()
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(REQUEST) private readonly req: Record<string, unknown>,
  ) {}

  @Roles(UserRole.STUDENT)
  @ApiOkResponseGeneral(User, Student, false)
  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsUser,
  ): Promise<PaginateResult<UserDocument> | UserDocument[]> {
    return await this.usersService.findAll(
      queryFiltersAndOptions as FilterQueryOptionsUser,
    );
  }

  @Get('profile')
  async getProfile(): Promise<UserDocument> {
    return await this.usersService.getProfile(this.req.me as UserDocument);
  }

  @Patch('profile')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  async updateProfile(
    @UploadedFiles()
    files,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<UserDocument> {
    if (files && files.photo) updateUserData.photo = files.photo[0].secure_url;

    delete updateUserData.enabled;

    return await this.usersService.update(
      { _id: this.req.me } as FilterQuery<UserDocument>,
      updateUserData,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/change-password')
  async changePassword(
    @Body() { oldPassword, newPassword }: ChangePasswordDto,
    @AuthUser() me: UserDocument,
  ): Promise<UserDocument> {
    return await this.usersService.changePassword(
      { oldPassword, newPassword },
      me,
    );
  }

  @Public()
  @Get(':id')
  async fetchUserById(@Param() { id }: ParamsWithId): Promise<UserDocument> {
    return await this.usersService.findOne({
      _id: id,
    } as FilterQuery<UserDocument>);
  }
}
