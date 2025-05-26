// src/categoria/categoria.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from './categoria.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';

@Controller('categoria')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    async findAll(): Promise<Categoria[]> {
        return await this.categoriaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
        return await this.categoriaService.findOne(id);
    }

    // @Auth(Role.ADMIN)
    @Post()
    async create(@Body() categoria: Partial<Categoria>): Promise<Categoria> {
        return await this.categoriaService.create(categoria);
    }

    // @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() categoria: Partial<Categoria>,
    ): Promise<Categoria> {
        return await this.categoriaService.update(id, categoria);
    }

    // @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.categoriaService.delete(id);
    }
}