import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(
    @Query('keyword') keyword: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.userService.findAll(keyword, +offset, +length);
  }

  @Get('count')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getCount() {
    return this.userService.getCount();
  }

  @Get(':id/token')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getSportsbookJwt(@Param('id') userId: string) {
    return this.userService.getSportsbookJwt(userId);
  }

  @Get(':id')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findOne(@Param('id') userId: string) {
    return this.userService.findOne(userId);
  }

  // @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @Public()
  // @Post('regenerate-wallets-a4c16b5')
  // regenerateWallets(@Req() req: Request) {
  //   if (req.headers['24cc742d465fa'] !== '99bc952620') {
  //     return false;
  //   }
  //   return this.userService.regenerateWallets();
  // }

  @Delete(':id')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  delete(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }
}
