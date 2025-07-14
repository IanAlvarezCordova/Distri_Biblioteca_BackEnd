import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, HttpCode } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { Prestamo } from './prestamo.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { AppLogger } from '../common/logger.service'; // Agregar

@Controller('prestamo')
export class PrestamoController {
    constructor(
        private readonly prestamoService: PrestamoService,
        private readonly logger: AppLogger,
    ) {}

    @Get()
    async findAll(): Promise<Prestamo[]> {
        return await this.prestamoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Prestamo> {
        return await this.prestamoService.findOne(id);
    }

    @Get('usuario/:id')
    async findByUsuario(@Param('id', ParseIntPipe) id: number): Promise<Prestamo[]> {
        return await this.prestamoService.findByUsuario(id);
    }

    @Auth(Role.USER)
    @Post()
    async create(@Body() prestamo: Partial<Prestamo>, @ActiveUser() activeUser: UserActiveInterface): Promise<Prestamo> {
        const nuevoPrestamo = await this.prestamoService.create(prestamo, activeUser.id);
        this.logger.log(`Nuevo préstamo creado por usuario ID ${activeUser.id}`);
        return nuevoPrestamo;
    }

    // @Auth(Role.ADMIN)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() prestamo: Partial<Prestamo>,
    ): Promise<Prestamo> {
        const actualizado = await this.prestamoService.update(id, prestamo);
        this.logger.log(`Préstamo actualizado: ID ${id}`);
        return actualizado;
    }

    // @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.prestamoService.delete(id);
        this.logger.warn(`Préstamo eliminado: ID ${id}`);
    }
}
