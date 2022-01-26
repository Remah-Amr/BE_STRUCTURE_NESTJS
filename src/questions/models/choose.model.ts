import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionType } from './_question.model';

export type ChooseDocument = Choose & Document;

@Schema({ _id: false })
export class Choose {
  type: QuestionType;

  @Prop({ type: [{ type: String, required: true }] })
  choices: string[];

  @Prop({ type: Number, required: true })
  modelAnswer: number;
}

const ChooseSchema = SchemaFactory.createForClass(Choose);

export { ChooseSchema };
