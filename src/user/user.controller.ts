import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { UserResponse } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): UserResponse[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): UserResponse {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    return this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.userService.remove(id);
  }
}
