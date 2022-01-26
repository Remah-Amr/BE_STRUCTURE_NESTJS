import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './models/exam.model';
import { ExamRepository } from './repositories/exam.repository';
import { Solution, SolutionSchema } from './models/solution.model';
import { SolutionRepository } from './repositories/solution.repository';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Exam.name,
        schema: ExamSchema,
      },
      {
        name: Solution.name,
        schema: SolutionSchema,
      },
    ]),
    QuestionsModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService, ExamRepository, SolutionRepository],
  exports: [ExamsService, ExamRepository, SolutionRepository],
})
export class ExamsModule {}
