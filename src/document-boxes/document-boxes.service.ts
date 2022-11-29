import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentBoxDto, UpdateDocumentBoxDto } from './dto';
import { User } from '../users/entities';
import { DocumentBoxMetadataService } from '../document-box-metadata/document-box-metadata.service';
import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentBox } from './entities';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';
import { MarkStatus } from '../document-box-metadata/enum';

@Injectable()
export class DocumentBoxesService {
  constructor(
    private readonly documentBoxMetadataService: DocumentBoxMetadataService,
    @Inject(DOCUMENT_OUTBOXES_REPOSITORY)
    private documentOutboxesRepository: typeof DocumentBox,
    private readonly usersService: UsersService,
    private readonly documentService: DocumentsService,
  ) {}

  // helper functions

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

  /**
   * @desc Finds all documentIds that match the specified options in the options object. It then removes any duplicate ids.
   * @param options An object to specify the options for the search for the document ids.
   * @return {Promise<string[]>} An array of unique document ids.
   */
  async getDocumentIds(options: {
    senderOrRecipientId?: string;
    outboxMetadataId?: string;
    sentOrReceived: 'sent' | 'received';
  }) {
    let documentIds: DocumentBox[];
    if (options.sentOrReceived === 'sent') {
      if (options.outboxMetadataId) {
        documentIds = await this.documentOutboxesRepository.findAll({
          where: {
            SenderId: options.senderOrRecipientId,
            OutboxMetadataId: options.outboxMetadataId,
          },
          attributes: ['DocumentId'],
        });
      } else {
        documentIds = await this.documentOutboxesRepository.findAll({
          where: {
            SenderId: options.senderOrRecipientId,
          },
          attributes: ['DocumentId'],
        });
      }
    } else if (options.sentOrReceived === 'received') {
      if (options.outboxMetadataId) {
        documentIds = await this.documentOutboxesRepository.findAll({
          where: {
            RecipientId: options.senderOrRecipientId,
            OutboxMetadataId: options.outboxMetadataId,
          },
          attributes: ['DocumentId'],
        });
      } else {
        documentIds = await this.documentOutboxesRepository.findAll({
          where: {
            RecipientId: options.senderOrRecipientId,
          },
          attributes: ['DocumentId'],
        });
      }
    } else {
      return;
    }

    return [...new Set(documentIds.map((documentId) => documentId.DocumentId))];
  }

  /**
   * @desc Finds all sender ids or recipient ids that match the specified options in the `options` object. It then removes any duplicate ids.
   * @param options An objet to specify the options for the search for the sender or the recipient ids.
   * @return {Promise<string[]>} An array of unique sender or recipient ids.
   */
  async getSenderOrRecipientIds(options: {
    senderOrRecipientId: string;
    outboxMetadataId: string;
    sentOrReceived: 'sent' | 'received';
  }) {
    let senderOrRecipientIds: DocumentBox[];

    if (options.sentOrReceived === 'sent') {
      senderOrRecipientIds = await this.documentOutboxesRepository.findAll({
        where: {
          SenderId: options.senderOrRecipientId,
          OutboxMetadataId: options.outboxMetadataId,
        },
        attributes: ['RecipientId'],
      });

      return [
        ...new Set(
          senderOrRecipientIds.map(
            (senderOrRecipientId) => senderOrRecipientId.RecipientId,
          ),
        ),
      ];
    } else if (options.sentOrReceived === 'received') {
      senderOrRecipientIds = await this.documentOutboxesRepository.findAll({
        where: {
          RecipientId: options.senderOrRecipientId,
          OutboxMetadataId: options.outboxMetadataId,
        },
        attributes: ['SenderId'],
      });

      return [
        ...new Set(
          senderOrRecipientIds.map(
            (senderOrRecipientId) => senderOrRecipientId.SenderId,
          ),
        ),
      ];
    } else return;
  }

  // services for controllers

  async create(createDocumentOutboxDto: CreateDocumentBoxDto, user: User) {
    const outboxMetadata =
      await this.documentBoxMetadataService.createOutboxMetadata({
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
              markStatus: MarkStatus.UNREAD,
              readAt: null,
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

  async findOneSentDocumentBoxByUser(
    documentBoxMetadataId: string,
    user: User,
  ) {
    // get all documentIds that the user has sent for each sent document-box
    const sentDocumentBoxes = await this.documentOutboxesRepository.findAll({
      where: { SenderId: user.id, OutboxMetadataId: documentBoxMetadataId },
    });

    // for each sent document-box, get all the documentIds, recipientIds, and outboxMetadataId
    const sentDocumentsBox = await Promise.all(
      sentDocumentBoxes.map(async (sentDocumentBox) => {
        const uniqueDocumentIds = await this.getDocumentIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
          sentOrReceived: 'sent',
        });

        const uniqueRecipientIds = await this.getSenderOrRecipientIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
          sentOrReceived: 'sent',
        });

        return {
          documentIds: uniqueDocumentIds,
          recipientIds: uniqueRecipientIds,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
        };
      }),
    );

