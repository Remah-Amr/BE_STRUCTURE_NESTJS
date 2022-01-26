import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Question, QuestionDocument } from './models/_question.model';

@Injectable()
export class QuestionRepository extends BaseAbstractRepository<Question> {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {
    super(questionModel);
  }
}
