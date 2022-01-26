import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserRole } from './_user.model';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  role: UserRole;

  @Prop({ type: String })
  test?: string;
}

const StudentSchema = SchemaFactory.createForClass(Student);

export { StudentSchema };
