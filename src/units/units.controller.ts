import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterQueryUnit } from './dto/filterQueryOptions.dto';
import { UnitDocument } from './unit.model';

@ApiBearerAuth()
@ApiTags('UNITS')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  async findAll(
    @Query() queryFilters: FilterQueryUnit,
  ): Promise<UnitDocument[] | any> {
    return await this.unitsService.findAll(queryFilters);
  }
}
