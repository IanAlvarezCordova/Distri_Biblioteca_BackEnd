// src/libro/libro.module.ts (corregido)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { Categoria } from '../categoria/categoria.entity';
import { Autor } from '../autor/autor.entity';
import { PrestamoModule } from '../prestamo/prestamo.module'; // Importar PrestamoModule
import { DevolucionModule } from '../devolucion/devolucion.module'; // Importar DevolucionModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Libro, Categoria, Autor]),
        PrestamoModule, // Importar PrestamoModule para acceder a PrestamoService
        DevolucionModule, // Importar DevolucionModule para acceder a DevolucionService
        AuthModule,
    ],
    providers: [LibroService],
    controllers: [LibroController],
    exports: [LibroService],
})
export class LibroModule {}