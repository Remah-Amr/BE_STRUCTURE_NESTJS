import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './models/course.model';
import { CourseRepository } from './course.repository';
import { UsersModule } from 'src/users/users.module';
import { ClassesModule } from 'src/classes/classes.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
    UsersModule,
    ClassesModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CourseRepository],
  exports: [CoursesService, CourseRepository],
})
export class CoursesModule {}
