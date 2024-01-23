import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TodoService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async getAllTodos(dto: TodoDto, Request) {
    try {
      const response = await this.prisma.todo.findMany({
        orderBy: [{ is_completed: 'asc' }, { id: 'desc' }],
        where: {
          AND: {
            user_id: Request.user?.userId,
            archive: dto.archive ? dto.archive : false,
            is_completed: dto.is_completed,
          },
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
            is_completed: dto.is_completed,
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
      await this.prisma.todo.create({
        data: {
          title: dto.title,
          user_id: Request.user?.userId,
        },
      });
      // return response;
      return this.getAllTodos(dto, Request);
    } catch (error) {
      return error;
    }
  }

  async completeTask(dto: TodoDto, Request) {
    try {
      const checkExistance = await this.prisma.todo.findUnique({
        where: {
          id: Number(dto.id),
        },
      });
      if (!checkExistance) throw new NotFoundException('Task not found');
      await this.prisma.todo.update({
        data: {
          is_completed: checkExistance.is_completed === true ? false : true,
          completed_at: new Date(),
        },
        where: {
          id: Number(dto.id),
        },
      });
      return this.getAllTodos(dto, Request);
      // return response;
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
          is_completed: dto.is_completed,
          completed_at: dto.is_completed === false ? null : undefined,
        },
      });
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async deleteTask(dto: TodoDto, Request) {
    try {
      const checkExistance = await this.prisma.todo.findUnique({
        where: {
          id: Number(dto.id),
        },
      });

      if (checkExistance.is_completed) {
        await this.prisma.todo.update({
          where: {
            id: Number(dto.id),
          },
          data: {
            archive: true,
          },
        });
      } else {
        await this.prisma.todo.delete({
          where: {
            id: Number(dto.id),
          },
        });
      }

      return this.getAllTodos(dto, Request);
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
