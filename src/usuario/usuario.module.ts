import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { Rol } from '../rol/rol.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario, Rol]), forwardRef(() => AuthModule)],
    controllers: [UsuarioController],
    providers: [UsuarioService],
    exports: [UsuarioService]
})
export class UsuarioModule {}