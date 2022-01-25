import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './models/lessos.model';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
import { UnitsModule } from 'src/units/units.module';
import { ExtraRepository } from './repositories/extra.repository';
import { LessonRepository } from './repositories/lesson.repository';
import { Extra, ExtraSchema } from './models/extra.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: Extra.name,
        schema: ExtraSchema,
      },
    ]),
    UsersModule,
    CoursesModule,
    UnitsModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService, ExtraRepository, LessonRepository],
  exports: [LessonsService, ExtraRepository, LessonRepository],
})
export class LessonsModule {}
