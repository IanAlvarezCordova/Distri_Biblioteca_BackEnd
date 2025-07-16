import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode } from '@nestjs/common';
import { DevolucionService } from './devolucion.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { AppLogger } from '../common/logger.service'; // Agregar

@Controller('devoluciones')
export class DevolucionController {
    constructor(
        private readonly devolucionService: DevolucionService,
        private readonly logger: AppLogger, // Inyectar el logger
    ) {}

    @Auth(Role.USER)
    @Post()
    async create(
        @Body('prestamoId', ParseIntPipe) prestamoId: number,
        @ActiveUser() user: UserActiveInterface,
    ) {
        const devolucion = await this.devolucionService.create(prestamoId, user.id);
        this.logger.log(`Devolución registrada por usuario ID ${user.id} para préstamo ID ${prestamoId}`);
        return devolucion;
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

    @Auth(Role.ADMIN) //solo administradores pueden acceder a estadísticas
    @Get('stats/mensuales')
    async getDevolucionesMensuales() {
        return await this.devolucionService.getDevolucionesMensuales();
    }
}
