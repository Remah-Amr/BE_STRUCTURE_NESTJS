import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Lesson } from './lessos.model';
import { User } from 'src/users/models/_user.model';

export type ExtraDocument = Extra & Document;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (_, doc: Record<string, unknown>) => {
      delete doc.__v;
      delete doc._id;
      delete doc.password;
      return {
        ...doc,
      };
    },
  },
})
export class Extra {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'subjectType',
    required: true,
  })
  subject: string;

  @Prop({
    type: String,
    enum: [Lesson.name],
    required: true,
  })
  subjectType: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  student: string;
}

const ExtraSchema = SchemaFactory.createForClass(Extra);

ExtraSchema.index({ student: 1, subject: 1, subjectType: 1 });

export { ExtraSchema };
