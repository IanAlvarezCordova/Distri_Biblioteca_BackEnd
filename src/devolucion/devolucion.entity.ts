// src/devolucion/devolucion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Prestamo } from '../prestamo/prestamo.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Libro } from '../libro/libro.entity';

@Entity({ name: 'devoluciones' })
export class Devolucion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Prestamo, prestamo => prestamo.id, { nullable: false })
    prestamo: Prestamo;

    @ManyToOne(() => Usuario, usuario => usuario.id, { nullable: false })
    usuario: Usuario;

    @ManyToOne(() => Libro, libro => libro.id, { nullable: false })
    libro: Libro;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha_devolucion: Date;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}