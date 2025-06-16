import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signupDto: SignupDto,
  ): Promise<{ message: string; id: string }> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!body.refreshToken || typeof body.refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshDto: RefreshDto = { refreshToken: body.refreshToken };
    return this.authService.refresh(refreshDto);
  }
}
