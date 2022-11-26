import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DOCUMENT_VERSIONS_REPOSITORY } from './const';
import { DocumentVersion } from './entities';
import { VersionType } from './enum';
import { VersionStatus } from './enum/version-status';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @Inject(DOCUMENT_VERSIONS_REPOSITORY)
    private readonly documentVersionRepository: typeof DocumentVersion,
    public readonly documentFileService: DocumentFilesService,
  ) {}

  async getPreviousVersion(options: { documentVersionId?: string }) {
    let documentVersion: DocumentVersion;

    if (options.documentVersionId) {
      documentVersion = await this.documentVersionRepository.findOne({
        where: {
          // id: options.documentVersionId,
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

  async createNewVersion(createDocumentVersionDto: CreateDocumentVersionDto) {
    // before creating a new version, we need to check if the document already exists
    // if it does, we need to create a new version, based on the version number given,
    // of the document and update the document's version id
    // if the version number is minor, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
    // if the version number is major, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.1.0
    // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0
    // if it doesn't, we need to create a new document and a new version of the document

    // check if the document already exists
    const documentFile = await this.documentFileService.getDocument({
      documentFileId: createDocumentVersionDto.DocumentFileId,
    });

    if (
      documentFile &&
      createDocumentVersionDto.versionNumber &&
      createDocumentVersionDto.oldDocumentFileId
    ) {
      // find the version that is 'current' and  use it as the old version
      const oldDocumentVersion = await this.documentVersionRepository.findOne({
        where: {
          DocumentFileId: createDocumentVersionDto.oldDocumentFileId,
          versionStatus: VersionStatus.CURRENT,
        },
      });

      // check if the document version already exists,
      // while searching for the document version that has the same version that is 'current'
      // const documentVersion = await this.documentVersionRepository.findOne({
      //   where: {
      //     DocumentFileId: createDocumentVersionDto.oldDocumentFileId,
      //     versionNumber: createDocumentVersionDto.versionNumber,
      //   },
      // });

      if (oldDocumentVersion) {
        // if the document version already exists, we need to find the next version number
        // if the version number is minor, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.0.1
        // if the version number is major, we need to add 1 to the version number, for example, if the version number is 1.0.0, we need to make it 1.1.0
        // if the version number is final, we need to add 1 to the major version number, for example, if the version number is 1.0.0, we need to make it 2.0.0
        const versionNumber = createDocumentVersionDto.versionNumber.split('.');
        const minorVersionNumber = parseInt(versionNumber[2]);
        const majorVersionNumber = parseInt(versionNumber[1]);
        const finalVersionNumber = parseInt(versionNumber[0]);

        if (createDocumentVersionDto.versionType === VersionType.MINOR) {
          createDocumentVersionDto.versionNumber = `${finalVersionNumber}.${majorVersionNumber}.${
            minorVersionNumber + 1
          }`;
        } else if (createDocumentVersionDto.versionType === VersionType.MAJOR) {
          createDocumentVersionDto.versionNumber = `${finalVersionNumber}.${
            majorVersionNumber + 1
          }.${minorVersionNumber}`;
        } else if (createDocumentVersionDto.versionType === VersionType.FINAL) {
          createDocumentVersionDto.versionNumber = `${
            finalVersionNumber + 1
          }.${majorVersionNumber}.${minorVersionNumber}`;
        }

        // set all the old versions of the document to 'previous'

        const oldVersions = await this.documentVersionRepository.findAll({
          where: {
            DocumentFileId: createDocumentVersionDto.oldDocumentFileId,
          },
        });

        oldVersions.map(async (oldVersion) => {
          await oldVersion.update({
            versionStatus: VersionStatus.PREVIOUS,
          });
        });

        // set the current version to 'current'
        createDocumentVersionDto.versionStatus = VersionStatus.CURRENT;
      }
    } else {
      // if the document version doesn't exist, we need to create a new version of the document
      // we need to create a new version assuming that the version type is draft

      // create a default version number
      createDocumentVersionDto.versionNumber = '0.0.0';

      // since this is the first version of the document,
      // we need to set the current version to the version that is being 'current'

      // set the current version to the version that is being 'current'
      createDocumentVersionDto.versionStatus = VersionStatus.CURRENT;

      // check if the version number is final
      if (createDocumentVersionDto.versionType === VersionType.FINAL) {
        // if the version number is final, we need to add 1 to the major version number, for example,
        // if the version number is 1.0.0, we need to make it 2.0.0
        const versionNumber = createDocumentVersionDto.versionNumber.split('.');
        const majorVersionNumber = parseInt(versionNumber[0]);

        createDocumentVersionDto.versionNumber = `${
          majorVersionNumber + 1
        }.0.0`;
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
    }

    return await this.documentVersionRepository.create({
      ...createDocumentVersionDto,
    });
  }

  async createDocumentVersion(
    createDocumentVersionDto: CreateDocumentVersionDto,
  ): Promise<DocumentVersion> {
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

    return await this.documentVersionRepository.create({
      ...createDocumentVersionDto,
      versionStatus: VersionStatus.CURRENT,
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
          // DocumentFileId: upgradeDocumentVersionDto.oldDocumentFileId,
          versionStatus: VersionStatus.CURRENT,
        },
      },
    );

    if (!currentDocumentVersion) {
      throw new NotFoundException(
        `The current version of the document does not exist`,
      );
    }

    // extract the current version number from the current version
    const currentVersionNumber =
      currentDocumentVersion.versionNumber.split('.');
    const majorVersionNumber = parseInt(currentVersionNumber[0]);
    const minorVersionNumber = parseInt(currentVersionNumber[1]);
    const patchVersionNumber = parseInt(currentVersionNumber[2]);

    // using the current version number, we need to create the new version number
    if (upgradeDocumentVersionDto.versionType === VersionType.FINAL) {
      // if the version number is final, we need to add 1 to the major version number, for example,
      // if the version number is 1.0.0, we need to make it 2.0.0
      upgradeDocumentVersionDto.versionNumber = `${majorVersionNumber + 1}.0.0`;
    } else if (upgradeDocumentVersionDto.versionType === VersionType.MAJOR) {
      // if the version number is major, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.1.0
      upgradeDocumentVersionDto.versionNumber = `${majorVersionNumber}.${
        minorVersionNumber + 1
      }.0`;
    } else if (upgradeDocumentVersionDto.versionType === VersionType.MINOR) {
      // if the version number is minor, we need to add 1 to the version number, for example,
      // if the version number is 1.0.0, we need to make it 1.0.1
      upgradeDocumentVersionDto.versionNumber = `${majorVersionNumber}.${minorVersionNumber}.${
        patchVersionNumber + 1
      }`;
    } else {
      // if the version number is final, we need to add 1 to the major version number, for example,
      // if the version number is 1.0.0, we need to make it 2.0.0
      upgradeDocumentVersionDto.versionNumber = `${majorVersionNumber + 1}.0.0`;
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
