import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USERS_REPOSITORY } from '../../users/const';
import { Inject } from '@nestjs/common';
import { User } from '../../users/entities';

export class UsersJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(process.env.PUB_KEY, 'base64').toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return await this.usersRepository.unscoped().findByPk(payload.sub);
  }
}
