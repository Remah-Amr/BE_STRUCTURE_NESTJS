import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Constants } from 'src/utils/constants';
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Matches(Constants.PHONE_REGX, { message: 'phone is invalid' })
  phone: string;
}
