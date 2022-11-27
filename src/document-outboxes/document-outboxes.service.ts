import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentOutboxDto, UpdateDocumentOutboxDto } from './dto';
import { User } from '../users/entities';
import { OutboxMetadataService } from '../outbox-metadata/outbox-metadata.service';
import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentOutbox } from './entities';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class DocumentOutboxesService {
  constructor(
    private readonly outboxMetadataService: OutboxMetadataService,
    @Inject(DOCUMENT_OUTBOXES_REPOSITORY)
    private documentOutboxesRepository: typeof DocumentOutbox,
    private readonly usersService: UsersService,
    private readonly documentService: DocumentsService,
  ) {}

  async validateRecipientIds(recipientIds: string[]) {
    // for each recipientId, check if it exists in the database

    recipientIds.map(async (recipientId) => {
      const user = await this.usersService.getUser({ userId: recipientId });

      if (!user) {
        throw new Error(`User with id ${recipientId} does not exist.`);
      }
    });

    return true;
  }

  async validateDocumentIds(documentIds: string[]) {
    // for each documentId, check if it exists in the database

    documentIds.map(async (documentId) => {
      const document = await this.documentService.getDocument({ documentId });

      if (!document) {
        throw new Error(`Document with id ${documentId} does not exist.`);
      }
    });

    return true;
  }

  async create(createDocumentOutboxDto: CreateDocumentOutboxDto, user: User) {
    const outboxMetadata =
      await this.outboxMetadataService.createOutboxMetadata({
        title: createDocumentOutboxDto.title,
        content: createDocumentOutboxDto.content,
        keywords: createDocumentOutboxDto.keywords,
        sentAt: new Date(),
      });

    // validate recipientIds
    await this.validateRecipientIds(createDocumentOutboxDto.recipientIds);

    // validate documentIds
    await this.validateDocumentIds(createDocumentOutboxDto.documentIds);

    // for each recipientId, create a documentOutbox attaching every documentId to it
    return await Promise.all(
      createDocumentOutboxDto.recipientIds.map(async (recipientId) => {
        return Promise.all(
          createDocumentOutboxDto.documentIds.map(async (documentId) => {
            return await this.documentOutboxesRepository.create({
              RecipientId: recipientId,
              DocumentId: documentId,
              SenderId: user.id,
              OutboxMetadataId: outboxMetadata.id,
            });
          }),
        );
      }),
    );
  }

  findAll() {
    return `This action returns all documentSentboxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentSentbox`;
  }

  update(id: number, updateDocumentSentboxDto: UpdateDocumentOutboxDto) {
    return `This action updates a #${id} documentSentbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentSentbox`;
  }
}
