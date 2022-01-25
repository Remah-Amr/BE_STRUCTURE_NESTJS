import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BaseModel } from 'src/utils/base.model';
import { Course, CourseDocument } from 'src/courses/models/course.model';

export type UnitDocument = Unit & Document;

@Schema() // must put this to consider below fields
export class Unit extends BaseModel {
  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    required: true,
  })
  course: string | CourseDocument;
}

const UnitSchema = SchemaFactory.createForClass(Unit);

export { UnitSchema };
