import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { EXPIRES_IN } from './const';
import { UsersModule } from '../users/users.module';
import { UsersJwtStrategy } from './strategy';
import { UsersService } from '../users/users.service';
import { usersProvider } from '../users/users.provider';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const privateKey = Buffer.from(process.env.PRV_KEY, 'base64').toString(
          'ascii',
        );
        const publicKey = Buffer.from(process.env.PUB_KEY, 'base64').toString(
          'ascii',
        );

        const options: JwtModuleOptions = {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: EXPIRES_IN,
          },
        };
        return options;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersJwtStrategy, UsersService, ...usersProvider],
})
export class AuthModule {}
