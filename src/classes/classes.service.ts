import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Class, ClassDocument } from './models/class.model';
import { ClassRepository } from './class.repository';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CreateQuery, FilterQuery } from 'mongoose';

@Injectable()
export class ClassesService {
  constructor(private readonly ClassRepository: ClassRepository) {}
  async create({ names }: CreateClassDto): Promise<ClassDocument> {
    return await this.ClassRepository.create({
      names,
    } as CreateQuery<ClassDocument>);
  }

  findAll() {
    return `This action returns all classes`;
  }

  async findOne(id: string) {
    const doc = await this.ClassRepository.findOne({ _id: id });
    if (!doc) throw new NotFoundException('class not found');
    return doc;
  }

  async update(
    id: string,
    updateClassDto: UpdateClassDto,
  ): Promise<ClassDocument> {
    return await this.ClassRepository.updateOne(
      { _id: id } as FilterQuery<ClassDocument>,
      updateClassDto,
    );
  }

  async remove(id: string): Promise<void> {
    return await this.ClassRepository.deleteOne({ _id: id });
  }
}
