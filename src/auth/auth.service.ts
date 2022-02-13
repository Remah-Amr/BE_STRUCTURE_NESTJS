import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';
import TokenPayload from './interfaces/tokenPayload.interface';
import { LoginGoogleDto } from './dto/login-google.dto';
import { User, UserDocument } from 'src/users/models/_user.model';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserNotFoundException } from 'src/users/exceptions/userNotFound.exception';
import { JwtService } from '@nestjs/jwt';
import { StudentDocument } from 'src/users/models/student.model';
import { CreateQuery, FilterQuery, Model, Connection } from 'mongoose';
import { UserRepository } from 'src/users/users.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async register(registerationData: RegisterDto): Promise<StudentDocument> {
    let user = await this.userRepository.findOne({
      phone: registerationData.phone,
    } as FilterQuery<UserDocument>);
    if (user) throw new BadRequestException('phone should be unique');
    // user = await this.userRepository.create({
    //   ...registerationData,
    //   role: 'student',
    // } as CreateQuery<UserDocument>);
    user = await this.userRepository.createDoc({
      ...registerationData,
      role: 'student',
    } as User);
    return user;
  }

  async login(loginDto: LoginDto): Promise<{
    user: UserDocument;
    token: string;
  }> {
    const { phone } = loginDto;
    let user = await this.userRepository.findOne({
      phone,
    } as FilterQuery<UserDocument>);
    if (!user) throw new UserNotFoundException();
    if (!(await (user as any).isValidPassword(loginDto.password)))
      throw new UnauthorizedException('invalid credentials');

    if (user.enabled === false)
      throw new UnauthorizedException('your account is deactivated');
    const payload: TokenPayload = {
      userId: user.id,
    };
    const options = {};
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return { user, token };
  }

  async loginGoogle(user: UserDocument): Promise<UserDocument> {
    return user;
  }

  async loginFacebook({
    accessToken,
  }: LoginFacebookDto): Promise<UserDocument> {
    const { data } = await axios(
      `${this.configService.get<string>(
        'facebookUrl',
      )}&access_token=${accessToken}`,
    );
    const { id, name, email } = data;
    let user = await this.userRepository.findOne({
      facebookId: id,
    } as FilterQuery<UserDocument>);
    if (!user) {
      user = await this.userRepository.create({
        username: name,
        email,
        facebookId: id,
        role: 'student',
      } as CreateQuery<UserDocument>);
    }
    return user;
  }

  async verifyUserByTokenFromSocket(
    token: string,
  ): Promise<false | UserDocument> {
    try {
      const decoded: TokenPayload = await this.jwtService.verify(token);
      if (decoded.userId === undefined) {
        return false;
      }

      const user = await this.userRepository.findOne({
        _id: decoded.userId,
      } as FilterQuery<UserDocument>);

      if (!user || user.enabled === false) {
        return false;
      }
      return user;
    } catch (err) {
      return false;
    }
  }

  async testTransaction() {
    const session = await this.connection.startSession();

    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });
    let user;
    try {
      // await this.userModel.deleteMany();
      user = await this.userModel.find().session(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    return user;
  }

  async testTransaction2() {
    const session = await this.connection.startSession();

    session.startTransaction({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });
    try {
      let user = await this.userModel.create(
        [
          {
            username: 'remah',
            role: 'student',
          },
        ],
        { session: session },
      );

      console.log('after insert');
      for (let i = 0; i < 100; i++) {
        await this.userModel.findOne().session(session);
      }
      console.log('after loop');
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
