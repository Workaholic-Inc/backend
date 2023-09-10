import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Module({
  imports: [ConfigModule],
  providers: [TodoService, { provide: APP_GUARD, useClass: AuthGuard }],
  controllers: [TodoController],
})
export class TodoModule {}
