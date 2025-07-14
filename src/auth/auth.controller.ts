// src/auth/auth.controller.ts
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { AppLogger } from '../common/logger.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger, // Inyectar el logger
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Nuevo usuario registrado: ${registerDto.email}`);
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200) // Respuesta 200 OK para login exitoso
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Solicitud de login para: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    this.logger.debug(`Perfil consultado para: ${user.email}`);
    return this.authService.profile(user);
  }
}