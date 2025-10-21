import { SetMetadata } from '@nestjs/common';

export const IS_CUSTOM_GAME_INTEGRATE_KEY = 'IS_CUSTOM_GAME_INTEGRATE_KEY';
export const CustomGameIntegrate = () =>
  SetMetadata(IS_CUSTOM_GAME_INTEGRATE_KEY, true);
