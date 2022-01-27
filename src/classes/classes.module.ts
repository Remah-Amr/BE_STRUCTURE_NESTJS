import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './models/class.model';
import { ClassRepository } from './class.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Class.name,
        schema: ClassSchema,
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),
  ],
  controllers: [ClassesController],
  providers: [ClassesService, ClassRepository],
  exports: [ClassesService, ClassRepository],
})
export class ClassesModule {}
