import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Rol } from "./rol.entity";


@Injectable()
export class RolService{
    
    constructor(
        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>
    ){}

    //Metodo para obtener todos los roles
    findAll(): Promise<Rol[]>{
        return this.rolRepository.find({relations: ['usuarios']});
    }

    //Metodo para obtener un rol por id
    async findOne(id: number): Promise<Rol>{
        const tempRol = await this.rolRepository.findOne({where: {id}, relations: ['usuarios']});
        if(!tempRol){
            throw new NotFoundException(`El rol con id ${id} no se encuentra`);
        }
        return tempRol;
    }

    //Metodo para crear un rol
    create(rol: Partial<Rol>): Promise<Rol>{
        const newRol = this.rolRepository.create(rol);
        return this.rolRepository.save(rol);
    }

    //Metodo para actualizar un rol
    async update(id: number, rol: Partial<Rol>): Promise<Rol|null>{
        await this.rolRepository.update({id}, rol);
        return this.findOne(id);
    }

    //Metodo para eliminar un rol
    //Modificar para que no me permista eliminar un rol que tenga usuarios asociados
    async delete(id: number): Promise<void>{
        const rol = await this.findOne(id);
        if (rol.usuarios && rol.usuarios.length > 0) {
            throw new NotFoundException(`El rol con id ${id} tiene usuarios asociados y no puede ser eliminado`);
        }
        await this.rolRepository.delete(id);
    }
}