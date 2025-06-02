// src/devolucion/devolucion.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devolucion } from './devolucion.entity';
import { Prestamo } from '../prestamo/prestamo.entity';
import { Libro } from '../libro/libro.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class DevolucionService {
    constructor(
        @InjectRepository(Devolucion)
        private readonly devolucionRepository: Repository<Devolucion>,
        @InjectRepository(Prestamo)
        private readonly prestamoRepository: Repository<Prestamo>,
        @InjectRepository(Libro)
        private readonly libroRepository: Repository<Libro>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async create(prestamoId: number, usuarioId: number): Promise<Devolucion> {
        // Verificar que el préstamo existe y no está devuelto
        const prestamo = await this.prestamoRepository.findOne({
            where: { id: prestamoId },
            relations: ['usuario', 'libro'],
        });
        if (!prestamo) {
            throw new NotFoundException(`Préstamo con id ${prestamoId} no encontrado`);
        }
        if (prestamo.devuelto) {
            throw new BadRequestException(`El préstamo con id ${prestamoId} ya ha sido devuelto`);
        }

        // Verificar que el usuario coincide con el que pidió el préstamo
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
        }
        if (prestamo.usuario.id !== usuarioId) {
            throw new BadRequestException(`El usuario con id ${usuarioId} no coincide con el usuario del préstamo`);
        }

        // Actualizar el estado del préstamo
        prestamo.devuelto = true;
        prestamo.fecha_devolucion = new Date();
        await this.prestamoRepository.save(prestamo);

        // Actualizar el estado del libro
        const libro = await this.libroRepository.findOne({ where: { id: prestamo.libro.id } });
        if (!libro) {
            throw new NotFoundException(`Libro con id ${prestamo.libro.id} no encontrado`);
        }
        libro.disponible = true;
        await this.libroRepository.save(libro);

        // Crear la devolución
        const devolucion = this.devolucionRepository.create({
            prestamo,
            usuario,
            libro,
            fecha_devolucion: new Date(),
        });

        return await this.devolucionRepository.save(devolucion);
    }

    async findAll(): Promise<Devolucion[]> {
        return await this.devolucionRepository.find({ relations: ['prestamo', 'usuario', 'libro'] });
    }

    async findOne(id: number): Promise<Devolucion> {
        const devolucion = await this.devolucionRepository.findOne({
            where: { id },
            relations: ['prestamo', 'usuario', 'libro'],
        });
        if (!devolucion) {
            throw new NotFoundException(`Devolución con id ${id} no encontrada`);
        }
        return devolucion;
    }

    async count(): Promise<number> {
        return await this.devolucionRepository.count();
    }

// src/devolucion/devolucion.service.ts
async getDevolucionesMensuales(): Promise<{ mes: string; total: string }[]> {
    return this.devolucionRepository
        .createQueryBuilder('devolucion')
        .select("TO_CHAR(devolucion.fecha_devolucion, 'YYYY-MM')", 'mes')
        .addSelect('COUNT(*)', 'total')
        .groupBy("TO_CHAR(devolucion.fecha_devolucion, 'YYYY-MM')")
        .orderBy('mes', 'ASC')
        .getRawMany();
}


}