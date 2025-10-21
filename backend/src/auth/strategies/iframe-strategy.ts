import { SetMetadata } from '@nestjs/common';

export const IS_IFRAME_INTEGRATE_KEY = 'IS_IFRAME_INTEGRATE_KEY';
export const IframeIntegrate = () => SetMetadata(IS_IFRAME_INTEGRATE_KEY, true);
