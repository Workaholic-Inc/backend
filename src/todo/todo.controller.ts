import { TodoService } from './todo.service';
import { Post, Controller, Body, Request, Get } from '@nestjs/common';
import { TodoDto } from './todo-dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get('get-all-todos')
  getAllTodos(@Request() req) {
    return this.todoService.getAllTodos(req);
  }

  @Post('get-todo-by-status')
  getTodosbyStatus(@Body() dto: TodoDto, @Request() req) {
    return this.todoService.getTodosbyStatus(dto, req);
  }

  @Post('create-task')
  createTask(@Body() dto: TodoDto, @Request() req) {
    return this.todoService.createTask(dto, req);
  }

  @Post('complete-task')
  completeTask(@Body() dto: any) {
    return this.todoService.completeTask(dto);
  }

  @Post('update-task')
  updateTask(@Body() dto: any) {
    return this.todoService.updateTask(dto);
  }

  @Post('delete-task')
  deleteTask(@Body() dto: any) {
    return this.todoService.deleteTask(dto);
  }
}
