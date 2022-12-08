import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
// import * as FormData from "form-data-lite";
import { AuthDto } from '../src/auth/dto';
import { CreateUserDto, UpdateUserDto } from '../src/users/dto';
import { Roles } from '../src/users/enum';
import { CreateDocumentDto, UpdateDocumentDto } from '../src/documents/dto';
import * as path from 'path';
import { VersionType } from '../src/document-versions/enum';

describe('DMS Version Control (e2e)', () => {
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
          return pactum.spec().get('/documents').expectStatus(200);
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
          versionType: VersionType.FINAL,
          title: 'Appendix one test',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents')
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an empty array', function () {
          return pactum.spec().get('/documents').expectStatus(200);
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
          versionType: VersionType.MAJOR,
          title: 'test-plan-template-excel',
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
          return pactum.spec().get('/documents').expectStatus(200);
        });
      });

      describe('Create another new document', function () {
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: CreateDocumentDto = {
          contributors: 'pdf',
          creator: 'Administrator',
          description: 'A sample pdf document.',
          keywords: 'pdf sample output',
          purposeChange: 'Initial message for the sample pdf document',
          versionType: VersionType.MINOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .stores('SampleOutputDocumentId', 'id')
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum.spec().get('/documents').inspect().expectStatus(200);
        });
      });

      describe('Upload a new minor version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange: 'Added a new minor version of the sample pdf document',
          versionType: VersionType.MINOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('Upload a new major version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange: 'Added a new major version of the sample pdf document',
          versionType: VersionType.MAJOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum.spec().get('/documents').inspect().expectStatus(200);
        });
      });

      describe('Upload a new major version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange:
            'Added another new major version of the sample pdf document',
          versionType: VersionType.MAJOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum
            .spec()
            .get('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .inspect()
            .expectStatus(200);
        });
      });

      describe('Upload a new major version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange:
            'Added another new minor version of the sample pdf document',
          versionType: VersionType.MINOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum
            .spec()
            .get('/documents/{id}/versions')
            .inspect()
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .expectStatus(200);
        });
      });

      describe('Upload a new major version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange: 'Made the final change to the sample pdf document',
          versionType: VersionType.FINAL,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum
            .spec()
            .get('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .inspect()
            .expectStatus(200);
        });
      });

      describe('Upload a new major version', function () {
        // upload a new version of Sample output.pdf
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Sample output.pdf',
        );

        const createDocumentDto: UpdateDocumentDto = {
          purposeChange: 'Made the first change to the sample pdf document',
          versionType: VersionType.MINOR,
          title: 'Sample output',
        };

        it('should return a new document', function () {
          return pactum
            .spec()
            .post('/documents/{id}/versions')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .withBody({ ...createDocumentDto })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .inspect()
            .expectStatus(201);
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum
            .spec()
            .get('/documents/{id}/versions')
            .inspect()
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .expectStatus(200);
        });
      });

      describe('View current document version', function () {
        it('should return the current document version', function () {
          return pactum
            .spec()
            .get('/documents/{id}/versions/search?status=current')
            .withPathParams('id', '$S{SampleOutputDocumentId}')
            .inspect()
            .expectStatus(200);
        });
      });

      describe('View all current document version', function () {
        it('should return all current document version', function () {
          return pactum
            .spec()
            .get('/documents/versions/search?status=current')
            .inspect()
            .expectStatus(200);
        });
      });
    });
  });
});
