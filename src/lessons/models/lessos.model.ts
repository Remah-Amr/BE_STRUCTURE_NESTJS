import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Unit } from 'src/units/unit.model';
import { Course } from 'src/courses/models/course.model';
import { User } from 'src/users/models/_user.model';

export type LessonDocument = Lesson & Document;

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
export class Lesson {
  id?: string;

  @Prop(
    raw([
      {
        _id: false,
        value: {
          required: true,
          type: String,
          index: true,
        },
        lang: {
          required: true,
          type: String,
        },
      },
    ]),
  )
  names: Record<string, any>[];

  @Prop(
    raw({
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Unit.name,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }),
  )
  unit: Record<string, any>;

  @Prop(
    raw({
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Course.name,
        required: true,
      },
      names: [
        {
          _id: false,
          value: {
            required: true,
            type: String,
            index: true,
          },
          lang: {
            required: true,
            type: String,
          },
        },
      ],
    }),
  )
  course: Record<string, any>;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: User.name, index: true },
    ],
  })
  students?: string[];

  @Prop({ type: Number, default: 500000 })
  threshold?: number;
}

const LessonSchema = SchemaFactory.createForClass(Lesson);

export { LessonSchema };
