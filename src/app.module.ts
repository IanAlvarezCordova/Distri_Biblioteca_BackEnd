// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AutorModule } from './autor/autor.module';
import { LibroModule } from './libro/libro.module';
import { PrestamoModule } from './prestamo/prestamo.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            autoLoadEntities: true,
            synchronize: true, // Solo para desarrollo, usar migraciones en producción
            ssl: process.env.POSTGRES_SSL === 'true',
            extra: {
                ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : null,
            },
        }),
        AuthModule,
        UsuarioModule,
        RolModule,
        CategoriaModule,
        AutorModule,
        LibroModule,
        PrestamoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}