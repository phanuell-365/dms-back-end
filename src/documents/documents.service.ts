import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { DocumentVersionsService } from '../document-versions/document-versions.service';
import { DOCUMENT_NOT_FOUND_MESSAGE, DOCUMENT_REPOSITORY } from './const';
import { Document } from './entities';

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
    const documentVersion = await this.documentVersionService.createNewVersion(
      createDocumentDto,
      file,
    );

    const documentFile =
      await this.documentVersionService.documentFileService.getDocument({
        documentFileId: documentVersion.DocumentFileId,
      });

    if (!documentFile) throw new NotFoundException('Document File not Found!');

    const documentMetadata =
      await this.documentMetadataService.createDocumentMetadata(
        createDocumentDto,
        documentFile,
      );

    return await this.documentRepository.create({
      DocumentMetadataId: documentMetadata.id,
      DocumentVersionId: documentVersion.id,
    });
  }

  async findAll() {
    return await this.documentRepository.findAll();
  }

  async findOne(documentId: string) {
    const document = await this.getDocument({ documentId });

    if (!document) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_MESSAGE);
    }

    return document;
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
