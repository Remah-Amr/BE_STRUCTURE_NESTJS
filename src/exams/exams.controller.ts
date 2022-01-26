import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { UserDocument } from 'src/users/models/_user.model';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { addAnswerDto } from './dto/add-answer.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamsService } from './exams.service';
import { ExamDocument } from './models/exam.model';
import { PickType } from '@nestjs/swagger';
import addAnswerParams from './dto/add-answer-params.dto';

@ApiBearerAuth()
@ApiTags('EXAMS')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDto): Promise<ExamDocument> {
    return this.examsService.create(createExamDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('solution/:id')
  startSolution(
    @Param() { id }: ParamsWithId,
    @AuthUser() me: UserDocument,
  ): Promise<void> {
    return this.examsService.startSolution(id, me.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('solution-answer/:examid/questions/:questionid')
  addQuestionToSolution(
    @Param() { examid, questionid }: addAnswerParams,
    @Body() answer: addAnswerDto,
    @AuthUser() me: UserDocument,
  ): Promise<void> {
    return this.examsService.addQuestionToSolution(
      examid,
      questionid,
      me.id,
      answer,
    );
  }

  @Get('exam-with-solution')
  examWithSolution() {
    return this.examsService.examWithSolution();
  }
}
