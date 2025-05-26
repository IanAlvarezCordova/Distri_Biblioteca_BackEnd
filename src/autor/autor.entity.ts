// src/autor/autor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Libro } from '../libro/libro.entity';

@Entity({ name: 'autores' })
export class Autor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

    @OneToMany(() => Libro, libro => libro.autor)
    libros: Libro[];
}