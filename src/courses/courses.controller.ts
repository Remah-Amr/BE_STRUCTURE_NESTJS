import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { FilterQuery, PaginateResult } from 'mongoose';
import { Class } from 'src/classes/models/class.model';
import { Name } from 'src/classes/models/name.model';
import { User } from 'src/users/models/_user.model';
import { ApiOkResponseGeneral } from 'src/utils/pagination/ApiOkResponseGeneral';
import PaginatedDto from 'src/utils/pagination/paginated.dto';
import ParamsWithId from 'src/utils/paramsWithId.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { FilterQueryOptionsCourse } from './dto/filterQueryOptions.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './models/course.model';

@ApiBearerAuth()
@ApiTags('COURSES')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<CourseDocument> {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':id')
  update(
    @Param() { id }: ParamsWithId,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseDocument> {
    return this.coursesService.update(
      { _id: id } as FilterQuery<CourseDocument>,
      updateCourseDto,
    );
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId): Promise<CourseDocument> {
    return this.coursesService.findOne({
      _id: id,
    } as FilterQuery<CourseDocument>);
  }

  @ApiOkResponse({
    schema: {
      title: `PaginatedResponseOfCourse`,
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            docs: {
              type: 'array',
              items: {
                properties: {
                  id: {
                    type: 'string',
                  },
                  teacher: {
                    allOf: [{ $ref: getSchemaPath(User) }],
                  },
                  class: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(Name),
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsCourse,
  ): Promise<PaginateResult<CourseDocument> | CourseDocument[]> {
    return await this.coursesService.findAll(
      queryFiltersAndOptions as FilterQueryOptionsCourse,
    );
  }
}
