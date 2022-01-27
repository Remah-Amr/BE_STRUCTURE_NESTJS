import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class Name {
  @Prop({
    required: true,
    type: String,
  })
  lang: string;

  @Prop({
    required: true,
    type: String,
    index:true
  })
  value: string;
}

const NameSchema = SchemaFactory.createForClass(Name);

export { NameSchema };
