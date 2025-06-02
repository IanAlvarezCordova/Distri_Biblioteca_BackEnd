// src/libro/libro.controller.ts (actualizado)
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { LibroService } from './libro.service';
import { Libro } from './libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';

@Controller('libro')
export class LibroController {
    constructor(private readonly libroService: LibroService) {}

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
        return await this.libroService.create(libroData);
    }

    @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() libro: Partial<Libro>,
    ): Promise<Libro> {
        return await this.libroService.update(id, libro);
    }

    @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.libroService.delete(id);
    }

    
 
    
}