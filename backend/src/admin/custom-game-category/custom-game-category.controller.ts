import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CustomGameCategoryService } from './custom-game-category.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { SetGameTypeDto } from './dto/SetGameTypeDto';
import { SetProviderStateDto } from './dto/SetProviderStateDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Controller('admin/custom-game-category')
export class CustomGameCategoryController {
  constructor(
    private readonly customGameCategoryService: CustomGameCategoryService,
  ) {}

  @Get()
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(
    @Query('gameType') gameType: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    return this.customGameCategoryService.findAll(gameType, +offset, +limit);
  }

  @Post()
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  setGameType(@Body() data: SetGameTypeDto) {
    return this.customGameCategoryService.setGameType(data);
  }

  @Post('provider-state')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  setProviderState(@Body() data: SetProviderStateDto) {
    return this.customGameCategoryService.setProviderState(data);
  }

  @Post('update-fungamess')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateFungamess() {
    return this.customGameCategoryService.updateGames();
  }

  @Post(':id/upload')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') gameId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.customGameCategoryService.uploadImage(+gameId, file);
  }

  @Post(':id/order')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateOrder(
    @Param('id') customCategoryId: string,
    @Body() data: UpdateOrderDto,
  ) {
    return this.customGameCategoryService.updateOrder(+customCategoryId, data);
  }

  @Delete(':id/upload')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  deleteImage(@Param('id') gameId: string) {
    return this.customGameCategoryService.deleteImage(+gameId);
  }
}
