import {
  Injectable,
  ForbiddenException,
  //   UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const response = await this.prisma.users.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        // throw new ForbiddenException('No User Found');
        return {
          msg: 'No User Found',
        };
      }

      //   compare passwords
      const pwMatches = await bcrypt.compare(dto.password, user.password);
      if (!pwMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const token = await this.signToken(user.id, user.email, user.name);

      return {
        msg: 'Login successful',
        token,
      };
    } catch (error) {
      return error;
    }
  }

  async signToken(
    userId: number,
    email: string,
    name: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      userId,
      email,
      name,
    };

    const token = await this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECERT'),
    });

    return {
      access_token: token,
    };
  }
}
