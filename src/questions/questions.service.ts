import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuery, PaginateResult } from 'mongoose';
import { LessonRepository } from 'src/lessons/repositories/lesson.repository';
import { createQuestionDto } from './dto/create-question.dto';
import { FilterQueryOptionsQuestion } from './dto/filterQueryOptions.dto';
import { QuestionDocument } from './models/_question.model';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  async create(
    createQuestionDto: createQuestionDto,
  ): Promise<QuestionDocument> {
    const lesson = await this.lessonRepository.findOne({
      _id: createQuestionDto.lesson,
    });
    if (!lesson) throw new NotFoundException('lesson not found');
    const question = await this.questionRepository.create(
      createQuestionDto as CreateQuery<QuestionDocument>,
    );
    return question;
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsQuestion,
  ): Promise<PaginateResult<QuestionDocument> | QuestionDocument[]> {
    return await this.questionRepository.findAllWithPaginationOption(
      queryFiltersAndOptions as FilterQueryOptionsQuestion,
      ['lesson'],
    );
  }
}
