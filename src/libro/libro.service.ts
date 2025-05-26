// src/libro/libro.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Autor } from '../autor/autor.entity';
import { CreateLibroDto } from './dto/create-libro.dto';

@Injectable()
export class LibroService {
    constructor(
        @InjectRepository(Libro)
        private readonly libroRepository: Repository<Libro>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @InjectRepository(Autor)
        private readonly autorRepository: Repository<Autor>,
    ) {}

    async findAll(): Promise<Libro[]> {
        return await this.libroRepository.find({ relations: ['categoria', 'autor', 'prestamos'] });
    }

    async findOne(id: number): Promise<Libro> {
        const libro = await this.libroRepository.findOne({
            where: { id },
            relations: ['categoria', 'autor', 'prestamos'],
        });
        if (!libro) {
            throw new NotFoundException(`Libro con id ${id} no encontrado`);
        }
        return libro;
    }

    async create(libroData: CreateLibroDto): Promise<Libro> {
        // Manejar categoría
        let categoria: Categoria | null = null;
        if (libroData.categoria.id) {
            categoria = await this.categoriaRepository.findOne({ where: { id: libroData.categoria.id } });
            if (!categoria) {
                throw new NotFoundException(`Categoría con id ${libroData.categoria.id} no encontrada`);
            }
        } else {
            categoria = await this.categoriaRepository.findOne({ where: { nombre: libroData.categoria.nombre } });
            if (!categoria) {
                try {
                    categoria = this.categoriaRepository.create({ nombre: libroData.categoria.nombre });
                    await this.categoriaRepository.save(categoria);
                } catch (error) {
                    if (error.code === '23505') { // Violación de unicidad en PostgreSQL
                        throw new BadRequestException(`La categoría '${libroData.categoria.nombre}' ya existe`);
                    }
                    throw error;
                }
            }
        }

        // Manejar autor
        let autor: Autor | null = null;
        if (libroData.autor.id) {
            autor = await this.autorRepository.findOne({ where: { id: libroData.autor.id } });
            if (!autor) {
                throw new NotFoundException(`Autor con id ${libroData.autor.id} no encontrado`);
            }
        } else {
            autor = await this.autorRepository.findOne({ where: { nombre: libroData.autor.nombre } });
            if (!autor) {
                autor = this.autorRepository.create({ nombre: libroData.autor.nombre });
                await this.autorRepository.save(autor);
            }
        }

        // Crear libro
        const nuevoLibro = this.libroRepository.create({
            ...libroData,
            categoria: categoria!,
            autor: autor!,
            disponible: libroData.disponible ?? true,
        });

        return await this.libroRepository.save(nuevoLibro);
    }

    async update(id: number, libro: Partial<Libro>): Promise<Libro> {
        await this.findOne(id);
        await this.libroRepository.update({ id }, libro);
        return await this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const libro = await this.findOne(id);
        if (libro.prestamos && libro.prestamos.length > 0) {
            throw new BadRequestException(`El libro con id ${id} tiene préstamos asociados y no puede ser eliminado`);
        }
        await this.libroRepository.remove(libro);
    }
}