import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserResponse } from './user.entity';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { validateUuid } from '../utils/uuid.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map(this.excludePassword);
  }

  async findOne(id: string): Promise<UserResponse> {
    validateUuid(id);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = this.userRepository.create({
      login: createUserDto.login,
      password: createUserDto.password,
    });
    const savedUser = await this.userRepository.save(user);
    return this.excludePassword(savedUser);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    validateUuid(id);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    const savedUser = await this.userRepository.save(user);
    return this.excludePassword(savedUser);
  }

  async remove(id: string): Promise<void> {
    validateUuid(id);
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  private excludePassword(user: User): UserResponse {
    const userResponse = structuredClone(user);
    delete userResponse.password;

    return userResponse;
  }
}
