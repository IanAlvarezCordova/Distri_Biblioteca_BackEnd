// src/libro/libro.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { AuthModule } from '../auth/auth.module';
import { Categoria } from '../categoria/categoria.entity';
import { Autor } from '../autor/autor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Libro, Categoria, Autor]),
        AuthModule
    ],
    controllers: [LibroController],
    providers: [LibroService],
    exports: [LibroService],
})
export class LibroModule {}
