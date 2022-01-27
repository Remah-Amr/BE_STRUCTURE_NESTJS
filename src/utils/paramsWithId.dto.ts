import { IsMongoId, IsOptional } from 'class-validator';

class ParamsWithId {
  @IsOptional()
  @IsMongoId()
  id: string;
}

export default ParamsWithId;
