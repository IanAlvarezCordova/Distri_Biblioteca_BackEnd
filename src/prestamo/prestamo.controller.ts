// src/prestamo/prestamo.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { Prestamo } from './prestamo.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

@Controller('prestamo')
export class PrestamoController {
    constructor(private readonly prestamoService: PrestamoService) {}

    @Get()
    async findAll(): Promise<Prestamo[]> {
        return await this.prestamoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Prestamo> {
        return await this.prestamoService.findOne(id);
    }

    @Auth(Role.USER)
    @Post()
    async create(@Body() prestamo: Partial<Prestamo>, @ActiveUser() activeUser: UserActiveInterface): Promise<Prestamo> {
        return await this.prestamoService.create(prestamo, activeUser.id);
    }

    // @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() prestamo: Partial<Prestamo>,
    ): Promise<Prestamo> {
        return await this.prestamoService.update(id, prestamo);
    }

    // @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.prestamoService.delete(id);
    }
}