    return {
      outboxMetadata:
        await this.documentBoxMetadataService.getDocumentBoxMetadata({
          outboxMetadataId: sentDocumentsBox[0].outboxMetadataId,
        }),
      documentIds: sentDocumentsBox[0].documentIds,
      recipientIds: sentDocumentsBox[0].recipientIds,
    };
  }

  async findAllSentDocumentBoxesByUser(user: User) {
    // get all documentIds that the user has sent for each sent document-box
    const sentDocumentBoxes = await this.documentOutboxesRepository.findAll({
      where: { SenderId: user.id },
    });

    // for each sent document-box, get all the documentIds, recipientIds, and outboxMetadataId
    const sentDocumentsBox = await Promise.all(
      sentDocumentBoxes.map(async (sentDocumentBox) => {
        const uniqueDocumentIds = await this.getDocumentIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
          sentOrReceived: 'sent',
        });

        const uniqueRecipientIds = await this.getSenderOrRecipientIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
          sentOrReceived: 'sent',
        });

        return {
          documentIds: uniqueDocumentIds,
          recipientIds: uniqueRecipientIds,
          outboxMetadataId: sentDocumentBox.OutboxMetadataId,
        };
      }),
    );

    // for each sent document-box, remove duplicates
    const uniqueSentDocumentsBox = [
      ...new Set(
        sentDocumentsBox.map(
          (sentDocumentBox) => sentDocumentBox.outboxMetadataId,
        ),
      ),
    ];

    return await Promise.all(
      uniqueSentDocumentsBox.map(async (outboxMetadataId) => {
        return {
          outboxMetadata:
            await this.documentBoxMetadataService.getDocumentBoxMetadata({
              outboxMetadataId,
            }),
          documentIds: sentDocumentsBox.find(
            (sentDocumentBox) =>
              sentDocumentBox.outboxMetadataId === outboxMetadataId,
          ).documentIds,
          recipientIds: sentDocumentsBox.find(
            (sentDocumentBox) =>
              sentDocumentBox.outboxMetadataId === outboxMetadataId,
          ).recipientIds,
        };
      }),
    );
  }

  async findAllReceivedDocumentBoxesByUser(user: User) {
    const receivedDocumentBoxes = await this.documentOutboxesRepository.findAll(
      {
        where: { RecipientId: user.id },
      },
    );

    // for each received document-box, get all the documentIds, senderIds, and outboxMetadataId
    const receivedDocumentsBox = await Promise.all(
      receivedDocumentBoxes.map(async (receivedDocumentBox) => {
        const uniqueDocumentIds = await this.getDocumentIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
          sentOrReceived: 'received',
        });

        const uniqueSenderIds = await this.getSenderOrRecipientIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
          sentOrReceived: 'received',
        });

        return {
          documentIds: uniqueDocumentIds,
          senderIds: uniqueSenderIds,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
        };
      }),
    );

    // for each received document-box, remove duplicates
    const uniqueReceivedDocumentsBox = [
      ...new Set(
        receivedDocumentsBox.map(
          (receivedDocumentBox) => receivedDocumentBox.outboxMetadataId,
        ),
      ),
    ];

    return Promise.all(
      uniqueReceivedDocumentsBox.map(async (outboxMetadataId) => {
        return {
          outboxMetadata:
            await this.documentBoxMetadataService.getDocumentBoxMetadata({
              outboxMetadataId,
            }),
          documentIds: receivedDocumentsBox.find(
            (receivedDocumentBox) =>
              receivedDocumentBox.outboxMetadataId === outboxMetadataId,
          ).documentIds,
          senderIds: receivedDocumentsBox.find(
            (receivedDocumentBox) =>
              receivedDocumentBox.outboxMetadataId === outboxMetadataId,
          ).senderIds,
        };
      }),
    );
  }

  async findOneReceivedDocumentBoxByUser(
    documentBoxMetadataId: string,
    user: User,
  ) {
    const receivedDocumentBoxes = await this.documentOutboxesRepository.findAll(
      {
        where: {
          RecipientId: user.id,
          OutboxMetadataId: documentBoxMetadataId,
        },
      },
    );

    const receivedDocumentsBox = await Promise.all(
      receivedDocumentBoxes.map(async (receivedDocumentBox) => {
        const uniqueDocumentIds = await this.getDocumentIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
          sentOrReceived: 'received',
        });

        const uniqueSenderIds = await this.getSenderOrRecipientIds({
          senderOrRecipientId: user.id,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
          sentOrReceived: 'received',
        });

        return {
          documentIds: uniqueDocumentIds,
          senderIds: uniqueSenderIds,
          outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
        };
      }),
    );

    return {
      outboxMetadata:
        await this.documentBoxMetadataService.getDocumentBoxMetadata({
          outboxMetadataId: receivedDocumentsBox[0].outboxMetadataId,
        }),
      documentsId: receivedDocumentsBox[0].documentIds,
      senderIds: receivedDocumentsBox[0].senderIds,
    };
  }

  findAll() {
    return `This action returns all documentSentboxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentSentbox`;
  }

  update(id: number, updateDocumentSentboxDto: UpdateDocumentBoxDto) {
    return `This action updates a #${id} documentSentbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentSentbox`;
  }
}
