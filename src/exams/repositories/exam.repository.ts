import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Exam, ExamDocument } from '../models/exam.model';

@Injectable()
export class ExamRepository extends BaseAbstractRepository<Exam> {
  constructor(@InjectModel(Exam.name) private examModel: Model<ExamDocument>) {
    super(examModel);
  }
}
