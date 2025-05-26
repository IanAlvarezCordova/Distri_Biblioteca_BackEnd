// src/categoria/categoria.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {}

    async findAll(): Promise<Categoria[]> {
        return await this.categoriaRepository.find({ relations: ['libros'] });
    }

    async findOne(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
            relations: ['libros'],
        });
        if (!categoria) {
            throw new NotFoundException(`Categoría con id ${id} no encontrada`);
        }
        return categoria;
    }

    async create(categoria: Partial<Categoria>): Promise<Categoria> {
        const existingCategoria = await this.categoriaRepository.findOne({ where: { nombre: categoria.nombre } });
        if (existingCategoria) {
            throw new NotFoundException(`La categoría ${categoria.nombre} ya existe`);
        }
        const nuevaCategoria = this.categoriaRepository.create(categoria);
        return await this.categoriaRepository.save(nuevaCategoria);
    }

    async update(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
        await this.categoriaRepository.update({ id }, categoria);
        return await this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const categoria = await this.findOne(id);
        if (categoria.libros && categoria.libros.length > 0) {
            throw new NotFoundException(`La categoría con id ${id} tiene libros asociados y no puede ser eliminada`);
        }
        await this.categoriaRepository.remove(categoria);
    }
}