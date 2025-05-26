import { UseGuards, applyDecorators } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from '../../common/enum/rol.enum';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';


export function Auth(...roles: Role[]) {
    return applyDecorators(Roles(...roles),
    UseGuards(AuthGuard, RolesGuard)
        
    );
}