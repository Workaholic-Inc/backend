import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TodoDto } from './todo-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TodoService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async getAllTodos(Request) {
    try {
      const response = await this.prisma.todo.findMany({
        where: {
          user_id: Request.user?.userId,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async getTodosbyStatus(dto: TodoDto, Request) {
    try {
      const response = await this.prisma.todo.findMany({
        where: {
          AND: {
            user_id: Request.user?.userId,
            is_completed: dto.is_complete,
          },
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async createTask(dto: TodoDto, Request) {
    try {
      const response = await this.prisma.todo.create({
        data: {
          title: dto.title,
          user_id: Request.user?.userId,
        },
      });
      return response;
    } catch (error) {
      console.log(error);

      return error;
    }
  }

  async completeTask(dto: TodoDto) {
    try {
      const response = await this.prisma.todo.update({
        data: {
          is_completed: true,
          completed_at: new Date(),
        },
        where: {
          id: Number(dto.id),
        },
      });

      return response;
    } catch (error) {
      return error.message;
    }
  }

  async updateTask(dto: TodoDto) {
    try {
      const response = await this.prisma.todo.update({
        where: {
          id: Number(dto.id),
        },
        data: {
          title: dto.title,
          is_completed: dto.is_complete,
          completed_at: dto.is_complete === false ? null : undefined,
        },
      });
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async deleteTask(dto: TodoDto) {
    try {
      const response = await this.prisma.todo.update({
        where: {
          id: Number(dto.id),
        },
        data: {
          archive: true,
        },
      });
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async extractTokenFromHeader(request: any): Promise<string | undefined> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECERT'),
      });
      return payload;
    } catch (error) {
      return error.message;
    }
  }
}
