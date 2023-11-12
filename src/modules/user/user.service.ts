import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async getListUserWithoutRole() {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole') // userRoles là tên mối quan hệ trong entity User
      .where('userRole.userId IS NULL')
      .getMany();
  }

  async getAllUser() {
    return await this.userRepository.find();
  }
}
