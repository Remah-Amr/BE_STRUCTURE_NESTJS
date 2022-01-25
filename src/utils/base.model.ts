import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (_, doc: Record<string, unknown>) => {
      console.log(doc) // non-reachable here !!
      delete doc.__v;
      delete doc._id;
      return {
        ...doc,
      };
    },
  },
})
export abstract class BaseModel {
  id: string; // _id getter as string
  createdAt: Date; // provided by schemaOptions.timestamps
  updatedAt: Date; // provided by schemaOptions.timestamps
}
