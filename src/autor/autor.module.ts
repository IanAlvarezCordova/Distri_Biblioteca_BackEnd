// src/autor/autor.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autor } from './autor.entity';
import { AutorService } from './autor.service';
import { AutorController } from './autor.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Autor]), AuthModule],
    controllers: [AutorController],
    providers: [AutorService],
    exports: [AutorService],
})
export class AutorModule {}