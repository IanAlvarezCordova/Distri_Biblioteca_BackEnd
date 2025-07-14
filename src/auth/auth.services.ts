// src/auth/auth.services.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
        private readonly logger: AppLogger,
    ) {}

    async register({ nombre, apellido, email, password }: RegisterDto) {
        const user = await this.usuarioService.findOneByEmail(email);
        if (user) {
            throw new BadRequestException('Usuario ya existe');
        }
        await this.usuarioService.create({
            nombre,
            apellido,
            email,
            password: await bcrypt.hash(password, 8), // Hashing the password
         

        });
        return { nombre, apellido, email };
    }

    async login({ email, password }: LoginDto) {
        // Buscar usuario por email
        const user = await this.usuarioService.findByEmailWithPassword(email);
        if (!user) {
            this.logger.warn(`Intento de login fallido: usuario con email ${email} no encontrado`);
            throw new UnauthorizedException('Email Incorrecto o no existe');
          }
        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Intento de login fallido: contraseña incorrecta para ${email}`);
            throw new UnauthorizedException('Credenciales Incorrectas');
          }

           // Actualizar ultimo_acceso
           await this.usuarioService.actualizarUltimoAcceso(user.id);

           

        const payload = { id: user.id, email: user.email, roles: user.roles.map(r => r.nombre) };
        const token = await this.jwtService.signAsync(payload);
        this.logger.log(`Login exitoso para: ${email}`);
        return { token, email };
    }

    async profile({ email }: { email: string }) {
        return await this.usuarioService.findOneByEmail(email);
    }
}