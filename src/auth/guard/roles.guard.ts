import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../common/enum/rol.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}
    canActivate(
        context: ExecutionContext): boolean  {
        
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();
        
        // Check if the user has the role of admin to allow access to the route
        if (user.roles.includes(Role.ADMIN)) {
            return true;
        }

        return roles.some((role) => user.roles.includes(role));  
    }
    
}