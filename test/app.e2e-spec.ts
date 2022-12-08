import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateUserDto, UpdateUserDto } from '../src/users/dto';
import { Roles } from '../src/users/enum';

describe('DMS (e2e)', () => {
  let app: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await app.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Module', function () {
    const authDto: AuthDto = {
      email: 'admin@local.com',
      password: '12345678',
    };

    describe('Login', function () {
      it('should return an object having an access_token', function () {
        return pactum
          .spec()
          .post('/auth/users/login')
          .withBody({ ...authDto })
          .expectStatus(201)
          .inspect()
          .stores('accessToken', 'access_token');
      });
    });
  });

  describe('Users Module', function () {
    describe('Create a new user', function () {
      const userDto: CreateUserDto = {
        email: 'principal@localhost.com',
        firstname: 'Principal',
        lastname: 'principal',
        password: 'principal',
        phone: '0730032020',
        role: Roles.PRINCIPAL,
        username: 'principal',
      };
      it('should return a new user', function () {
        return pactum
          .spec()
          .post('/users')
          .withBody({ ...userDto })
          .stores('principalId', 'id')
          .expectStatus(201);
      });
    });

    describe('View all Users', function () {
      it('should return an array of users.', function () {
        return pactum.spec().get('/users').expectStatus(200);
      });
    });

    describe('View a user by id', function () {
      it('should return a user object', function () {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{principalId}')
          .expectStatus(200);
      });
    });

    describe('Update a user', function () {
      const updateUserDto: UpdateUserDto = {
        lastname: 'mkuu',
      };

      it('should update and return the updated user!', function () {
        const updateUserJson = {
          lastname: 'mkuu',
        };

        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{principalId}')
          .withBody({ ...updateUserDto })
          .expectJsonLike(updateUserJson)
          .inspect()
          .expectStatus(200);
      });
    });
  });
});
