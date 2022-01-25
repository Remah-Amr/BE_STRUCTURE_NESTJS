import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuery, FilterQuery } from 'mongoose';
import { CourseRepository } from 'src/courses/course.repository';
import { CourseDocument } from 'src/courses/models/course.model';
import { UserDocument } from 'src/users/models/_user.model';
import { CreateUnitDto } from './dto/create-unit.dto';
import { FilterQueryUnit } from './dto/filterQueryOptions.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument } from './unit.model';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitsService {
  constructor(
    private readonly unitRepository: UnitRepository,
    private readonly courseRepository: CourseRepository,
  ) {}
  async create(createUnitDto: CreateUnitDto) {
    const course = await this.courseRepository.findOne({
      _id: createUnitDto.course,
    } as FilterQuery<CourseDocument>);
    if (!course) throw new NotFoundException('course not found');
    return await this.unitRepository.create(
      createUnitDto as CreateQuery<UnitDocument>,
    );
  }

  async findAll(filterOptions: FilterQueryUnit): Promise<UnitDocument[] | any> {
    return await this.unitRepository.findAllWithPaginationOption(
      filterOptions,
      ['course'],
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  remove(id: number) {
    return `This action removes a #${id} unit`;
  }
}
