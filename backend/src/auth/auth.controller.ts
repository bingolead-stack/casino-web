import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './strategies/public-strategy';
import { LoggedUser } from './decorators/logged-user.decorator';
import { Agent, User, UserActivityType } from '@prisma/client';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { Gr8Integrate } from './strategies/gr8-strategy';
import { GlobalCreateUserDto } from './dto/GlobalCreateUserDto';
import { Request } from 'express';
import * as requestIp from 'request-ip';
import { IframeIntegrate } from './strategies/iframe-strategy';
import { WantBonusDto } from './dto/WantBonusDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendEmailChangeRequestDto } from './dto/SendEmailChangeRequestDto';
import { UserActivityService } from 'src/user_activity/user_activity.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userActivityService: UserActivityService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginUserDto, @Req() request: Request) {
    const ip = requestIp.getClientIp(request);
    const ipv4 = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      signInDto.role,
      ipv4,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto, @Req() request: Request) {
    const ip = requestIp.getClientIp(request);
    const ipv4 = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    return this.authService.signUp(signUpDto, ipv4);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('global-register')
  @IframeIntegrate()
  globalRegister(@Body() signUpDto: GlobalCreateUserDto, @Req() req: Request) {
    const ip = requestIp.getClientIp(req);
    return this.authService.globalRegister(signUpDto, ip);
  }

  @Get('account')
  async getUser(@LoggedUser() user: User | Agent) {
    return user;
  }

  @Public()
  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Public()
  @Post('/reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Public()
  @Gr8Integrate()
  @Get('/get-public-key')
  async getPublicKey() {
    return this.authService.getPublicKey();
  }

  @Post('want-bonus')
  wantBonus(@LoggedUser() user: User, @Body() body: WantBonusDto) {
    return this.authService.wantBonus(user, body);
  }

  @Post('change-password')
  async changePassword(@LoggedUser() user: User, data: ChangePasswordDto) {
    return this.authService.changePassword(user, data);
  }

  @Post('change-avatar')
  @UseInterceptors(FileInterceptor('file'))
  changeAvatar(
    @LoggedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.changeAvatar(user, file);
  }

  @Post('delete-avatar')
  deleteAvatar(@LoggedUser() user: User) {
    return this.authService.deleteAvatar(user);
  }

  @Post('email-change/send-request')
  sendEmailChangeRequest(
    @LoggedUser() user: User,
    @Body() data: SendEmailChangeRequestDto,
  ) {
    return this.authService.sendEmailChangeRequest(user.id, data);
  }
}
