import { IsMongoId, IsOptional } from 'class-validator';

class addAnswerParams {
  @IsOptional()
  @IsMongoId()
  questionid?: string;

  @IsOptional()
  @IsMongoId()
  examid?: string;
}

export default addAnswerParams;
