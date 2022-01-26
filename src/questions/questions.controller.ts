import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';
import { LessonDocument } from 'src/lessons/models/lessos.model';
import { createQuestionDto } from './dto/create-question.dto';
import { FilterQueryOptionsQuestion } from './dto/filterQueryOptions.dto';
import { QuestionDocument } from './models/_question.model';
import { QuestionsService } from './questions.service';

@ApiBearerAuth()
@ApiTags('QUESTIONS')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(
    @Body() createQuestionDto: createQuestionDto,
  ): Promise<QuestionDocument> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsQuestion,
  ): Promise<PaginateResult<QuestionDocument> | QuestionDocument[]> {
    return await this.questionsService.findAll(
      queryFiltersAndOptions as FilterQueryOptionsQuestion,
    );
  }
}
