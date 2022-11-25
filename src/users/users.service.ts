import {
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { USER_NOT_FOUND_MESSAGE, USERS_REPOSITORY } from './const';
import { User } from './entities';
import { Roles } from './enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User,
  ) {}

  async getUser(
    options: {
      userId?: string;
      username?: string;
      email?: string;
      role?: Roles;
    },
    paranoid = true,
  ) {
    let user: User;
    if (options.userId) {
      user = await this.usersRepository.findByPk(options.userId, { paranoid });

      if (!user) return false;
    } else if (options.username) {
      user = await this.usersRepository.findOne({
        where: {
          username: options.username,
        },
        paranoid,
      });
      if (!user) return false;
    } else if (options.email) {
      user = await this.usersRepository.findOne({
        where: {
          email: options.email,
        },
        paranoid,
      });
      if (!user) return false;
    } else if (options.role) {
      user = await this.usersRepository.findOne({
        where: {
          role: options.role,
        },
        paranoid,
      });
      if (!user) return false;
    } else return false;

    return user;
  }

  async getUnscopedUser(
    options: {
      userId?: string;
      username?: string;
      email?: string;
      role?: Roles;
    },
    paranoid = true,
  ) {
    let user: User;
    if (options.userId) {
      user = await this.usersRepository.unscoped().findByPk(options.userId, {
        paranoid,
      });

      if (!user) return false;
    } else if (options.username) {
      user = await this.usersRepository.unscoped().findOne({
        where: {
          username: options.username,
        },
        paranoid,
      });
      if (!user) return false;
    } else if (options.email) {
      user = await this.usersRepository.unscoped().findOne({
        where: {
          email: options.email,
        },
        paranoid,
      });
      if (!user) return false;
    } else if (options.role) {
      user = await this.usersRepository.unscoped().findOne({
        where: {
          role: options.role,
        },
        paranoid,
      });
      if (!user) return false;
    } else return false;

    return user;
  }

  async createAdministrator() {
    const user = await this.usersRepository.findOne({
      where: {
        role: Roles.ADMIN,
      },
    });

    if (user) {
      return user;
    } else {
      const admin: CreateUserDto = {
        firstname: 'Admin',
        lastname: 'admin',
        username: 'Admin',
        email: 'administrator@localhost.com',
        password: 'admin',
        phone: '0739390253',
        role: Roles.ADMIN,
      };

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);

      try {
        return await this.usersRepository.create({
          ...admin,
        });
      } catch (error: any) {
        console.error(error);
      }

      return undefined;
    }
  }

  async create(createUserDto: CreateUserDto) {
    let user = await this.getUser({ username: createUserDto.username });

    if (user) {
      throw new PreconditionFailedException(
        'User with the given username already exists',
      );
    }

    user = await this.getUser({ email: createUserDto.email });

    if (user) {
      throw new PreconditionFailedException(
        'User with the given email already exists',
      );
    }

    const salt = await bcrypt.genSalt(10);

    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    return await this.usersRepository.create({ ...createUserDto });
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findOne(userId: string) {
    const user = await this.getUser({ userId });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return await user.update({ ...updateUserDto });
  }

  async remove(userId: string) {
    const user = await this.findOne(userId);

    return await user.destroy();
  }
}
