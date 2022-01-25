import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, UnitSchema } from './unit.model';
import { CoursesModule } from 'src/courses/courses.module';
import { UnitRepository } from './unit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Unit.name,
        schema: UnitSchema,
      },
    ]),
    CoursesModule,
  ],
  controllers: [UnitsController],
  providers: [UnitsService, UnitRepository],
  exports: [UnitRepository],
})
export class UnitsModule {}
