// src/autor/autor.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AutorService } from './autor.service';
import { Autor } from './autor.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { AppLogger } from '../common/logger.service';

@Controller('autor')
export class AutorController {
  constructor(
    private readonly autorService: AutorService,
    private readonly logger: AppLogger, // Inyecta el logger
  ) {}

@Get()
async findAll(): Promise<Autor[]> {
  this.logger.log('Solicitud para obtener todos los autores');
  try {
    const autores = await this.autorService.findAll();
    this.logger.log(`Encontrados ${autores.length} autores`);
    return autores;
  } catch (error) {
    this.logger.error(`Error al obtener autores: ${error.message}`, error.stack);
    throw error;
  }
}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Autor> {
    
    return await this.autorService.findOne(id);
  }
  // @Auth(Role.ADMIN)
  @Post()
  async create(@Body() autor: Partial<Autor>): Promise<Autor> {
    this.logger.log(`Creando nuevo autor: ${autor.nombre}`);
    return await this.autorService.create(autor);
  }

  // @Auth(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() autor: Partial<Autor>,
  ): Promise<Autor> {
    this.logger.log(`Actualizando autor con ID ${id}`);
    return await this.autorService.update(id, autor);
  }
 //@Auth(Role.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.warn(`Eliminando autor con ID ${id}`);
    return await this.autorService.delete(id);
  }
}