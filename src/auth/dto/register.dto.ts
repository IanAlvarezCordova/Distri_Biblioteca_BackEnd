import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'Debe ingresar un nombre válido' })
    nombre: string;

    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'Debe ingresar un apellido válido' })
    apellido: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;
}
