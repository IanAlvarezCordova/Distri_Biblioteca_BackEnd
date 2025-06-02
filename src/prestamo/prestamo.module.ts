// src/prestamo/prestamo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { Libro } from '../libro/libro.entity';
import { Usuario } from '../usuario/usuario.entity';
import { DevolucionModule } from '../devolucion/devolucion.module'; // Importar DevolucionModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Prestamo, Libro, Usuario]), DevolucionModule, AuthModule],
    providers: [PrestamoService],
    controllers: [PrestamoController],
    exports: [PrestamoService],
})
export class PrestamoModule {}