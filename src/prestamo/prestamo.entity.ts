// src/prestamo/prestamo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Libro } from '../libro/libro.entity';

@Entity({ name: 'prestamos' })
export class Prestamo {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.prestamos, { nullable: false })
    usuario: Usuario;

    @ManyToOne(() => Libro, libro => libro.prestamos, { nullable: false })
    libro: Libro;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha_prestamo: Date;

    @Column({ type: 'date', nullable: true })
    fecha_devolucion: Date; // Fecha de vencimiento (plazo para devolver)

    @Column({ default: false })
    devuelto: boolean;

    @CreateDateColumn()
    creadoEn: Date;

    @UpdateDateColumn()
    actualizadoEn: Date;
}