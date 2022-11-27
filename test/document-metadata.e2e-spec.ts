// create a test app for the document metadata sub-module
// Compare this snippet from src/document-metadata/document-metadata.module.ts:
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import * as path from 'path';
import { VersionType } from '../src/document-versions/enum';
import { CreateDocumentDto, UpdateDocumentDto } from '../src/documents/dto';

describe('Document Metadata (e2e)', () => {
  let documentMetadataApp: INestApplication;

  jest.setTimeout(10000);

  beforeAll(async () => {
    const documentMetadataModuleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    documentMetadataApp = documentMetadataModuleFixture.createNestApplication();
    documentMetadataApp.useGlobalPipes(new ValidationPipe());
    await documentMetadataApp.init();

    await documentMetadataApp.listen(process.env.PORT || 3000);
    pactum.request.setBaseUrl(`http://localhost:${process.env.PORT || 3000}`);
  });

  afterAll(async () => {
    await documentMetadataApp.close();
  });
  describe('Workflow management system', function () {
    describe('Login the admin', function () {
      const authDto: AuthDto = {
        username: 'admin',
        password: 'admin',
      };
      it('should return a new token', async function () {
        const res = await pactum
          .spec()
          .post('/auth/users/login')
          .withJson(authDto)
          .expectStatus(201)
          .inspect()
          .stores('access_token', 'access_token')
          .toss();
        expect(res.body.access_token).toBeTruthy();
        expect(res.body.userId).toBeTruthy();
        expect(res.body.role).toBeTruthy();
        expect(res.body.expires_in).toBeTruthy();
      });
    });
  });

  describe('Document metadata management system', function () {
    describe('Documents Module', function () {
      const baseDocumentPath = '../../tests/documents';

      describe('View Documents', function () {
        it('should return an empty array', function () {
          return pactum.spec().get('/documents').expectStatus(200);
        });
      });

      describe('Create Document', function () {
        const pathToFile = path.join(
          __dirname,
          baseDocumentPath,
          'Appendix one test.docx',
        );

        const createDocumentDto: CreateDocumentDto = {
          title: 'Appendix one test',
          description: 'This is a test document',
          versionType: VersionType.FINAL,
          keywords: 'test document final',
          purposeChange: 'Initial release for the appendix one test',
          creator: 'admin',
          contributors: 'admin git-copilot',
        };

        it('should create a new document', async function () {
          const res = await pactum
            .spec()
            .post('/documents')
            .withFile('document', pathToFile)
            .expectStatus(201)
            .withMultiPartFormData({ ...createDocumentDto })
            .stores('documentId', 'id')
            .inspect()
            .toss();
          expect(res.body.id).toBeTruthy();
        });
      });

      describe('View Documents', function () {
        it('should return an array of documents', function () {
          return pactum.spec().get('/documents').expectStatus(200).inspect();
        });
      });

      describe("View a document's metadata by id before updating", function () {
        it('should return a document metadata', function () {
          return pactum
            .spec()
            .get('/documents/{id}/metadata')
            .withPathParams('id', '$S{documentId}')
            .expectStatus(200)
            .inspect()
            .toss();
        });
      });

      describe('Update the document metadata', function () {
        it('should update the document metadata', function () {
          const updateDocumentDto: UpdateDocumentDto = {
            title: 'Appendix one test',
            description: 'This is an updated test document',
            keywords: 'test document final',
            creator: 'admin',
            contributors: 'admin git-copilot updated',
          };
          return pactum
            .spec()
            .patch(`/documents/{id}/metadata`)
            .withJson(updateDocumentDto)
            .withPathParams('id', '$S{documentId}')
            .expectStatus(200)
            .inspect()
            .toss();
        });
      });

      describe("View a document's metadata by id after updating", function () {
        it('should return a document metadata', function () {
          return pactum
            .spec()
            .get('/documents/{id}/metadata')
            .withPathParams('id', '$S{documentId}')
            .expectStatus(200)
            .inspect()
            .toss();
        });
      });

      describe('View all document metadata', function () {
        it('should return an array of document metadata', function () {
          return pactum
            .spec()
            .get('/documents/metadata')
            .expectStatus(200)
            .inspect();
        });
      });
    });
  });
});
