import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuery, FilterQuery } from 'mongoose';
import { Course, CourseDocument } from 'src/courses/models/course.model';
import { UnitDocument } from 'src/units/unit.model';
import { UnitRepository } from 'src/units/unit.repository';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonDocument } from './models/lessos.model';
import { LessonRepository } from './repositories/lesson.repository';

@Injectable()
export class LessonsService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  async create({ names, unit }: CreateLessonDto) {
    const unitDoc: UnitDocument = await this.unitRepository.findOne(
      {
        _id: unit,
      } as FilterQuery<UnitDocument>,
      { populate: 'course' },
    );
    if (!unitDoc) throw new NotFoundException('unit not found');

    const lesson: LessonDocument = await this.lessonRepository.create({
      names,
      unit: {
        id: unit,
        description: unitDoc.description,
      },
      course: {
        id: (unitDoc.course as CourseDocument).id,
        names: (unitDoc.course as CourseDocument).names,
      },
    } as CreateQuery<LessonDocument>);
    return lesson;
  }

  async addStudentToLesson(id: string, studentId: string): Promise<void> {
    return await this.lessonRepository.addStudentToLesson(id, studentId);
  }

  async fetchLessonToStudent(
    id: string,
    studentId: string,
  ): Promise<LessonDocument> {
    return this.lessonRepository.fetchLessonToStudent(id, studentId);
  }
}
