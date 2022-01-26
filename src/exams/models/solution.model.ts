import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Question } from 'src/questions/models/_question.model';
import { User } from 'src/users/models/_user.model';
import { Exam } from './exam.model';

export type SolutionDocument = Solution & Document;

export enum SolutionStatus {
  SOLVING = 'solving',
  DONE = 'done',
}

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
export class Solution {
  id?: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: User.name, required: true })
  student: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Exam.name, required: true })
  exam: string;

  @Prop({ type: String, enum: Object.values(SolutionStatus) })
  status: SolutionStatus;

  @Prop(
    // validation OK
    raw([
      new mongooseSchema(
        {
          question: {
            type: mongooseSchema.Types.ObjectId,
            required: true,
            ref: Question.name,
          },
          correct: {
            type: Boolean,
            default: null,
          },
          mark: {
            type: Number,
            default: 0,
          },
        },
        { discriminatorKey: 'type', _id: false },
      ),
    ]),
  )
  questions: Record<string, any>[];
}

const SolutionSchema = SchemaFactory.createForClass(Solution);

export { SolutionSchema };

(
  SolutionSchema.path('questions') as mongooseSchema.Types.DocumentArray
).discriminator(
  'truefalse',
  new mongooseSchema(
    {
      answer: {
        type: Boolean,
      },
    },
    { _id: false },
  ),
);

(
  SolutionSchema.path('questions') as mongooseSchema.Types.DocumentArray
).discriminator(
  'choose',
  new mongooseSchema(
    {
      answer: {
        type: Number,
      },
    },
    { _id: false },
  ),
);
