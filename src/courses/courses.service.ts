import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuery, FilterQuery, PaginateResult } from 'mongoose';
import { ClassRepository } from 'src/classes/class.repository';
import { ClassDocument } from 'src/classes/models/class.model';
import { UserDocument } from 'src/users/models/_user.model';
import { UserRepository } from 'src/users/users.repository';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { FilterQueryOptionsCourse } from './dto/filterQueryOptions.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDocument } from './models/course.model';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: UserRepository,
    private readonly classRepository: ClassRepository,
  ) {}

  async create({
    classId,
    teacher,
    names,
  }: CreateCourseDto): Promise<CourseDocument> {
    const user: UserDocument = await this.userRepository.findOne({
      _id: teacher,
      role: 'teacher',
    } as FilterQuery<UserDocument>);
    if (!user) throw new NotFoundException('teacher not found');

    const classDoc: ClassDocument = await this.classRepository.findOne({
      _id: classId,
    } as FilterQuery<ClassDocument>);
    if (!classDoc) throw new NotFoundException('class not found');
    console.log(names);
    return await this.courseRepository.create({
      class: { id: classId, names: classDoc.names },
      teacher: { id: teacher, username: user.username },
      names,
    } as CreateQuery<CourseDocument>);
  }

  async update(
    filter: FilterQuery<CourseDocument>,
    { names }: UpdateCourseDto,
  ): Promise<CourseDocument> {
    return await this.courseRepository.updateOne(filter, { names });
  }

  async findOne(filter: FilterQuery<CourseDocument>): Promise<CourseDocument> {
    return await this.courseRepository.findOne(filter, {
      populate: ['class.id', 'teacher.id'],
    });
  }

  async findAll(
    queryFiltersAndOptions: FilterQueryOptionsCourse,
  ): Promise<PaginateResult<CourseDocument> | CourseDocument[]> {
    const users = await this.courseRepository.findAllWithPaginationOption(
      queryFiltersAndOptions,
      ['teacher', 'class', 'from', 'to'],
      { populate: ['class.id', 'teacher.id'] },
    );
    return users;
  }
}
