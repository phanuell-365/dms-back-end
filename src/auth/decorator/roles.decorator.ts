import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../users/enum';

export const UsersRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
