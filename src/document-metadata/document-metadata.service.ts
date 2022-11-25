import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateDocumentMetadataDto, UpdateDocumentMetadataDto } from './dto';
import { CreateDocumentDto } from '../documents/dto';
import { DOCUMENT_METADATA_REPOSITORY } from './const';
import { DocumentMetadata } from './entities';
import { DocumentFile } from '../document-files/entities';

@Injectable()
export class DocumentMetadataService {
  constructor(
    @Inject(DOCUMENT_METADATA_REPOSITORY)
    private readonly documentMetadataRepository: typeof DocumentMetadata,
  ) {}

  async getDocumentMetadata(options: {
    title?: string;
    documentMetadataId?: string;
  }) {
    let documentMetadata: DocumentMetadata;

    if (options.documentMetadataId) {
      documentMetadata = await this.documentMetadataRepository.findByPk(
        options.documentMetadataId,
      );

      if (!documentMetadata) return false;
    } else if (options.title) {
      documentMetadata = await this.documentMetadataRepository.findOne({
        where: {
          title: options.title,
        },
      });

      if (!documentMetadata) return false;
    } else return false;

    return documentMetadata;
  }

  async createDocumentMetadata(
    createDocumentDto: CreateDocumentDto,
    documentFile: DocumentFile,
  ) {
    const createDocumentMetadataDto: CreateDocumentMetadataDto = {
      title: createDocumentDto.title,
      creator: createDocumentDto.creator,
      description: createDocumentDto.description,
      keywords: createDocumentDto.keywords,
      contributors: createDocumentDto?.contributors,
      type: documentFile.newFilename.split('.').pop(),
      creationDate: new Date(),
      format: documentFile.mimetype.split('/').pop(),
    };

    const documentMetadata = await this.getDocumentMetadata({
      title: createDocumentMetadataDto.title,
    });

    if (documentMetadata) {
      throw new ConflictException('A document with the title already exists!');
    }

    return await this.documentMetadataRepository.create({
      ...createDocumentMetadataDto,
    });
  }

  findAll() {
    return `This action returns all documentMetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentMetadatum`;
  }

  update(id: number, updateDocumentMetadatumDto: UpdateDocumentMetadataDto) {
    return `This action updates a #${id} documentMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentMetadatum`;
  }
}
