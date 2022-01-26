import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Question,
  QuestionSchema,
  QuestionType,
} from './models/_question.model';
import { ChooseSchema } from './models/choose.model';
import { TrueFalseSchema } from './models/truefalse.model';
import { QuestionRepository } from './question.repository';
import { LessonsModule } from 'src/lessons/lessons.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
        discriminators: [
          { name: QuestionType.CHOOSE, schema: ChooseSchema },
          { name: QuestionType.TRUEFALSE, schema: TrueFalseSchema },
        ],
      },
    ]),
    LessonsModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionRepository],
  exports: [QuestionRepository],
})
export class QuestionsModule {}
