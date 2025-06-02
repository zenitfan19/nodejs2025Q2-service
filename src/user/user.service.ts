import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User, UserResponse } from './user.entity';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { validateUuid } from '../utils/uuid.util';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): UserResponse[] {
    return this.users.map(this.excludePassword);
  }

  findOne(id: string): UserResponse {
    validateUuid(id);
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  create(createUserDto: CreateUserDto): UserResponse {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return this.excludePassword(user);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): UserResponse {
    validateUuid(id);
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return this.excludePassword(user);
  }

  remove(id: string): void {
    validateUuid(id);
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }

  private excludePassword(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}
