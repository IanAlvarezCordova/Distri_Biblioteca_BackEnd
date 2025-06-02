// src/devolucion/devolucion.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

@Controller('devoluciones')
export class DevolucionController {
    constructor(private readonly devolucionService: DevolucionService) {}

    @Auth(Role.USER) // Solo usuarios autenticados pueden registrar devoluciones
    @Post()
    async create(
        @Body('prestamoId', ParseIntPipe) prestamoId: number,
        @ActiveUser() user: UserActiveInterface,
    ) {
        return await this.devolucionService.create(prestamoId, user.id);
    }

    @Auth(Role.USER)
    @Get()
    async findAll() {
        return await this.devolucionService.findAll();
    }

    @Auth(Role.USER)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.devolucionService.findOne(id);
    }

    @Auth(Role.ADMIN) // Solo admins pueden ver estadísticas
    @Get('stats/mensuales')
    async getDevolucionesMensuales() {
        return await this.devolucionService.getDevolucionesMensuales();
    }
}