import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(5, { message: 'La contraseña debe tener al menos 5 caracteres' })
  password: string;
}