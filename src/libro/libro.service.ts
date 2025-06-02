// src/libro/libro.service.ts (actualizado)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { Categoria } from '../categoria/categoria.entity';
import { Autor } from '../autor/autor.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { PrestamoService } from '../prestamo/prestamo.service';
import { DevolucionService } from '../devolucion/devolucion.service';

@Injectable()
export class LibroService {
    constructor(
        @InjectRepository(Libro)
        private readonly libroRepository: Repository<Libro>,
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
        @InjectRepository(Autor)
        private readonly autorRepository: Repository<Autor>,
        private readonly prestamoService: PrestamoService,
        private readonly devolucionService: DevolucionService,
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
                    if (error.code === '23505') {
                        throw new BadRequestException(`La categoría '${libroData.categoria.nombre}' ya existe`);
                    }
                    throw error;
                }
            }
        }

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

        const nuevoLibro = this.libroRepository.create({
            ...libroData,
            categoria,
            autor,
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

    async countDisponibles(): Promise<number> {
        return await this.libroRepository.count({ where: { disponible: true } });
    }

    async getLibrosPorCategoria(): Promise<any[]> {
        return await this.libroRepository
            .createQueryBuilder('libro')
            .select(['categoria.nombre', 'COUNT(libro.id) as total'])
            .leftJoin('libro.categoria', 'categoria')
            .groupBy('categoria.nombre')
            .getRawMany();
    }

// src/libro/libro.service.ts (actualizado)
async getDashboardStats(): Promise<any> {
    
    try {
        
        const librosDisponibles = await this.countDisponibles();
        

        
        const prestamos = await this.prestamoService.count();
        

        
        const devoluciones = await this.devolucionService.count();
        

        
        const librosPorCategoria = await this.getLibrosPorCategoria();
        

        
        const prestamosMensuales = await this.prestamoService.getPrestamosMensuales();
        

        
        const devolucionesMensuales = await this.devolucionService.getDevolucionesMensuales();
       

        // Combinar préstamos y devoluciones por mes
        const meses = Array.from(
            new Set([
                ...prestamosMensuales.map((p: any) => p.mes),
                ...devolucionesMensuales.map((d: any) => d.mes),
            ]),
        ).sort();

        const prestamosDevolucionesMensuales = meses.map((mes) => {
            const prestamo = prestamosMensuales.find((p: any) => p.mes === mes) || { total: '0' };
            const devolucion = devolucionesMensuales.find((d: any) => d.mes === mes) || { total: '0' };
            

            // Forzar que total sea un número válido
            const prestamoTotal = typeof prestamo.total === 'string' && !isNaN(parseInt(prestamo.total, 10)) ? prestamo.total : '0';
            const devolucionTotal = typeof devolucion.total === 'string' && !isNaN(parseInt(devolucion.total, 10)) ? devolucion.total : '0';

            return {
                mes,
                prestamos: parseInt(prestamoTotal, 10),
                devoluciones: parseInt(devolucionTotal, 10),
            };
        });

        return {
            librosDisponibles,
            prestamos,
            devoluciones,
            librosPorCategoria,
            prestamosDevolucionesMensuales,
        };
    } catch (error) {
        console.error('Error en getDashboardStats:', error);
        throw new BadRequestException('Error al procesar las estadísticas del dashboard');
    }
}
}