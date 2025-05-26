// src/libro/libro.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../categoria/categoria.entity';
import { Autor } from '../autor/autor.entity';
import { Prestamo } from '../prestamo/prestamo.entity';

@Entity({ name: 'libros' })
export class Libro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    fecha_publicacion: Date;

    @Column({ default: true })
    disponible: boolean;

    @ManyToOne(() => Categoria, categoria => categoria.libros, { nullable: false })
    categoria: Categoria;

    @ManyToOne(() => Autor, autor => autor.libros, { nullable: false })
    autor: Autor;

    @OneToMany(() => Prestamo, prestamo => prestamo.libro)
    prestamos: Prestamo[];

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}