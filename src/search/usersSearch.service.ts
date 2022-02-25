import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from 'src/users/models/_user.model';
@Injectable()
export default class UsersSearchService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    try {
      await this.elasticsearchService.indices.create({
        index: 'stemming_test_3',
        settings: {
          analysis: {
            filter: {
              synonym_test: {
                type: 'synonym',
                synonyms: ['firm => company', 'love, enjoy'],
              },
              stemmer_test: {
                type: 'stemmer',
                language: 'english',
              },
            },
            analyzer: {
              my_analyzer_3: {
                tokenizer: 'standard',
                filter: ['lowercase', 'synonym_test', 'stemmer_test'],
                type: 'custom',
              },
            },
          },
        },
        mappings: {
          properties: {
            description: {
              type: 'text',
              analyzer: 'my_analyzer_3',
            },
          },
        },
      });
    } catch (err) {}
  }
  index = 'stemming_test_3';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexUser(user: User) {
    return this.elasticsearchService.index({
      index: this.index,
      document: {
        description: 'I love working for my firm!',
      },
    });
  }

  async search(text: string) {
    return this.elasticsearchService.search({
      index: this.index,
      query: {
        match: {
          description: 'enjoy work',
        },
      },
      highlight: {
        fields: {
          description: {},
        },
      },
    });
  }
}
