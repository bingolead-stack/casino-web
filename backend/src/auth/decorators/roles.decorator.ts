import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...args: string[]) => SetMetadata('roles', args);
