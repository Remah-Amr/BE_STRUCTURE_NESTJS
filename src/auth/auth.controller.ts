import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { PhoneConfirmationService } from 'src/phone-confirmation/phone-confirmation.service';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { GoogleOauthGuard } from './guards/googleToken.guard';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument } from 'src/users/models/_user.model';
import { CheckCodeToResetDto } from './dto/check-code-to-reset.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { StudentDocument } from 'src/users/models/student.model';
import { FilterQuery } from 'mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRepository } from 'src/users/users.repository';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly phoneConfirmationService: PhoneConfirmationService,
    @Inject(REQUEST) private readonly req: Record<string, unknown>,
  ) {}

  @Public()
  @Post('/signup')
  async register(@Body() RegisterDto: RegisterDto): Promise<StudentDocument> {
    let user = await this.authService.register(RegisterDto);
    await this.phoneConfirmationService.sendSMS({
      phone: RegisterDto.phone,
    });
    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() LoginDto: LoginDto): Promise<{
    user: UserDocument;
    token: string;
  }> {
    return await this.authService.login(LoginDto);
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Post('/login-googel')
  async loginGoogle(
    @Body() _loginGoogleData: LoginGoogleDto,
  ): Promise<UserDocument> {
    return await this.authService.loginGoogle(this.req.me as UserDocument);
  }

  @Public()
  @Post('/login-facebook')
  async loginFacebook(
    @Body() { accessToken }: LoginFacebookDto,
  ): Promise<UserDocument> {
    return await this.authService.loginFacebook({ accessToken });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/check-code-to-reset')
  async checkCodeToReset(
    @Body() { phone, code }: CheckCodeToResetDto,
  ): Promise<void> {
    return await this.phoneConfirmationService.verificationCode({
      phone,
      code,
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() { phone, code, password }: ResetPasswordDto,
  ): Promise<UserDocument> {
    await this.phoneConfirmationService.verificationCode({ phone, code });
    return await this.userRepository.updateOne(
      { phone } as FilterQuery<UserDocument>,
      { password } as UpdateUserDto,
    );
  }

  @Public()
  @Post('transaction')
  async testTransaction(){
    return await this.authService.testTransaction()
  }

  @Public()
  @Post('transaction2')
  async testTransaction2(){
    return await this.authService.testTransaction2()
  }
}
