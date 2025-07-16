//File: src/usuario/usuario.controller.ts
import { Controller, Delete, Get, Param, Post, Put, Body, ParseIntPipe, HttpCode, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enum/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { AppLogger } from '../common/logger.service'; // Servicio de logs personalizado
import * as bcrypt from 'bcrypt';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly logger: AppLogger, // Inyección del logger para registrar eventos importantes
  ) {}

  // Obtener todos los usuarios
  @Get()
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioService.findAll();
  }

  // Obtener un usuario por ID solo si es el dueño o un admin
  @Auth(Role.USER)
  @Get(':id')
  findBy(@Param('id') id: number): Promise<Usuario | null> {
    return this.usuarioService.findOne(id);
  }

  // Crear un nuevo usuario
  @Post()
  async create(@Body() usuario: Partial<Usuario>): Promise<Usuario> {
    const newUser = await this.usuarioService.create(usuario);
    this.logger.log(`Usuario creado: ${newUser.email} (${newUser.username})`); // Registro de creación
    return newUser;
  }

  // Actualizar un usuario (solo el dueño o un admin)
  @Put(':id')
  @Auth(Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Usuario> & { password?: string },
    @ActiveUser() activeUser: { email: string; roles: string[] },
  ): Promise<Usuario> {
    const usuario = await this.usuarioService.findOne(id);

    // Validación de permisos: solo el dueño o un admin puede actualizar
    if (activeUser.email !== usuario.email && !activeUser.roles.includes(Role.ADMIN)) {
      this.logger.warn(`Intento no autorizado de actualizar usuario ID ${id} por ${activeUser.email}`); // Log de advertencia
      throw new UnauthorizedException('No tienes permisos para actualizar este perfil');
    }

    const updatedUser = await this.usuarioService.update(id, data);
    this.logger.log(`Usuario actualizado: ID ${id}`); // Registro de actualización
    return updatedUser;
  }

  // Eliminar un usuario (solo admin)
  @Auth(Role.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuarioService.delete(id);
    this.logger.warn(`Usuario eliminado: ID ${id}`); // Registro de eliminación como advertencia
  }

  // Asignar un rol a un usuario
  @Post(':idUsuario/roles/:idRol')
  async asignarRol(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number): Promise<Usuario> {
    const user = await this.usuarioService.asignarRol(idUsuario, idRol);
    this.logger.log(`Rol ID ${idRol} asignado a usuario ID ${idUsuario}`); // Registro de asignación de rol
    return user;
  }

  // Eliminar un rol de un usuario (solo admin)
  @Auth(Role.ADMIN)
  @Delete(':idUsuario/roles/:idRol')
  async eliminarRol(@Param('idUsuario', ParseIntPipe) idUsuario: number, @Param('idRol', ParseIntPipe) idRol: number): Promise<Usuario> {
    const user = await this.usuarioService.removerRol(idUsuario, idRol);
    this.logger.log(`Rol ID ${idRol} removido de usuario ID ${idUsuario}`); // Registro de eliminación de rol
    return user;
  }
}
