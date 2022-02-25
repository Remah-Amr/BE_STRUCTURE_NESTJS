import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from 'src/users/models/_user.model';
@Injectable()
export default class UsersSearchService {
  index = 'students';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexUser(user: User) {
    // return this.elasticsearchService.index({
    //   index: this.index,
    //   document: {
    //     id: user.id,
    //     username: user.username,
    //   },
    // });
    await this.elasticsearchService.indices.create({
      index: 'nodejs',
      mappings: {
        properties: {
          join_field: {
            type: 'join',
            relations: {
              department: 'employee',
            },
          },
        },
      },
    });

    await this.elasticsearchService.index({
      index: 'nodejs',
      id: '1',
      document: {
        name: 'Development',
        join_field: 'department',
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      id: '2',
      document: {
        name: 'Marketing',
        join_field: 'department',
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      routing: '1',
      id: '3',
      document: {
        name: 'Bo Andersen',
        age: 28,
        gender: 'M',
        join_field: {
          name: 'employee',
          parent: 1,
        },
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      routing: '2',
      id: '4',
      document: {
        name: 'John Doe',
        age: 44,
        gender: 'M',
        join_field: {
          name: 'employee',
          parent: 2,
        },
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      routing: '1',
      id: '5',
      document: {
        name: 'James Evans',
        age: 32,
        gender: 'M',
        join_field: {
          name: 'employee',
          parent: 1,
        },
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      routing: '1',
      id: '6',
      document: {
        name: 'Daniel Harris',
        age: 52,
        gender: 'M',
        join_field: {
          name: 'employee',
          parent: 1,
        },
      },
    });
    await this.elasticsearchService.index({
      index: 'nodejs',
      routing: '2',
      id: '7',
      document: {
        name: 'Jane Park',
        age: 23,
        gender: 'F',
        join_field: {
          name: 'employee',
          parent: 2,
        },
      },
    });

    await this.elasticsearchService.index({
      index: 'order',
      routing: '1',
      id: '9',
      document: {
        name: 'Christina Parker',
        age: 29,
        gender: 'F',
        join_field: {
          name: 'employee',
          parent: 1,
        },
      },
    });
    1;
  }

  async search(text: string) {
    // const body = await this.elasticsearchService.search({
    //   index: 'nodejs',
    //   query: {
    //     has_child: {
    //       type: 'employee',
    //       inner_hits: {},
    //       query: {
    //         bool: {
    //           must: [
    //             {
    //               range: {
    //                 age: {
    //                   gte: 50,
    //                 },
    //               },
    //             },
    //           ],
    //           should: [
    //             {
    //               term: {
    //                 'gender.keyword': 'M',
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // });
    const body = await this.elasticsearchService.search({
      index: 'order',
      sort: [{ purchased_at: 'desc' }] as any,
      query: {
        match_all: {},
      },
    });

    return body;

    // const hits = body.hits.hits;
    // return hits.map((item) => item._source);
  }
}
