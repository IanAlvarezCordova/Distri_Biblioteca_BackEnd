import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwkConstants } from "./constants/jwk.constant";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Aquí el fix:
import { UsuarioModule } from "src/usuario/usuario.module";
import { RolModule } from "src/rol/rol.module";

@Module({
    imports: [
        forwardRef(() => UsuarioModule),
        forwardRef(() => RolModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                global: true,
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [JwtModule]
})
export class AuthModule {}
