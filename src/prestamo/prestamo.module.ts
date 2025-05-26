// src/prestamo/prestamo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { AuthModule } from '../auth/auth.module';
import { Libro } from '../libro/libro.entity';
import { Usuario } from '../usuario/usuario.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Prestamo, Libro, Usuario]), AuthModule],
    controllers: [PrestamoController],
    providers: [PrestamoService],
    exports: [PrestamoService],
})
export class PrestamoModule {}