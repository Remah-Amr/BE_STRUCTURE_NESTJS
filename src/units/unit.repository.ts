import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Unit, UnitDocument } from './unit.model';

@Injectable()
export class UnitRepository extends BaseAbstractRepository<Unit> {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {
    super(unitModel);
  }
}
