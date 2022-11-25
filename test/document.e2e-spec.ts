import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateUserDto, UpdateUserDto } from '../src/users/dto';
import { Roles } from '../src/users/enum';
import { CreateDocumentDto } from '../src/documents/dto';
import * as path from 'path';

describe('DMS (e2e)', () => {
  let documentApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    documentApp = moduleFixture.createNestApplication();

    documentApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await documentApp.init();

    await documentApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await documentApp.close();
  });

  describe('Workflow Management', function () {
    describe('Auth Module', function () {
      const authDto: AuthDto = {
        username: 'Admin',
        password: 'admin',
      };

      describe('Login', function () {
        it('should return an object having an access_token', function () {
          return pactum
            .spec()
            .post('/auth/users/login')
            .withBody({ ...authDto })
            .expectStatus(201)
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
            .expectStatus(200);
        });
      });
    });
  });

  describe('Document Management', function () {
    describe('Documents Module', function () {
      const baseDocumentPath = '../../tests/documents';

      describe('View Documents', function () {
        it('should return an empty array', function () {
          return pactum.spec().get('/documents').inspect().expectStatus(200);
        });
      });

      describe('Create a new document', function () {
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Appendix one test.docx',
        );

        const createDocumentDto: CreateDocumentDto = {
          contributors: 'Phan',
          creator: 'Administrator',
          description: 'The appendix for the third milestone.',
          keywords: 'appendix milestone documentation',
          purposeChange: 'Created the appendix for the third milestone',
          versionNumber: 'v 0.1',
          title: 'Appendix one test',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an empty array', function () {
          return pactum.spec().get('/documents').inspect().expectStatus(200);
        });
      });

      describe('Create another new document', function () {
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'test-plan-template-excel (2).png',
        );

        const createDocumentDto: CreateDocumentDto = {
          contributors: 'excel',
          creator: 'Administrator',
          description: 'A picture of a test table.',
          keywords: 'picture tests milestone documentation',
          purposeChange: 'Initial message for the test plan picture',
          versionNumber: 'v 0.1',
          title: 'test-plan-template-excel',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .inspect()
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an empty array', function () {
          return pactum.spec().get('/documents').inspect().expectStatus(200);
        });
      });
    });
  });
});