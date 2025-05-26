import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { Usuario } from '../usuario/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Rol, Usuario]), forwardRef(() => AuthModule)],
    controllers: [RolController],
    providers: [RolService],
})  
export class RolModule{}