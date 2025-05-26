import { Controller, Delete, Get, Param, Post, Put, Body, ParseIntPipe, HttpCode, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { Usuario } from "./usuario.entity";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enum/rol.enum";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import * as bcrypt from 'bcrypt';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    // Método para obtener todos los usuarios
    @Get()
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioService.findAll();
    }

    // Método para obtener un usuario por ID
    @Auth(Role.ADMIN) // Requiere autenticación y rol de administrador
    @Get(':id')
    findBy(@Param('id') id: number): Promise<Usuario | null> {
        return this.usuarioService.findOne(id);
    }

    // Método para crear un nuevo usuario
    @Post()
    create(@Body() usuario: Partial<Usuario>): Promise<Usuario> {
        return this.usuarioService.create(usuario);
    }

    @Put(':id')
    @Auth(Role.USER) // Requiere autenticación y rol de usuario
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: Partial<Usuario> & { password?: string },
      @ActiveUser() activeUser: { email: string; roles: string[] }
    ): Promise<Usuario> {
      // Buscar el usuario que se intenta actualizar
      const usuario = await this.usuarioService.findOne(id);
 
  
      // Verificar si el usuario autenticado es el propietario del perfil o un administrador
      if (activeUser.email !== usuario.email && !activeUser.roles.includes(Role.ADMIN)) {
        throw new UnauthorizedException('No tienes permisos para actualizar este perfil');
      }
  
      // Si se envía una nueva contraseña, hashearla
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 8);
      }
  
      // Actualizar el usuario
      return await this.usuarioService.update(id, data);
    }


    // Método para eliminar un usuario
    @Auth(Role.ADMIN )
    @Delete(':id')
    @HttpCode(204) 
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.usuarioService.delete(id); // Sin retorno, ya que 204 no lleva cuerpo
    }

    // Método para asignar un rol a un usuario
    @Post(':idUsuario/roles/:idRol')
    async asignarRol(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number): Promise<Usuario> {
        return await this.usuarioService.asignarRol(idUsuario, idRol);
    }

    // Método para eliminar un rol de un usuario
    @Auth(Role.ADMIN)
    @Delete(':idUsuario/roles/:idRol')
    async eliminarRol(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number): Promise<Usuario> {
        return await this.usuarioService.removerRol(idUsuario, idRol);
    }
}