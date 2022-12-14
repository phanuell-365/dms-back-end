// create app for testing the outbox-inbox module
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateUserDto } from '../src/users/dto';
import { Roles } from '../src/users/enum';
import * as path from 'path';
import { CreateDocumentDto } from '../src/documents/dto';
import { VersionType } from '../src/document-versions/enum';
import { CreateDocumentBoxDto } from '../src/document-boxes/dto';
import { MarkAsReadDto } from '../src/document-boxes/dto/mark-as-read.dto';

describe('Outbox and Inbox App (e2e)', function () {
  let outboxInboxApp: INestApplication;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    outboxInboxApp = moduleFixture.createNestApplication();

    outboxInboxApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await outboxInboxApp.init();

    await outboxInboxApp.listen(process.env.TEST_PORT);
    pactum.request.setBaseUrl(`http://localhost:${process.env.TEST_PORT}`);
  });

  afterAll(async () => {
    await outboxInboxApp.close();
  });

  describe('Workflow Management System', function () {
    describe('Users Module', function () {
      const authDto: AuthDto = {
        email: 'admin@local.com',
        password: '12345678',
      };

      describe('Login', function () {
        it('should return an object having an access_token', async function () {
          const res = await pactum
            .spec()
            .post('/auth/users/login')
            .withBody({ ...authDto })
            .expectStatus(201)
            .stores('accessToken', 'access_token')
            .toss();
        });
      });

      describe('Create a couple of new users', function () {
        const firstUser: CreateUserDto = {
          firstname: 'Johny',
          lastname: 'Cage',
          password: 'cage1234',
          phone: '0729294854',
          role: Roles.PRINCIPAL,
          username: 'johny',
          email: 'johnycage@localhost.com',
        };

        const secondUser: CreateUserDto = {
          firstname: 'Miley',
          lastname: 'Cyrus',
          password: 'cyrus123',
          phone: '0729294854',
          role: Roles.REGISTRAR,
          username: 'miley',
          email: 'mileycyrus@localhost.com',
        };

        const thirdUser: CreateUserDto = {
          firstname: 'Obadiah',
          lastname: 'Stane',
          password: 'stane123',
          phone: '0729294854',
          role: Roles.HOD,
          username: 'obadiah',
          email: 'obadiahstane@localhost.com',
        };

        // create another HOD
        const fourthUser: CreateUserDto = {
          firstname: 'Ivy',
          lastname: 'Parker',
          password: 'parker12',
          phone: '0729294854',
          role: Roles.HOD,
          username: 'ivy',
          email: 'ivyparker@localhost.com',
        };

        it('should create the first user return', function () {
          // store the user's id as a variable 'userOneId'
          return pactum
            .spec()
            .post('/users')
            .withJson({ ...firstUser })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201)
            .stores('userOneId', 'id');
        });

        it('should create the second user and return', function () {
          // store the user's id as a variable 'userTwoId'
          return pactum
            .spec()
            .post('/users')
            .withJson({ ...secondUser })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201)
            .stores('userTwoId', 'id');
        });

        it('should create the third user and return', function () {
          // store the user's id as a variable 'userThreeId'
          return pactum
            .spec()
            .post('/users')
            .withJson({ ...thirdUser })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201)
            .stores('userThreeId', 'id');
        });

        it('should create the fourth user and return', function () {
          // store the user's id as a variable 'userFourId'
          return pactum
            .spec()
            .post('/users')
            .withJson({ ...fourthUser })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201)
            .stores('userFourId ', 'id');
        });
      });
    });
  });

  describe('Document Management System', function () {
    describe('Documents Module', function () {
      const baseDocumentPath = '../../tests/documents';

      describe('Create the first document', function () {
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
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .withMultiPartFormData({ ...createDocumentDto })
            .stores('AppendixOneId', 'id')
            .expectStatus(201);
        });
      });

      describe('Create the second document', function () {
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
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .stores('TestPlanId', 'id')
            .expectStatus(201);
        });
      });

      describe('Create the third document', function () {
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
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .withFile('document', pathToFile)
            .withMultiPartFormData({ ...createDocumentDto })
            .stores('SampleOutputId', 'id')
            .expectStatus(201);
        });
      });
    });
  });
  describe('Outbox and Inbox modules', function () {
    describe('Outbox Module', function () {
      describe('Send one document to a user', function () {
        const createDocumentOutboxDto: CreateDocumentBoxDto = {
          keywords: 'appendix milestone documentation',
          title: 'The appendix for the third milestone.',
          documentIds: ['$S{AppendixOneId}'],
          recipientIds: ['$S{userTwoId}'],
          content: 'This is a test message',
        };

        it('should return a new outbox', function () {
          return pactum
            .spec()
            .post('/documents/boxes/send')
            .withJson({ ...createDocumentOutboxDto })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201);
        });
      });

      describe('Send two documents to a user', function () {
        const createDocumentOutboxDto: CreateDocumentBoxDto = {
          keywords: 'appendix milestone documentation',
          title: 'The appendix for the third milestone.',
          documentIds: ['$S{AppendixOneId}', '$S{TestPlanId}'],
          recipientIds: ['$S{userTwoId}'],
          content: 'This is a test message',
        };

        it('should return a new outbox', function () {
          return pactum
            .spec()
            .post('/documents/boxes/send')
            .withJson({ ...createDocumentOutboxDto })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201);
        });
      });

      describe('Send three documents to two users', function () {
        const createDocumentOutboxDto: CreateDocumentBoxDto = {
          keywords: 'appendix milestone documentation',
          title: 'The appendix for the third milestone.',
          documentIds: [
            '$S{AppendixOneId}',
            '$S{TestPlanId}',
            '$S{SampleOutputId}',
          ],
          recipientIds: ['$S{userTwoId}', '$S{userThreeId}'],
          content: 'This is a test message',
        };

        it('should return a new outbox', function () {
          return pactum
            .spec()
            .post('/documents/boxes/send')
            .withJson({ ...createDocumentOutboxDto })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201);
        });
      });

      describe('Send three documents to three users', function () {
        const createDocumentOutboxDto: CreateDocumentBoxDto = {
          keywords: 'appendix milestone documentation',
          title: 'The appendix for the third milestone.',
          documentIds: [
            '$S{AppendixOneId}',
            '$S{TestPlanId}',
            '$S{SampleOutputId}',
          ],
          recipientIds: ['$S{userTwoId}', '$S{userThreeId}', '$S{userOneId}'],
          content: 'This is a test message',
        };

        it('should return a new outbox', function () {
          return pactum
            .spec()
            .post('/documents/boxes/send')
            .withJson({ ...createDocumentOutboxDto })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(201);
        });
      });
    });
  });

  describe('Sent and Received documents', function () {
    let firstSentDocumentMetadataId: string;
    describe('Sent documents', function () {
      describe('Get all sent documents', function () {
        it('should return all sent documents by the authorized user', async function () {
          const res = await pactum
            .spec()
            .inspect()
            .get('/documents/boxes/sent')
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(200)
            .toss();

          firstSentDocumentMetadataId = res.body[0].outboxMetadata.id;
        });
      });

      describe('Get one sent document', function () {
        it('should return the sent document by the authorized user', function () {
          return pactum
            .spec()
            .get('/documents/boxes/sent/{documentMetadataId}')
            .withPathParams({
              documentMetadataId: firstSentDocumentMetadataId,
            })
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(200);
        });
      });
    });

    describe('Received Documents', function () {
      // log in the second user
      describe('Log in the second user', function () {
        const secondUserAuthDto: AuthDto = {
          email: 'mileycyrus@localhost.com',
          password: 'cyrus123',
        };

        it('should return an access token', function () {
          return pactum
            .spec()
            .post('/auth/users/login')
            .withJson(secondUserAuthDto)
            .expectStatus(201)
            .stores('userTwoAccessToken', 'access_token')
            .toss();
        });
      });

      let firstReceivedDocumentMetadataId: string;
      let secondReceivedDocumentMetadataId: string;

      describe('Get all received documents', function () {
        it('should return all received documents by Miley Cyrus', async function () {
          const res = await pactum
            .spec()
            .get('/documents/boxes/received')
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .expectStatus(200)
            .toss();

          firstReceivedDocumentMetadataId = res.body[0].outboxMetadata.id;
          secondReceivedDocumentMetadataId = res.body[1].outboxMetadata.id;
        });

        it('should return all received documents by Admin', async function () {
          // const res = await pactum
          return pactum
            .spec()
            .get('/documents/boxes/received')
            .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
            .expectStatus(200)
            .toss();

          // firstReceivedDocumentMetadataId = res.body[0].outboxMetadata.id;
        });
      });

      describe('Get One Received Document', function () {
        it('should return a received document', function () {
          return pactum
            .spec()
            .get('/documents/boxes/received/{documentMetadataId}')
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .withPathParams({
              documentMetadataId: firstReceivedDocumentMetadataId,
            })
            .expectStatus(200);
        });
      });

      describe('Get All unread received documents', function () {
        it('should return an array of unread received documents', function () {
          return pactum
            .spec()
            .get('/documents/boxes/received/search?markStatus=unread')
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .expectStatus(200);
        });
      });

      describe('Get All read received documents', function () {
        it('should return an array of read received documents', function () {
          return pactum
            .spec()
            .get('/documents/boxes/received/search?markStatus=read')
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .expectStatus(200);
        });
      });

      describe('Mark one as read', function () {
        it('should mark one received document as read', function () {
          const markAsReadDto: MarkAsReadDto = {
            documentMetadataIds: [secondReceivedDocumentMetadataId],
            all: false,
          };
          return pactum
            .spec()
            .inspect()
            .patch('/documents/boxes/received')
            .withBody({ ...markAsReadDto })
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .expectStatus(200);
        });
      });

      describe('Mark all as read', function () {
        it('should mark all received documents and return them', function () {
          return pactum
            .spec()
            .patch('/documents/boxes/received')
            .withBody({ all: true, documentMetadataIds: [] } as MarkAsReadDto)
            .inspect()
            .withHeaders({ Authorization: 'Bearer $S{userTwoAccessToken}' })
            .expectStatus(200);
        });
      });
    });
  });
});
