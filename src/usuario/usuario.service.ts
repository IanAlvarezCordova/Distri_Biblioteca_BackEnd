import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Rol } from "../rol/rol.entity";
import { Role } from "src/common/enum/rol.enum";


@Injectable()
export class UsuarioService {
    
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,

        @InjectRepository(Rol)
        private readonly rolRepository: Repository<Rol>
    ) {}

    // Metodo para obtener todos los usuarios
    async findAll(): Promise<Usuario[]> {
        //desencriptar password y mostrar en texto claro
        
        return await this.usuarioRepository.find({relations: ['roles']});
    }

    // Metodo para obtener un usuario por id
    async findOne(id: number): Promise<Usuario> {
        const tempUser = await this.usuarioRepository.findOne({ where: { id }, relations: ['roles'] });
        if (!tempUser) {
            throw new NotFoundException (`Usuario con id ${id} no encontrado`);
        }
        return tempUser;
    }

    async findOneByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({ 
            where: { email },
            relations: ['roles']});
    }

    async findByEmailWithPassword(email: string): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({
            where: { email },
            relations: ['roles'],
            select: ['id', 'username', 'email', 'password', 'roles'],
        });
    }
    
   

    // Metodo para crear el username
    /*
    Primera letra del nombres y apellido si se repite el username aumentamos un numero   
    username: string;
    */ 
    async create(usuario: Partial<Usuario>): Promise<Usuario> {
        const username = await this.generateUniqueUsername(usuario.nombre || '', usuario.apellido || '');
        //al crear un nuevo usuario asignar el rol de usuario por defecto en la tabla de rol_usuariol
        // Buscar el rol por nombre
        const defaultRole = await this.rolRepository.findOne({ where: { nombre: Role.USER } });

        if (!defaultRole) {
            throw new NotFoundException(`Rol por defecto (${Role.USER}) no encontrado`);
        }
        const newUsuario = this.usuarioRepository.create({ ...usuario, username, roles: [defaultRole] });

        return this.usuarioRepository.save(newUsuario);
    }
    
    async generateUniqueUsername(nombres: string, apellidos: string): Promise<string> {
        const [firstName] = nombres.split(' ');
        const [firstLastName] = apellidos.split(' ');
        let username = `${firstName.charAt(0)}${firstLastName}`.toLowerCase();
        
        let existingUser = await this.usuarioRepository.findOne({ where: { username } });
        let counter = 1;
    
        while (existingUser) {
            username = `${firstName.charAt(0)}${firstLastName}${counter}`.toLowerCase();
            existingUser = await this.usuarioRepository.findOne({ where: { username } });
            counter++;
        }
    
        return username;
    }

    // Metodo para actualizar un usuario
    async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
        const usuario = await this.findOne(id); // Esto lanza NotFoundException si no existe
        Object.assign(usuario, data);
        return await this.usuarioRepository.save(usuario);
      }

    // Metodo para eliminar un usuario
    async delete(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usuarioRepository.remove(user);
    }

    // Metodo para asignar un rol al usuario
    async asignarRol(idUsuario: number, idRol: number): Promise<Usuario> {
        const usuario = await this.findOne(idUsuario);

        const rol = await this.rolRepository.findOne({where: {id:idRol}});
        if(!rol){
            throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
        }

        if(usuario.roles.find((r) => r.id === idRol)){
            return usuario;
        }

        usuario.roles.push(rol);
        return await this.usuarioRepository.save(usuario);
    }


    // Metodo para remover un rol al usuario
    async removerRol(idUsuario: number, idRol: number): Promise<Usuario> {
        const usuario = await this.findOne(idUsuario);

        const rol = await this.rolRepository.findOne({where: {id:idRol}});
        if(!rol){
            throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
        }

        usuario.roles = usuario.roles.filter((r) => r.id !== idRol);
        return await this.usuarioRepository.save(usuario);
    }
}