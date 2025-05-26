// src/autor/autor.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AutorService } from './autor.service';
import { Autor } from './autor.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';

@Controller('autor')
export class AutorController {
    constructor(private readonly autorService: AutorService) {}

    @Get()
    async findAll(): Promise<Autor[]> {
        return await this.autorService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Autor> {
        return await this.autorService.findOne(id);
    }

    // @Auth(Role.ADMIN)
    @Post()
    async create(@Body() autor: Partial<Autor>): Promise<Autor> {
        return await this.autorService.create(autor);
    }

    // @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() autor: Partial<Autor>,
    ): Promise<Autor> {
        return await this.autorService.update(id, autor);
    }

    // @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.autorService.delete(id);
    }
}