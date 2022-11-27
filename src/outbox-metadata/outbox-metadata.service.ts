import { Inject, Injectable } from '@nestjs/common';
import { CreateOutboxMetadataDto, UpdateOutboxMetadataDto } from './dto';
import { OUTBOX_METADATA_REPOSITORY } from './const';
import { OutboxMetadata } from './entities';

@Injectable()
export class OutboxMetadataService {
  constructor(
    @Inject(OUTBOX_METADATA_REPOSITORY)
    private outboxMetadataRepository: typeof OutboxMetadata,
  ) {}

  async createOutboxMetadata(createOutboxMetadataDto: CreateOutboxMetadataDto) {
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

  update(id: number, updateOutboxMetadatumDto: UpdateOutboxMetadataDto) {
    return `This action updates a #${id} outboxMetadatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} outboxMetadatum`;
  }
}
