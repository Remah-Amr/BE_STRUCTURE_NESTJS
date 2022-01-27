import { Injectable } from '@nestjs/common';
import { CreateQuery } from 'mongoose';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamRepository } from './repositories/exam.repository';
import { ExamDocument } from './models/exam.model';
import { SolutionRepository } from './repositories/solution.repository';
import { SolutionDocument } from './models/solution.model';
import { addAnswerDto } from './dto/add-answer.dto';
import { QuestionRepository } from 'src/questions/question.repository';

@Injectable()
export class ExamsService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly solutionRepository: SolutionRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<ExamDocument> {
    return this.examRepository.create(
      createExamDto as CreateQuery<ExamDocument>,
    );
  }

  async startSolution(id: string, studentId: string): Promise<void> {
    console.log(id, studentId);
    await this.solutionRepository.create({
      exam: id,
      student: studentId,
      status: 'solving',
    } as CreateQuery<SolutionDocument>);
    return; // when error mongoose it returns to me
  }

  async addQuestionToSolution(
    examid: string,
    qid: string,
    stid: string,
    { answer }: addAnswerDto,
  ): Promise<void> {
    const { type } = await this.questionRepository.findOne({ _id: qid });
    await this.solutionRepository.addQuestionToSolution(
      examid,
      stid,
      qid,
      answer,
      type,
    );

    // await this.solutionRepository.updateOne(
    //   {},
    //   { questions: [{ question: qid, type: 'choose', answer: 'OK' }] },
    // );

    return;
  }

  async examWithSolution() {
    let exam: any = await this.examRepository.findOne(
      { _id: '61f07c5c0ed2ad20874f9c91' },
      { populate: 'questions.question' },
    );
    let solution = await this.solutionRepository.findOne(
      {},
      { populate: 'questions.question' },
    );
    let solutionObj = {};
    solution.questions.forEach((q) => {
      solutionObj[q.question.id] = q;
    });
    exam = exam.toJSON();
    exam.hhh = 'hhh';
    for (let i = 0; i < exam.questions.length; i++) {
      let q = exam.questions[i];
      // exam.questions[i] = exam.questions[i].toJSON();
      exam.questions[i].test = 'test';
      exam.questions[i].answer =
        solutionObj[q.question.id] === undefined
          ? null
          : solutionObj[q.question.id].answer;
      exam.questions[i].question = exam.questions[i].question.toJSON();
      exam.questions[i].question.modelAnswer = undefined;
      exam.questions[i].question.test = 'test';
      exam.questions[i].mark =
        solutionObj[q.question.id] === undefined
          ? 0
          : solutionObj[q.question.id].mark;
      exam.questions[i].flag =
        solutionObj[q.question.id] === undefined
          ? 2
          : solutionObj[q.question.id].mark === 0
          ? 0
          : 1;
    }
    return exam;
  }
}
