import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionType } from './_question.model';

export type TrueFalseDocument = TrueFalse & Document;

@Schema({ _id: false })
export class TrueFalse {
  type: QuestionType;

  @Prop({ type: Boolean, required: true })
  modelAnswer: boolean;
}

const TrueFalseSchema = SchemaFactory.createForClass(TrueFalse);

export { TrueFalseSchema };
