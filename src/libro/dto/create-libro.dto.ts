// src/libro/dto/create-libro.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsBoolean,
    ValidateNested,
    IsNumber,
    ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class CategoriaDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @ValidateIf(o => !o.id) // Solo valida nombre si no se pasó id
    @IsString()
    @IsNotEmpty()
    nombre?: string;
}

class AutorDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @ValidateIf(o => !o.id) // Solo valida nombre si no se pasó id
    @IsString()
    @IsNotEmpty()
    nombre?: string;
}

export class CreateLibroDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsDateString()
    @IsOptional()
    fecha_publicacion?: string;

    @IsBoolean()
    @IsOptional()
    disponible?: boolean;

    @ValidateNested()
    @Type(() => CategoriaDto)
    categoria: CategoriaDto;

    @ValidateNested()
    @Type(() => AutorDto)
    autor: AutorDto;
}
