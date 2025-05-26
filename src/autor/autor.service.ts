// src/autor/autor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';

@Injectable()
export class AutorService {
    constructor(
        @InjectRepository(Autor)
        private readonly autorRepository: Repository<Autor>,
    ) {}

    async findAll(): Promise<Autor[]> {
        return await this.autorRepository.find({ relations: ['libros'] });
    }

    async findOne(id: number): Promise<Autor> {
        const autor = await this.autorRepository.findOne({
            where: { id },
            relations: ['libros'],
        });
        if (!autor) {
            throw new NotFoundException(`Autor con id ${id} no encontrado`);
        }
        return autor;
    }

    async create(autor: Partial<Autor>): Promise<Autor> {
        const nuevoAutor = this.autorRepository.create(autor);
        return await this.autorRepository.save(nuevoAutor);
    }

    async update(id: number, autor: Partial<Autor>): Promise<Autor> {
        await this.autorRepository.update({ id }, autor);
        return await this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const autor = await this.findOne(id);
        if (autor.libros && autor.libros.length > 0) {
            throw new NotFoundException(`El autor con id ${id} tiene libros asociados y no puede ser eliminado`);
        }
        await this.autorRepository.remove(autor);
    }
}