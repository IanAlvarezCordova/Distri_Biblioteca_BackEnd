// src/auth/auth.services.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
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
        const user = await this.usuarioService.findByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('Email es incorrecto');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña es incorrecta');
        }
        const payload = { id: user.id, email: user.email, roles: user.roles.map(r => r.nombre) };
        const token = await this.jwtService.signAsync(payload);
        return { token, email };
    }

    async profile({ email }: { email: string }) {
        return await this.usuarioService.findOneByEmail(email);
    }
}