import { SetMetadata } from '@nestjs/common';

export const IS_FUNGAMESS_INTEGRATE_KEY = 'IS_FUNGAMESS_INTEGRATE_KEY';
export const FungamessIntegrate = () =>
  SetMetadata(IS_FUNGAMESS_INTEGRATE_KEY, true);
