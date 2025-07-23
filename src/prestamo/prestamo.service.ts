// src/prestamo/prestamo.service.ts (corregido)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { Libro } from '../libro/libro.entity';
import { Usuario } from '../usuario/usuario.entity';
import { DevolucionService } from '../devolucion/devolucion.service'; // Importar el servicio, no el repositorio

@Injectable()
export class PrestamoService {
    constructor(
        @InjectRepository(Prestamo)
        private readonly prestamoRepository: Repository<Prestamo>,
        @InjectRepository(Libro)
        private readonly libroRepository: Repository<Libro>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly devolucionService: DevolucionService, // Inyectar DevolucionService
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

    async findByUsuario(usuarioId: number): Promise<Prestamo[]> {
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) {
            throw new NotFoundException(`Usuario con id ${usuarioId} no encontrado`);
        }
        return await this.prestamoRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['libro', 'usuario'],
        });
    }

   async create(prestamo: Partial<Prestamo>, usuarioId: number, isAdmin: boolean, targetUsuarioId?: number): Promise<Prestamo> {
    const usuario = isAdmin && targetUsuarioId
        ? await this.usuarioRepository.findOne({ where: { id: targetUsuarioId } })
        : await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
        throw new NotFoundException(`Usuario con id ${isAdmin && targetUsuarioId ? targetUsuarioId : usuarioId} no encontrado`);
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

    async update(id: number, prestamoData: Partial<Prestamo>): Promise<Prestamo> {
        const existingPrestamo = await this.findOne(id);
        if (prestamoData.devuelto && !existingPrestamo.devuelto) {
            // Llamar a DevolucionService para registrar la devolución
            await this.devolucionService.create(existingPrestamo.id, existingPrestamo.usuario.id);
        }
        Object.assign(existingPrestamo, prestamoData);
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

    async count(): Promise<number> {
        return await this.prestamoRepository.count();
    }

// src/prestamo/prestamo.service.ts
async getPrestamosMensuales(): Promise<{ mes: string; total: string }[]> {
    return this.prestamoRepository
        .createQueryBuilder('prestamo')
        .select("TO_CHAR(prestamo.fecha_prestamo, 'YYYY-MM')", 'mes')
        .addSelect('COUNT(*)', 'total')
        .groupBy("TO_CHAR(prestamo.fecha_prestamo, 'YYYY-MM')")
        .orderBy('mes', 'ASC')
        .getRawMany();
}



}