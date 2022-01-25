import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, models, Mongoose } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Lesson, LessonDocument } from '../models/lessos.model';
import * as mongoose from 'mongoose';
import { ExtraRepository } from './extra.repository';
import { ExtraDocument } from '../models/extra.model';
@Injectable()
export class LessonRepository extends BaseAbstractRepository<Lesson> {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    private readonly extraRepository: ExtraRepository,
  ) {
    super(lessonModel);
  }

  public async addStudentToLesson(
    id: string,
    studentId: string,
  ): Promise<void> {
    const lesson = await this.lessonModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $addFields: {
          isAllowToAdd: { $gt: ['$threshold', { $size: '$students' }] },
        },
      },
      {
        $match: {
          isAllowToAdd: true,
        },
      },
    ]);
    if (lesson[0]) {
      // ... addToSet this lesson
    } else {
      await this.extraRepository.create({
        student: studentId,
        subject: id,
        subjectType: Lesson.name,
      } as mongoose.CreateQuery<ExtraDocument>);
    }
  }

  public async fetchLessonToStudent(
    id: string,
    studentId: string,
  ): Promise<LessonDocument> {
    const extraLessons = await this.extraRepository.findOne({
      student: studentId,
      subject: id,
      subjectType: Lesson.name,
    });

    // let test = await this.lessonModel
    //   .findOne({})
    //   .populate(['unit.id', 'course.id']);
    // console.log(test); // successful

    const lesson = await this.lessonModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $addFields: {
          didStudy: {
            $or: [
              { $eq: [{ $type: extraLessons }, 'object'] },
              { $in: [studentId, '$students'] },
            ],
          },
        },
      },
    ]);

    return lesson[0];
  }
}
