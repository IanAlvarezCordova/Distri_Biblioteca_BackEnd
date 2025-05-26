// src/prestamo/prestamo.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { Libro } from '../libro/libro.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class PrestamoService {
    constructor(
        @InjectRepository(Prestamo)
        private readonly prestamoRepository: Repository<Prestamo>,
        @InjectRepository(Libro)
        private readonly libroRepository: Repository<Libro>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async findAll(): Promise<Prestamo[]> {
        return await this.prestamoRepository.find({ relations: ['usuario', 'libro'] });
    }

    async findOne(id: number): Promise<Prestamo> {
        const prestamo = await this.prestamoRepository.findOne({
            where: { id },
            relations: ['usuario', 'libro'],
        });
        if (!prestamo) {
            throw new NotFoundException(`Préstamo con id ${id} no encontrado`);
        }
        return prestamo;
    }

    async create(prestamo: Partial<Prestamo>, usuarioId: number): Promise<Prestamo> {
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
        }
        const libro = await this.libroRepository.findOne({ where: { id: prestamo.libro?.id } });
        if (!libro) {
            throw new NotFoundException(`Libro con id ${prestamo.libro?.id} no encontrado`);
        }
        if (!libro.disponible) {
            throw new BadRequestException(`El libro con id ${prestamo.libro?.id} no está disponible`);
        }
        libro.disponible = false;
        await this.libroRepository.save(libro);
        const nuevoPrestamo = this.prestamoRepository.create({ ...prestamo, usuario, libro });
        return await this.prestamoRepository.save(nuevoPrestamo);
    }

    async update(id: number, prestamo: Partial<Prestamo>): Promise<Prestamo> {
        const existingPrestamo = await this.findOne(id);
        if (prestamo.devuelto && !existingPrestamo.devuelto) {
            const libro = await this.libroRepository.findOne({ where: { id: existingPrestamo.libro.id } });
            if (libro) {
                libro.disponible = true;
                await this.libroRepository.save(libro);
            }
        }
        Object.assign(existingPrestamo, prestamo);
        return await this.prestamoRepository.save(existingPrestamo);
    }

    async delete(id: number): Promise<void> {
        const prestamo = await this.findOne(id);
        if (!prestamo.devuelto) {
            const libro = await this.libroRepository.findOne({ where: { id: prestamo.libro.id } });
            if (libro) {
                libro.disponible = true;
                await this.libroRepository.save(libro);
            }
        }
        await this.prestamoRepository.remove(prestamo);
    }
}