import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { LibroService } from './libro.service';
import { Libro } from './libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { AppLogger } from '../common/logger.service'; // Agregar

@Controller('libro')
export class LibroController {
    constructor(
        private readonly libroService: LibroService,
        private readonly logger: AppLogger, // Inyectar logger
    ) {}

    @Get()
    async findAll(): Promise<Libro[]> {
        return await this.libroService.findAll();
    }

    @Get('dashboard')
    async getDashboardStats() {
        return await this.libroService.getDashboardStats();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
        return await this.libroService.findOne(id);
    }

    @Auth(Role.ADMIN)
    @Post()
    async create(@Body() libroData: CreateLibroDto): Promise<Libro> {
        const libro = await this.libroService.create(libroData);
        this.logger.log(`Libro creado: ${libro.titulo}`);
        return libro;
    }

    @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() libro: Partial<Libro>,
    ): Promise<Libro> {
        const updated = await this.libroService.update(id, libro);
        this.logger.log(`Libro actualizado: ID ${id}`);
        return updated;
    }

    @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.libroService.delete(id);
        this.logger.warn(`Libro eliminado: ID ${id}`);
    }
}
