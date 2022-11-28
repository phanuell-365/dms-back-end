import { Inject, Injectable } from '@nestjs/common';
import {
  CreateDocumentBoxMetadataDto,
  UpdateDocumentBoxMetadataDto,
} from './dto';
import { OUTBOX_METADATA_REPOSITORY } from './const';
import { OutboxMetadata } from './entities';

@Injectable()
export class DocumentBoxMetadataService {
  constructor(
    @Inject(OUTBOX_METADATA_REPOSITORY)
    private outboxMetadataRepository: typeof OutboxMetadata,
  ) {}

  async getDocumentBoxMetadata({ outboxMetadataId }) {
    return await this.outboxMetadataRepository.findOne({
      where: { id: outboxMetadataId },
    });
  }

  async createOutboxMetadata(
    createOutboxMetadataDto: CreateDocumentBoxMetadataDto,
  ) {
    return await this.outboxMetadataRepository.create({
      ...createOutboxMetadataDto,
    });
  }

  findAll() {
    return `This action returns all outboxMetadata`;
  }

  findOne(id: number) {
    return `This action returns a #${id} outboxMetadatum`;
  }

  update(id: number, updateOutboxMetadatumDto: UpdateDocumentBoxMetadataDto) {
    return `This action updates a #${id} outboxMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} outboxMetadatum`;
  }
}
