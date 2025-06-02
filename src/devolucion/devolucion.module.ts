// src/devolucion/devolucion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devolucion } from './devolucion.entity';
import { DevolucionService } from './devolucion.service';
import { DevolucionController } from './devolucion.controller';
import { Libro } from '../libro/libro.entity';
import { Prestamo } from '../prestamo/prestamo.entity';
import { Usuario } from '../usuario/usuario.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Devolucion, Libro, Prestamo, Usuario]), AuthModule],
    providers: [DevolucionService],
    controllers: [DevolucionController],
    exports: [DevolucionService],
})
export class DevolucionModule {}