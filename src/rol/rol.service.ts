import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rol } from "./rol.entity";

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ) {}

  // Método para obtener todos los roles
  findAll(): Promise<Rol[]> {
    return this.rolRepository.find({ relations: ["usuarios"] });
  }

  // Método para obtener un rol por id
  async findOne(id: number): Promise<Rol> {
    const tempRol = await this.rolRepository.findOne({
      where: { id },
      relations: ["usuarios"],
    });
    if (!tempRol) {
      throw new NotFoundException(`El rol con id ${id} no se encuentra`);
    }
    return tempRol;
  }

  // Método para crear un rol
  create(rol: Partial<Rol>): Promise<Rol> {
    const newRol = this.rolRepository.create(rol);
    return this.rolRepository.save(newRol); // Corrección: guardar el nuevo rol creado
  }

  // Método para actualizar un rol
  async update(id: number, rol: Partial<Rol>): Promise<Rol | null> {
    await this.rolRepository.update({ id }, rol);
    return this.findOne(id);
  }

  // Método para eliminar un rol
  async delete(id: number): Promise<void> {
    const rol = await this.findOne(id);
    if (rol.usuarios && rol.usuarios.length > 0) {
      throw new NotFoundException(
        `El rol con id ${id} tiene usuarios asociados y no puede ser eliminado`
      );
    }
    await this.rolRepository.delete(id);
  }

  // **Nuevo método para asegurar roles por defecto**
  async ensureDefaultRoles(): Promise<void> {
    // Verificar si el rol "usuario final" existe
    const userRole = await this.rolRepository.findOne({
      where: { nombre: "usuario final" },
    });
    if (!userRole) {
      await this.create({
        nombre: "usuario final",
        descripcion: "Rol para usuarios finales de la biblioteca digital",
      });
    }

    // Verificar si el rol "administrador" existe
    const adminRole = await this.rolRepository.findOne({
      where: { nombre: "administrador" },
    });
    if (!adminRole) {
      await this.create({
        nombre: "administrador",
        descripcion: "Rol para administradores del sistema",
      });
    }
  }
}