import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentMetadataDto, UpdateDocumentMetadataDto } from './dto';
import { DOCUMENT_METADATA_REPOSITORY } from './const';
import { DocumentMetadata } from './entities';

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
    createDocumentMetadataDto: CreateDocumentMetadataDto,
  ) {
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

  async updateDocumentMetadata(
    documentMetadataId: string,
    updateDocumentMetadataDto: UpdateDocumentMetadataDto,
  ) {
    const documentMetadata = await this.getDocumentMetadata({
      documentMetadataId,
    });

    if (!documentMetadata) {
      throw new NotFoundException('Document metadata not found!');
    }

    // check if a document with the title already exists
    const documentMetadataTitle = await this.getDocumentMetadata({
      title: updateDocumentMetadataDto.title,
    });

    if (
      documentMetadataTitle &&
      documentMetadataTitle.id !== documentMetadata.id
    ) {
      throw new ConflictException('A document with the title already exists!');
    }

    return await documentMetadata.update(updateDocumentMetadataDto);
  }

  async findAllDocumentMetadata() {
    return await this.documentMetadataRepository.findAll();
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
