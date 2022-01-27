import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { UserDocument } from 'src/users/models/_user.model';
import { LessonDocument } from './models/lessos.model';

@ApiBearerAuth()
@ApiTags('LESSONS')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('add/:id')
  addStudentToLesson(
    @Param() { id }: ParamsWithId,
    @AuthUser() me: UserDocument,
  ): Promise<void> {
    return this.lessonsService.addStudentToLesson(id, me.id);
  }
  
  @Get('test')
  testFetchOne(): Promise<LessonDocument> {
    return this.lessonsService.testFetchOne();
  }
  
  @Get(':id')
  fetchLessonToStudent(
    @Param() { id }: ParamsWithId,
    @AuthUser() me: UserDocument,
  ): Promise<LessonDocument> {
    return this.lessonsService.fetchLessonToStudent(id, me.id);
  }

}
