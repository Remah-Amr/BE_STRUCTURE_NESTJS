import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Question } from 'src/questions/models/_question.model';

export type ExamDocument = Exam & Document;

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
export class Exam {
  id?: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [examQuestionSchema()] })
  questions: Record<string, any>[];
}

const ExamSchema = SchemaFactory.createForClass(Exam);

export { ExamSchema };

function examQuestionSchema() {
  const schema = new mongooseSchema(
    {
      question: {
        type: mongooseSchema.Types.ObjectId,
        ref: Question.name,
        required: true,
      },
      point: {
        type: Number,
        required: true,
      },
    },
    { _id: false },
  );

  schema.set('toJSON', {
    transform: function (doc) {
      return {
        question: doc.question,
        point: doc.point,
        remah: 'remah',
      };
    },
  });

  return schema;
}
