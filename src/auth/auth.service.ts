import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
import { Roles } from '../users/enum';
import * as bcrypt from 'bcrypt';
import { EXPIRES_IN } from './const';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    let unknownUser: boolean | User = await this.usersService.getUnscopedUser({
      email: authDto.email,
    });

    if (!unknownUser) {
      const admin = await this.usersService.getUnscopedUser({
        role: Roles.ADMIN,
      });

      if (!admin) {
        // create a default admin if there is none
        unknownUser = await this.usersService.createAdministrator();
      }
    }

    if (!unknownUser) {
      throw new ForbiddenException('Invalid username or password!');
    }

    // compare the given passwords
    const isPasswordMatching = await bcrypt.compare(
      authDto.password,
      unknownUser.password,
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException('Invalid username or password!');
    }

    return {
      access_token: this.signToken(unknownUser.id, unknownUser.username),
      userId: unknownUser.id,
      role: unknownUser.role,
      expires_in: EXPIRES_IN,
    };
  }

  signToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const options: JwtSignOptions = {
      expiresIn: EXPIRES_IN,
      algorithm: 'RS256',
    };

    return this.jwtService.sign(payload, options);
  }
}
