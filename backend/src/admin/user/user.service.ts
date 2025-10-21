import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { generateBtcAddress } from 'src/blockchain/libBTC';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt } from 'src/utils/encrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchainService: BlockchainService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(keyword: string, offset: number, length: number) {
    this.logger.debug(`Find all users: offset ${offset} length ${length}`);

    const trimmed = keyword?.toLowerCase()?.trim() || '';

    const queryCount = `
      SELECT
        COUNT(*) AS "count"
      FROM
        "users"
      WHERE
        "role" = 'NORMAL'
        AND (
          "id" LIKE '%${trimmed}%'
          OR LOWER("email") LIKE '%${trimmed}%'
          OR LOWER("userName") LIKE '%${trimmed}%'
        );`;

    const query = `
      SELECT
        *
      FROM
        "users"
	      LEFT JOIN "total_analytics_view" ON "total_analytics_view"."userId" = "users"."id"
      WHERE
        "role" = 'NORMAL'
        AND (
          "id" LIKE '%${trimmed}%'
          OR LOWER("email") LIKE '%${trimmed}%'
          OR LOWER("userName") LIKE '%${trimmed}%'
        )
      ORDER BY
        "users"."userName",
        "users"."id"
      OFFSET
        ${offset < 0 ? 0 : offset}
      LIMIT
        ${length > 0 ? length : 10};`;

    const [total, data] = await Promise.all([
      this.prisma.$queryRawUnsafe(queryCount),
      this.prisma.$queryRawUnsafe(query),
    ]);

    return {
      total: total[0].count,
      data: (data as any[]).map((e) => ({
        ...e,
        btcPk: '',
        solanaPk: '',
        ethPk: '',
        ltcPk: '',
      })),
    };
  }

  getCount() {
    return this.prisma.user.count({
      where: {
        role: {
          not: 'ADMIN',
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      omit: {
        btcPk: true,
        ethPk: true,
        solanaPk: true,
        ltcPk: true,
        subscription: true,
      },
      where: {
        id: id,
        isDeleted: false,
      },
    });

    let res = { ...user };

    if (user.refererId) {
      const referer = await this.prisma.user.findUniqueOrThrow({
        omit: {
          btcPk: true,
          ethPk: true,
          solanaPk: true,
          ltcPk: true,
          subscription: true,
          password: true,
        },
        where: {
          id: user.refererId,
        },
      });

      res['referer'] = referer;
    }

    return res;
  }

  async delete(id: string) {
    const user = await this.prisma.user.update({
      omit: {
        btcPk: true,
        ethPk: true,
        solanaPk: true,
        ltcPk: true,
        subscription: true,
      },
      data: {
        isDeleted: true,
      },
      where: {
        id: id,
        isDeleted: false,
      },
    });

    return user;
  }

  async regenerateWallets() {
    const users = await this.prisma.user.findMany();
    for (let i = 0; i < users.length; i++) {
      const btc = generateBtcAddress('bitcoin');
      const ltc = generateBtcAddress('litecoin');
      const eth = this.blockchainService.generateEthAddress();
      const sol = this.blockchainService.generateSolanaAddress();

      await this.prisma.user.update({
        data: {
          btcAddress: btc.address,
          btcPk: encrypt(btc.privateKey),
          ltcAddress: ltc.address,
          ltcPk: encrypt(ltc.privateKey),
          ethAddress: eth.address,
          ethPk: encrypt(eth.privateKey),
          solanaAddress: sol.address,
          solanaPk: encrypt(sol.privateKey),
        },
        where: {
          id: users[i].id,
        },
      });
    }

    return true;
  }

  async getSportsbookJwt(userId: string) {
    const accessToken = await this._generateAccessToken(userId);
    return accessToken;
  }

  async _generateAccessToken(userId: string) {
    const payload = {
      defaultCurrency: 'USD',
      externalUserId: userId,
      iat: new Date().getTime() / 1000,
      exp: new Date().getTime() / 1000 + 24 * 3600,
    };

    return await this.jwtService.signAsync(payload);
  }
}
