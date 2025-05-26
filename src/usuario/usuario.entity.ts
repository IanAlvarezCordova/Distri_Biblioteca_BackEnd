// src/usuario/usuario.entity.ts
import { Rol } from '../rol/rol.entity';
import { Prestamo } from '../prestamo/prestamo.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'usuario' })
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    activo: boolean;

    @Column({ nullable: true })
    ultimo_acceso: Date;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

    @ManyToMany(() => Rol, rol => rol.usuarios, { cascade: ['remove'], onDelete: 'CASCADE' })
    roles: Rol[];

    @OneToMany(() => Prestamo, prestamo => prestamo.usuario)
    prestamos: Prestamo[];
}