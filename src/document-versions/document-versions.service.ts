import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DOCUMENT_VERSIONS_REPOSITORY } from './const';
import { DocumentVersion } from './entities';
import { VersionType } from './enum';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @Inject(DOCUMENT_VERSIONS_REPOSITORY)
    private readonly documentVersionRepository: typeof DocumentVersion,
    public readonly documentFileService: DocumentFilesService,
  ) {}

  async createNewVersion(createDocumentVersionDto: CreateDocumentVersionDto) {
    // before creating a new version, we need to check if the document already exists
    // if it does, we need to create a new version, based on the version number given,
    // of the document and update the document's version id
    // if the version number is draft, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
    // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0
    // if it doesn't, we need to create a new document and a new version of the document

    // check if the document already exists
    const documentFile = await this.documentFileService.getDocument({
      documentFileId: createDocumentVersionDto.DocumentFileId,
    });

    if (documentFile && createDocumentVersionDto.versionNumber) {
      // check if the document version already exists
      const documentVersion = await this.documentVersionRepository.findOne({
        where: {
          DocumentFileId: createDocumentVersionDto.DocumentFileId,
          versionNumber: createDocumentVersionDto?.versionNumber,
        },
      });

      if (documentVersion) {
        // if the document version already exists, we need to find the next version number
        // if the version number is draft, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
        // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0
        const versionNumber = createDocumentVersionDto.versionNumber.split('.');
        const majorVersionNumber = parseInt(versionNumber[0]);
        const minorVersionNumber = parseInt(versionNumber[1]);

        if (createDocumentVersionDto.versionType === VersionType.DRAFT) {
          // add 1 to the minor version number
          createDocumentVersionDto.versionNumber = `${majorVersionNumber}.${
            minorVersionNumber + 1
          }.0`;
        } else {
          // add 1 to the major version number
          createDocumentVersionDto.versionNumber = `${
            majorVersionNumber + 1
          }.0.0`;
        }
      }
    } else {
      // if the document version doesn't exist, we need to create a new version of the document
      // we need to create a new version assuming that the version type is draft

      // create a default version number
      createDocumentVersionDto.versionNumber = '0.0.0';

      // check if the version number is final
      if (createDocumentVersionDto.versionType === VersionType.FINAL) {
        // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0
        const versionNumber = createDocumentVersionDto.versionNumber.split('.');
        const majorVersionNumber = parseInt(versionNumber[0]);

        createDocumentVersionDto.versionNumber = `${
          majorVersionNumber + 1
        }.0.0`;
      } else {
        // create a default version number
        createDocumentVersionDto.versionNumber = '0.0.0';
        // if the version number is draft, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
        const versionNumber = createDocumentVersionDto.versionNumber.split('.');
        const minorVersionNumber = parseInt(versionNumber[1]);

        createDocumentVersionDto.versionNumber = `${versionNumber[0]}.${
          minorVersionNumber + 1
        }.0`;
      }
    }

    console.error({ createDocumentVersionDto });

    return await this.documentVersionRepository.create({
      ...createDocumentVersionDto,
    });
  }

  findAll() {
    return `This action returns all documentVersions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentVersion`;
  }

  update(id: number, updateDocumentVersionDto, UpdateDocumentVersionDto) {
    return `This action updates a #${id} documentVersion`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentVersion`;
  }
}
