import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { addAnswerDto } from '../dto/add-answer.dto';
import {
  Solution,
  SolutionDocument,
  SolutionStatus,
} from '../models/solution.model';

@Injectable()
export class SolutionRepository extends BaseAbstractRepository<Solution> {
  constructor(
    @InjectModel(Solution.name)
    private readonly solutionModel: Model<SolutionDocument>,
  ) {
    super(solutionModel);
  }

  public async addQuestionToSolution(
    id: string,
    studentId: string,
    qid: string,
    answer: any,
    type: string,
  ): Promise<void> {
    await this.solutionModel.updateOne(
      {
        student: studentId,
        status: SolutionStatus.SOLVING,
        exam: id,
      },
      [
        {
          $set: {
            questions: {
              $reduce: {
                input: { $ifNull: ['$questions', []] },
                initialValue: { Questions: [], update: false },
                in: {
                  $cond: [
                    { $eq: ['$$this.question', qid] },
                    {
                      Questions: {
                        $concatArrays: [
                          '$$value.Questions',
                          [
                            {
                              question: '$$this.question',
                              type: '$$this.type',
                              answer,
                            },
                          ],
                        ],
                      },
                      update: true,
                    },
                    {
                      Questions: {
                        $concatArrays: ['$$value.Questions', ['$$this']],
                      },
                      update: '$$value.update',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $set: {
            questions: {
              $cond: [
                { $eq: ['$questions.update', false] },
                {
                  $concatArrays: [
                    '$questions.Questions',
                    [
                      {
                        question: new Types.ObjectId(qid),
                        type,
                        answer,
                      },
                    ],
                  ],
                },
                { $concatArrays: ['$questions.Questions', []] },
              ],
            },
          },
        },
      ],
    );
  }
}
