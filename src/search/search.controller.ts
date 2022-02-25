import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/users/models/_user.model';
import { SearchService } from './search.service';
import UsersSearchService from './usersSearch.service';

@ApiTags('SEARCH')
@Controller('search')
export class SearchController {
  constructor(private readonly usersSearch: UsersSearchService) {}

  @Public()
  @Post()
  async searchUsers(@Body() user: User) {
    return await this.usersSearch.indexUser(user);
  }

  @Public()
  @Post('search2')
  async getUsers(@Body() { text }: any) {
    return await this.usersSearch.search(text);
  }
}
