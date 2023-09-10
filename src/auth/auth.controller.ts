import { Public } from './../custom-decorators/public.decoratot';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getMe(@Request() req) {
    return req.user;
  }
}
