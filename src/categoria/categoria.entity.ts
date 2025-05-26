// src/categoria/categoria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Libro } from '../libro/libro.entity';

@Entity({ name: 'categorias' })
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;

    @OneToMany(() => Libro, libro => libro.categoria)
    libros: Libro[];
}