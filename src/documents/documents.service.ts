import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { DocumentVersionsService } from '../document-versions/document-versions.service';
import { DOCUMENT_NOT_FOUND_MESSAGE, DOCUMENT_REPOSITORY } from './const';
import { Document } from './entities';
import { UpdateDocumentVersionDto } from '../document-versions/dto';
import { VersionStatus } from '../document-versions/enum';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: typeof Document,
    private readonly documentMetadataService: DocumentMetadataService,
    private readonly documentVersionService: DocumentVersionsService,
  ) {}

  async getDocument(options: { documentId?: string }) {
    let document: Document;

    if (options.documentId) {
      document = await this.documentRepository.findByPk(options.documentId);

      if (!document) {
        return false;
      }
    } else return false;

    return document;
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    const documentFile =
      await this.documentVersionService.documentFileService.uploadDocument({
        mimetype: file.mimetype,
        originalFilename: file.originalname,
        size: file.size,
        newFilename: file.filename,
      });

    const documentMetadata =
      await this.documentMetadataService.createDocumentMetadata({
        title: createDocumentDto.title,
        description: createDocumentDto.description,
        keywords: createDocumentDto.keywords,
        creator: createDocumentDto.creator,
        contributors: createDocumentDto.contributors,
        type: documentFile.newFilename.split('.').pop(),
        creationDate: new Date(),
        format: documentFile.mimetype.split('/').pop(),
      });

    const newDocument = await this.documentRepository.create({
      DocumentMetadataId: documentMetadata.id,
    });

    await this.documentVersionService.createDocumentVersion({
      purposeChange: createDocumentDto.purposeChange,
      versionType: createDocumentDto.versionType,
      DocumentFileId: documentFile.id,
      versioningDate: new Date(),
      DocumentId: newDocument.id,
    });

    return newDocument;
  }

  async findAll() {
    return await this.documentRepository.findAll();
  }

  async findAllCurrentVersions() {
    return await this.documentVersionService.findAllCurrentVersions();
  }

  async getDocumentVersions(documentId: string) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return await this.documentVersionService.getDocumentVersions({
      documentId,
    });
  }

  async getCurrentDocumentVersion(
    documentId: string,
    versionStatus: VersionStatus,
  ) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    const documentVersion = await this.documentVersionService.getCurrentVersion(
      {
        documentId,
        versionStatus,
      },
    );

    if (!documentVersion) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return documentVersion;
  }

  async findOne(documentId: string) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return document;
  }

  async uploadNewDocumentVersion(
    documentId: string,
    updateDocumentVersionDto: UpdateDocumentVersionDto,
    file: Express.Multer.File,
  ) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    // look for the latest version of the document
    const documentVersion =
      await this.documentVersionService.getPreviousVersion({
        documentId,
      });

    if (!documentVersion) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    const documentFile =
      await this.documentVersionService.documentFileService.uploadDocument({
        mimetype: file.mimetype,
        originalFilename: file.originalname,
        size: file.size,
        newFilename: file.filename,
      });

    // create a new version of the document
    const newDocumentVersion =
      await this.documentVersionService.upgradeDocumentVersion({
        DocumentId: documentId,
        purposeChange: updateDocumentVersionDto.purposeChange,
        versionType: updateDocumentVersionDto.versionType,
        DocumentFileId: documentFile.id,
        oldDocumentFileId: documentVersion.DocumentFileId,
        versioningDate: new Date(),
        versionNumber: documentVersion.versionNumber,
      });
    //
    // const documentVersion = await this.documentVersionService.createNewVersion({
    //   purposeChange: updateDocumentVersionDto.purposeChange,
    //   versionType: updateDocumentVersionDto.versionType,
    //   DocumentFileId: documentFile.id,
    //   versioningDate: new Date(),
    // });

    // create the same document with new version
    return await this.documentRepository.create({
      DocumentMetadataId: document.DocumentMetadataId,
      DocumentVersionId: newDocumentVersion.id,
    });
  }

  async findDocumentMetadata(documentId: string) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return await this.documentMetadataService.getDocumentMetadata({
      documentMetadataId: document.DocumentMetadataId,
    });
  }

  async findAllDocumentMetadata() {
    console.error('findAllDocumentMetadata');
    return await this.documentMetadataService.findAllDocumentMetadata();
  }

  async updateDocumentMetadata(
    documentId: string,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return await this.documentMetadataService.updateDocumentMetadata(
      document.DocumentMetadataId,
      {
        title: updateDocumentDto.title,
        description: updateDocumentDto.description,
        keywords: updateDocumentDto.keywords,
        creator: updateDocumentDto.creator,
        contributors: updateDocumentDto.contributors,
      },
    );
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
