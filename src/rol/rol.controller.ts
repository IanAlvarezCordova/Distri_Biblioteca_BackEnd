import { Controller, Delete, Get, HttpCode, Param, Post} from "@nestjs/common";
import { RolService } from "./rol.service";
import { Rol } from "./rol.entity";
import { Body } from "@nestjs/common";
import { Put } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enum/rol.enum";
import { AppLogger } from "src/common/logger.service";



@Controller('rol')
export class RolController {
    constructor(
        private readonly rolService: RolService,
        private readonly logger: AppLogger,
        ){

    }

    //meotodo get
    @Get()
    findAll(){
        return this.rolService.findAll();
    }
    
    @Get(':id')
    findBy(@Param('id') id: number): Promise<Rol| null>{
        return this.rolService.findOne(id);
    }

    @Post()
    create(@Body() rol: Partial<Rol>): Promise<Rol>{
        this.logger.log(`Creando nuevo rol: ${rol.nombre}`);
        return this.rolService.create(rol);
    }

    //metodo para actualizar
    @Put(':id')
    update(@Param('id') id: number, @Body() rol: Partial<Rol>): Promise<Rol | null>{
        return this.rolService.update(id, rol);
    }

    //metodo para eliminar
    @Auth(Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number): Promise<void>{
        return this.rolService.delete(id);
    }


}