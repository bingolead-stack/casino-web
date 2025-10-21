import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './strategies/public-strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { IS_GR8_INTEGRATE_KEY } from './strategies/gr8-strategy';
import * as requestIp from 'request-ip';
import { UserRole } from '@prisma/client';
import { IS_FUNGAMESS_INTEGRATE_KEY } from './strategies/fungamess-strategy';
import { ConfigService } from '@nestjs/config';
import * as sha256 from 'crypto-js/sha256';
import { IS_IFRAME_INTEGRATE_KEY } from './strategies/iframe-strategy';
import { IS_CUSTOM_GAME_INTEGRATE_KEY } from './strategies/custom-game-strategy';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async checkDecorator(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    const strategies = [
      {
        key: IS_GR8_INTEGRATE_KEY,
        ipKey: 'gr8',
      },
      {
        key: IS_FUNGAMESS_INTEGRATE_KEY,
        ipKey: 'fungamess',
      },
      {
        key: IS_IFRAME_INTEGRATE_KEY,
        ipKey: 'iframe',
      },
    ];

    for (let i = 0; i < strategies.length; i++) {
      // GR8 Integration
      const isGr8Integrate = this.reflector.getAllAndOverride<boolean>(
        strategies[i].key,
        [context.getHandler(), context.getClass()],
      );

      if (isGr8Integrate) {
        const checkIp = await this.checkIpAddress(ip, strategies[i].ipKey);
        return checkIp;
      }
    }

    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await this.checkDecorator(context))) {
      throw new BadRequestException();
    }

    const isFungamessIntegrate = this.reflector.getAllAndOverride<boolean>(
      IS_FUNGAMESS_INTEGRATE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    if (isFungamessIntegrate) {
      request['x-fungamess-sign'] = this.checkFungamessSign(request);
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // get jwt token
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // decode jwt token
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.externalUserId) {
        const roles = this.reflector.get<string[]>(
          'roles',
          context.getHandler(),
        );

        const user = await this.prisma.user.findUnique({
          omit: {
            btcPk: true,
            ethPk: true,
            solanaPk: true,
            password: true,
            ltcPk: true,
          },
          where: {
            id: payload.externalUserId,
            isDeleted: false,
          },
        });

        if (user) {
          if (!roles || roles.includes(user.role)) {
            request['user'] = user;
            this.logger.debug('Success in authentication');
            return true;
          } else {
            this.logger.error('Role does not match');
            throw new UnauthorizedException();
          }
        } else {
          const agent = await this.prisma.agent.findUnique({
            where: {
              id: payload.externalUserId,
              isDeleted: false,
            },
          });

          if (!agent) {
            throw new UnauthorizedException();
          }

          if (!roles || roles.includes(UserRole.AGENT)) {
            request['user'] = { ...agent, isAgent: true };
            return true;
          } else {
            this.logger.error('Role does not match');
            throw new UnauthorizedException();
          }
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async checkIpAddress(ip: string, platform: string) {
    const ipv4 = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    this.logger.debug('ip: ', ipv4);
    const count = await this.prisma.whitelistIP.count({
      where: {
        OR: [
          { ip: ipv4, note: platform },
          { ip: ipv4, note: 'dev' },
        ],
      },
    });
    return count > 0;
  }

  checkFungamessSign(request: Request) {
    this.logger.debug('checkSign');
    try {
      const hashAuth = (request.headers['hash-authorization'] as string) || '';
      this.logger.debug(`hash-authorization: ${hashAuth}`);

      let data: Record<string, any>;

      if (request.method === 'POST') {
        data = request.body;
      } else {
        data = request.query;
      }

      if ('extraData' in data) {
        delete data['extraData'];
      }

      const sortedData = Object.keys(data)
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = String(data[key]);
            return acc;
          },
          {} as Record<string, string>,
        );

      const dataString = JSON.stringify(sortedData);

      const hashAuthLocal = sha256(
        dataString + this.configService.get<string>('FUNGAMESS_KEY'),
      );
      this.logger.debug(hashAuthLocal);

      return String(hashAuthLocal) === hashAuth;
    } catch (ex) {
      this.logger.error(ex);
      return false;
    }
  }
}
