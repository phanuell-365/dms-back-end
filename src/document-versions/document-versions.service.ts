import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DOCUMENT_VERSIONS_REPOSITORY } from './const';
import { DocumentVersion } from './entities';
import { VersionType } from './enum';
import { VersionStatus } from './enum/version-status';
import { DOCUMENT_REPOSITORY } from '../documents/const';
import { Document } from '../documents/entities';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @Inject(DOCUMENT_VERSIONS_REPOSITORY)
    private readonly documentVersionRepository: typeof DocumentVersion,
    public readonly documentFileService: DocumentFilesService,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
  ) {}

  async getPreviousVersion(options: { documentId?: string }) {
    let documentVersion: DocumentVersion;

    if (options.documentId) {
      documentVersion = await this.documentVersionRepository.findOne({
        where: {
          DocumentId: options.documentId,
          versionStatus: VersionStatus.CURRENT,
        },
      });

      if (!documentVersion) {
        return false;
      }
    }
    return documentVersion;
  }

  async getDocumentVersion(options: { documentVersionId?: string }) {
    let documentVersion: DocumentVersion;

    if (options.documentVersionId) {
      documentVersion = await this.documentVersionRepository.findByPk(
        options.documentVersionId,
      );

      if (!documentVersion) {
        return false;
      }
    }
    return documentVersion;
  }

  async createDocumentVersion(
    createDocumentVersionDto: CreateDocumentVersionDto,
  ): Promise<DocumentVersion> {
    // check if the document version already exists
    const previousDocumentVersion = await this.getPreviousVersion({
      documentId: createDocumentVersionDto.DocumentId,
    });

    if (previousDocumentVersion) {
      return await this.upgradeDocumentVersion(createDocumentVersionDto);
    }

    // we need to create a new version number of the document
    // if the version number is minor, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
    // if the version number is major, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.1.0
    // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0

    // create a default version number
    createDocumentVersionDto.versionNumber = '0.0.0';

    // check if the version number is final
    if (createDocumentVersionDto.versionType === VersionType.FINAL) {
      // if the version number is final, we need to add 1 to the major version number, for example,
      // if the version number is 1.0.0, we need to make it 2.0.0
      const versionNumber = createDocumentVersionDto.versionNumber.split('.');
      const majorVersionNumber = parseInt(versionNumber[0]);

      createDocumentVersionDto.versionNumber = `${majorVersionNumber + 1}.0.0`;
    } else if (createDocumentVersionDto.versionType === VersionType.MAJOR) {
      // create a default version number
      createDocumentVersionDto.versionNumber = '0.0.0';
      // if the version number is major, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.1.0
      const versionNumber = createDocumentVersionDto.versionNumber.split('.');
      const minorVersionNumber = parseInt(versionNumber[1]);

      createDocumentVersionDto.versionNumber = `${versionNumber[0]}.${
        minorVersionNumber + 1
      }.0`;
    } else if (createDocumentVersionDto.versionType === VersionType.MINOR) {
      // create a default version number
      createDocumentVersionDto.versionNumber = '0.0.0';
      // if the version number is minor, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.0.1
      const versionNumber = createDocumentVersionDto.versionNumber.split('.');
      const patchVersionNumber = parseInt(versionNumber[2]);

      createDocumentVersionDto.versionNumber = `${versionNumber[0]}.${
        versionNumber[1]
      }.${patchVersionNumber + 1}`;
    }

    createDocumentVersionDto.versionStatus = VersionStatus.CURRENT;

    return await this.documentVersionRepository.create({
      ...createDocumentVersionDto,
    });
  }

  async upgradeDocumentVersion(
    upgradeDocumentVersionDto: CreateDocumentVersionDto,
  ): Promise<DocumentVersion> {
    // we need to upgrade the version number of the document
    // if the version number is minor, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
    // if the version number is major, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.1.0
    // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0

    // we need to find the current version of the document
    const currentDocumentVersion = await this.documentVersionRepository.findOne(
      {
        where: {
          DocumentId: upgradeDocumentVersionDto.DocumentId,
          versionStatus: VersionStatus.CURRENT,
        },
      },
    );

    console.error({ currentDocumentVersion });

    if (!currentDocumentVersion) {
      throw new NotFoundException(
        `The current version of the document does not exist`,
      );
    }

    // extract the current version number from the current version
    const currentVersionNumber =
      currentDocumentVersion.versionNumber.split('.');
    const finalVersionNumber = parseInt(currentVersionNumber[0]);
    const majorVersionNumber = parseInt(currentVersionNumber[1]);
    const minorVersionNumber = parseInt(currentVersionNumber[2]);

    // using the current version number, we need to create the new version number
    if (upgradeDocumentVersionDto.versionType === VersionType.FINAL) {
      // if the version number is final, we need to add 1 to the major version number, for example,
      // if the version number is 1.0.0, we need to make it 2.0.0
      upgradeDocumentVersionDto.versionNumber = `${finalVersionNumber + 1}.0.0`;
    } else if (upgradeDocumentVersionDto.versionType === VersionType.MAJOR) {
      // if the version number is major, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.1.0
      upgradeDocumentVersionDto.versionNumber = `${finalVersionNumber}.${
        majorVersionNumber + 1
      }.0`;
    } else if (upgradeDocumentVersionDto.versionType === VersionType.MINOR) {
      // if the version number is minor, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.0.1
      upgradeDocumentVersionDto.versionNumber = `${finalVersionNumber}.${majorVersionNumber}.${
        minorVersionNumber + 1
      }`;
    }

    // we need to set the current version to be 'previous'
    currentDocumentVersion.versionStatus = VersionStatus.PREVIOUS;

    // we need to save the current version
    await currentDocumentVersion.save();

    // set the new version to be 'current'
    upgradeDocumentVersionDto.versionStatus = VersionStatus.CURRENT;

    // we need to create a new version
    return await this.documentVersionRepository.create({
      ...upgradeDocumentVersionDto,
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
