import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Extra, ExtraDocument } from '../models/extra.model';

@Injectable()
export class ExtraRepository extends BaseAbstractRepository<Extra> {
  constructor(
    @InjectModel(Extra.name) private extraModel: Model<ExtraDocument>,
  ) {
    super(extraModel);
  }
}
