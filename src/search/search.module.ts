import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { SearchController } from './search.controller';
import UsersSearchService from './usersSearch.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  exports: [ElasticsearchModule],
  controllers: [SearchController],
  providers: [UsersSearchService, UsersService],
})
export class SearchModule {}
