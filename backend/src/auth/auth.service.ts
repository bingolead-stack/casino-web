import {
  BadRequestException,
  HttpCode,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { GlobalUser, User, UserActivityType, UserRole } from '@prisma/client';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { MailService } from 'src/mail/mail.service';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/CreateUserDto';
import * as fs from 'fs';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { encrypt, frontendDecrypt } from 'src/utils/encrypt';
import * as moment from 'moment';
import { adminEmails, iframeEndpoints } from 'src/utils/constants';
import { GlobalCreateUserDto } from './dto/GlobalCreateUserDto';
import { WantBonusDto } from './dto/WantBonusDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { S3_REGION, S3_BUCKET } from 'src/utils/constants';
import { SendEmailChangeRequestDto } from './dto/SendEmailChangeRequestDto';
import { generateBtcAddress } from 'src/blockchain/libBTC';
import { UserActivityService } from 'src/user_activity/user_activity.service';
import * as ip3country from 'ip3country';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly blockchainService: BlockchainService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async signIn(email: string, password: string, role: UserRole, ipv4: string) {
    if (role === UserRole.NORMAL || role === UserRole.ADMIN) {
      const user = await this.prisma.user.findFirst({
        omit: {
          btcPk: true,
          ethPk: true,
          solanaPk: true,
          ltcPk: true,
        },
        where: {
          OR: [
            {
              email,
            },
            {
              userName: email,
            },
          ],
          role: {
            in:
              role === UserRole.NORMAL
                ? [UserRole.NORMAL]
                : [UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.SUPER_ADMIN],
          },
          isDeleted: false,
        },
      });

      // user not found
      if (!user) {
        this.logger.error('User not found');
        throw new UnauthorizedException();
      }

      // check password
      const isMatch = await bcrypt.compare(password, user?.password);
      if (!isMatch) {
        this.logger.error('Password does not match');
        throw new UnauthorizedException();
      }
      delete user.password;

      await this.userActivityService.addActivity({
        userId: user.id,
        ip: ipv4,
        type: UserActivityType.LOGIN,
      });

      const accessToken = await this._generateAccessToken(user.id);

      return {
        accessToken,
        user,
      };
    } else {
      const user = await this.prisma.agent.findFirst({
        where: { userName: email, isDeleted: false },
      });

      if (!user) {
        this.logger.error('Agent not found');
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(password, user?.password);;
      if (!isMatch) {
        this.logger.error('Password does not match');
        throw new UnauthorizedException();
      }

      const accessToken = await this._generateAccessToken(user.id);
      return {
        accessToken,
        user: {
          ...user,
          isAgent: true,
        },
      };
    }
  }

  async signUp(createUserDto: CreateUserDto, ipv4: string) {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!regex.test(createUserDto.userName)) {
      this.logger.error('username.error');
      throw new BadRequestException('username.error');
    }

    const decrypted = frontendDecrypt(createUserDto.token);
    if (
      decrypted !==
      createUserDto.email +
        createUserDto.email.length +
        createUserDto.password +
        createUserDto.password.length +
        "fspin" +
        createUserDto.userName
    ) {
      this.logger.error('token.error');
      throw new BadRequestException('token.error');
    }

    // duplication checking
    const exist = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: createUserDto.email,
          },
          {
            userName: createUserDto.userName,
          },
        ],
        isDeleted: false,
      },
    });

    if (exist) {
      throw new BadRequestException('user.already-exist');
    }

    let userId: bigint = BigInt(0);
    try {
      const iFrameHost = this.configService.get<string>('IFRAME_HOST');
      this.logger.debug(iFrameHost);
      
      // We fetch user id from the central server in the real practice.
      userId = BigInt(Math.round(Math.random() * 10000000000000000) % 10000000000000000);

      const passwordHash = await bcrypt.hash(createUserDto.password, 12);
      const selfReferCode = createUserDto.userName.trim();
      const verifyCode = CryptoJS.SHA256(`verify_${uuidv4()}`).toString();

      // find referer
      let refererId = null;
      let referer;
      let refererUserCount = 0;
      if (createUserDto.referCode) {
        referer = await this.prisma.user.findFirst({
          select: {
            id: true,
            userName: true,
            email: true,
          },
          where: {
            referCode: createUserDto.referCode,
          },
        });

        refererId = referer?.id ?? null;

        if (refererId) {
          refererUserCount = await this.prisma.user.count({
            where: {
              refererId,
            },
          });
        }
      }

      const btc = generateBtcAddress('bitcoin');
      const eth = this.blockchainService.generateEthAddress();
      const sol = this.blockchainService.generateSolanaAddress();
      const ltc = generateBtcAddress('litecoin');

      const user = await this.prisma.user.create({
        omit: {
          btcPk: true,
          ethPk: true,
          solanaPk: true,
          ltcPk: true,
          password: true,
        },
        data: {
          id: userId.toString(16).padStart(8, '0'),
          userName: createUserDto.userName.trim(),
          email: createUserDto.email,
          emailVerified: false,
          password: passwordHash,
          role: UserRole.NORMAL,
          referCode: selfReferCode,
          refererId: refererId,
          isDeleted: false,
          verifyCode: verifyCode,
          verityTimeLimit: new Date(new Date().getTime() + 300 * 1000),
          cash: 0,
          locked: 0,
          bonus: 0,
          btcAddress: btc.address,
          btcPk: encrypt(btc.privateKey),
          ethAddress: eth.address,
          ethPk: encrypt(eth.privateKey),
          solanaAddress: sol.address,
          solanaPk: encrypt(sol.privateKey),
          ltcAddress: ltc.address,
          ltcPk: encrypt(ltc.privateKey),
        },
      });

      await this.userActivityService.addActivity({
        userId: user.id,
        ip: ipv4,
        type: UserActivityType.REGISTER,
      });

      // find referer information

      // const totalUserCount = await this.prisma.user.count({
      //   where: { isDeleted: false },
      // });
      // const countryCode = ip3country.lookupStr(ipv4) || '';
      // await this.mailService.sendUserJoinEmail({
      //   userId: user.id,
      //   userName: user.userName,
      //   userEmail: user.email,
      //   location: ipv4 + '-' + countryCode,
      //   refererName: referer?.userName || 'None',
      //   refererUserCount,
      //   userCount: totalUserCount,
      // });

      const accessToken = await this._generateAccessToken(user.id);

      return {
        accessToken,
        user,
      };
    } catch (ex) {
      console.error('response: ', ex);
      throw new InternalServerErrorException(ex);
    }
  }

  async changePassword(user: User, data: ChangePasswordDto) {
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      this.logger.debug('Password does not match in changing password');
      throw new BadRequestException('password.not-match');
    }

    const newPassword = await bcrypt.hash(data.newPassword, 12);
    await this.prisma.user.update({
      data: {
        password: newPassword,
      },
      where: {
        id: user.id,
      },
    });

    return true;
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        userName: true,
        email: true,
      },
      where: {
        email: data.email,
        isDeleted: false,
      },
    });

    const hash = CryptoJS.SHA256(`reset_${uuidv4()}`).toString();
    await this.prisma.user.update({
      omit: {
        btcPk: true,
        ethPk: true,
        solanaPk: true,
        ltcPk: true,
        password: true,
      },
      data: {
        verifyCode: hash,
        verityTimeLimit: new Date(new Date().getTime() + 1 * 3600 * 1000),
      },
      where: {
        id: user.id,
      },
    });

    try {
      const userName = user.userName;
      const nextStepLink = `${process.env.FRONTEND_URL}/reset-password?token=${hash}`;

      this.mailService.sendMail(
        `${this.configService.get<string>('IFRAME_HOSTNAME')} Support`,
        [user.email],
        'Password Reset Link',
        'password-reset',
        {
          pass_reset_link: nextStepLink,
          support_email: adminEmails[0],
          user_name: userName,
        },
      );
      return true;
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException(ex);
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    if (!data.hash) {
      throw new BadRequestException('token.not-found');
    }

    const hash = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.findFirst({
      where: {
        verifyCode: data.hash,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new BadRequestException('token.not-found');
    }

    if (user.verityTimeLimit.getTime() < new Date().getTime()) {
      throw new BadRequestException('token.expired');
    }

    const res = await this.prisma.user.update({
      data: {
        password: hash,
        emailVerified: true,
        verifyCode: '',
      },
      where: {
        id: user.id,
      },
    });

    return true;
  }

  async _generateAccessToken(userId: string) {
    const payload = {
      defaultCurrency: this.configService.get<string>('DEFAULT_CURRENCY'),
      externalUserId: userId,
      iat: new Date().getTime() / 1000,
      exp:
        new Date().getTime() / 1000 +
        this.configService.get<number>('REGISTRATION_EXPIRES_HOUR') * 3600,
    };

    return await this.jwtService.signAsync(payload);
  }

  async getPublicKey() {
    const str = fs.readFileSync(`public_key`).toString();
    return str;
  }

  async wantBonus(user: User, body: WantBonusDto) {
    await this.prisma.user.update({
      data: {
        wantBonus: body.wantBonus,
        bonusWithdrawPassed: !body.wantBonus,
      },
      where: {
        id: user.id,
        wantBonus: null,
      },
    });

    return true;
  }

  async changeAvatar(user: User, file: Express.Multer.File) {
    const filename = `avatars/${user.id}-${new Date().getTime()}.png`;

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: S3_REGION,
    });

    if (user.avatar) {
      try {
        const temp = user.avatar.split('/');
        const oldFilename = temp[temp.length - 2] + '/' + temp[temp.length - 1];
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: oldFilename,
          }),
        );
      } catch (ex) {
        this.logger.error(ex);
      }
    }

    // upload to s3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const fullPath = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;
    await this.prisma.user.update({
      data: {
        avatar: fullPath,
      },
      where: {
        id: user.id,
      },
    });

    // get file path
    return fullPath;
  }

  async deleteAvatar(user: User) {
    const filename = `avatars/${user.id}.png`;

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: S3_REGION,
    });

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: filename,
        }),
      );
    } catch (ex) {
      this.logger.error(ex);
    }

    await this.prisma.user.update({
      data: {
        avatar: null,
      },
      where: {
        id: user.id,
      },
    });

    // get file path
    return true;
  }

  async sendEmailChangeRequest(
    userId: string,
    data: SendEmailChangeRequestDto,
  ) {
    // check if email exists
    const bFirst = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (bFirst) {
      throw new BadRequestException('email.exists');
    }
  }
}
