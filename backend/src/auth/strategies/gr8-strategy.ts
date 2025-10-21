import { SetMetadata } from '@nestjs/common';

export const IS_GR8_INTEGRATE_KEY = 'isGr8Integrate';
export const Gr8Integrate = () => SetMetadata(IS_GR8_INTEGRATE_KEY, true);
