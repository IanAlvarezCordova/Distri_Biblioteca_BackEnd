import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode, Logger } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './categoria.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';

// src/categoria/categoria.controller.ts

@Controller('categoria')
export class CategoriaController {
    private readonly logger = new Logger(CategoriaController.name);

    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    async findAll(): Promise<Categoria[]> {
        this.logger.log('Obteniendo todas las categorías');
        return await this.categoriaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
        this.logger.log(`Obteniendo la categoría con id: ${id}`);
        return await this.categoriaService.findOne(id);
    }

    // @Auth(Role.ADMIN)
    @Post()
    async create(@Body() categoria: Partial<Categoria>): Promise<Categoria> {
        this.logger.log('Creando una nueva categoría', JSON.stringify(categoria));
        return await this.categoriaService.create(categoria);
    }

    // @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() categoria: Partial<Categoria>,
    ): Promise<Categoria> {
        this.logger.log(`Actualizando la categoría con id: ${id}`, JSON.stringify(categoria));
        return await this.categoriaService.update(id, categoria);
    }

    // @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        this.logger.log(`Eliminando la categoría con id: ${id}`);
        return await this.categoriaService.delete(id);
    }
}
