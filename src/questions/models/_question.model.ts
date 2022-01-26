import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Model,
  Mongoose,
  ObjectId,
  Schema as mongooseSchema,
} from 'mongoose';
import { Lesson } from 'src/lessons/models/lessos.model';

export type QuestionDocument = Question & Document;

export enum QuestionType {
  TRUEFALSE = 'truefalse',
  CHOOSE = 'choose',
}

@Schema({
  discriminatorKey: 'type',
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (_, doc: Record<string, unknown>) => {
      delete doc.__v;
      delete doc._id;
      return {
        ...doc,
      };
    },
  },
})
export class Question {
  id?: string;

  @Prop({
    type: String,
    required: true,
  })
  head: string;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    required: true,
    ref: Lesson.name,
  })
  lesson: string;

  @Prop({ required: true, type: String, enum: Object.values(QuestionType) })
  type: QuestionType;
}

const QuestionSchema = SchemaFactory.createForClass(Question);

export { QuestionSchema };
