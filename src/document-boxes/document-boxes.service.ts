import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentBoxDto, UpdateDocumentBoxDto } from './dto';
import { User } from '../users/entities';
import { DocumentBoxMetadataService } from '../document-box-metadata/document-box-metadata.service';
import { DOCUMENT_OUTBOXES_REPOSITORY } from './const';
import { DocumentBox } from './entities';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';
import { MarkStatus } from '../document-box-metadata/enum';
import {
  IsInstanceOfReceivedDocumentBoxes,
  IsInstanceOfSentDocumentBoxes,
  ReceivedDocumentBox,
  ReceivedDocumentBoxes,
  SentDocumentBox,
  SentDocumentBoxes,
} from './interfaces';
import { Roles } from '../users/enum';

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

  async getSentOrReceivedDocumentBoxes(options: {
    sentOrReceivedDocumentBoxes: DocumentBox[];
    sentOrReceived: 'sent' | 'received';
    userId: string;
  }) {
    if (options.sentOrReceived === 'sent') {
      return await Promise.all(
        options.sentOrReceivedDocumentBoxes.map(async (sentDocumentBox) => {
          return {
            documentIds: await this.getDocumentIds({
              senderOrRecipientId: options.userId,
              outboxMetadataId: sentDocumentBox.OutboxMetadataId,
              sentOrReceived: options.sentOrReceived,
            }),
            recipientIds: await this.getSenderOrRecipientIds({
              senderOrRecipientId: options.userId,
              outboxMetadataId: sentDocumentBox.OutboxMetadataId,
              sentOrReceived: options.sentOrReceived,
            }),
            outboxMetadataId: sentDocumentBox.OutboxMetadataId,
          } as SentDocumentBoxes;
        }),
      );
    } else if (options.sentOrReceived === 'received') {
      return await Promise.all(
        options.sentOrReceivedDocumentBoxes.map(async (receivedDocumentBox) => {
          return {
            documentIds: await this.getDocumentIds({
              senderOrRecipientId: options.userId,
              outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
              sentOrReceived: options.sentOrReceived,
            }),
            senderIds: await this.getSenderOrRecipientIds({
              senderOrRecipientId: options.userId,
              outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
              sentOrReceived: options.sentOrReceived,
            }),
            outboxMetadataId: receivedDocumentBox.OutboxMetadataId,
          } as ReceivedDocumentBoxes;
        }),
      );
    } else return;
  }

  async getSentOrReceivedDocumentBoxesByUser(options: {
    sentOrReceivedDocumentBoxes: DocumentBox[];
    sentOrReceived: 'sent' | 'received';
    userId: string;
  }) {
    const sentOrReceivedBox = await this.getSentOrReceivedDocumentBoxes({
      sentOrReceivedDocumentBoxes: options.sentOrReceivedDocumentBoxes,
      sentOrReceived: options.sentOrReceived,
      userId: options.userId,
    });

    let receivedDocumentBox: ReceivedDocumentBoxes[];

    if (IsInstanceOfReceivedDocumentBoxes(sentOrReceivedBox[0])) {
      receivedDocumentBox = <ReceivedDocumentBoxes[]>sentOrReceivedBox;
    }

    let sentDocumentBox: SentDocumentBoxes[];

    if (IsInstanceOfSentDocumentBoxes(sentOrReceivedBox[0])) {
      sentDocumentBox = <SentDocumentBoxes[]>sentOrReceivedBox;
    }
    // for each sent document-box, remove duplicates
    const uniqueSentOrReceivedDocumentsBox = [
      ...new Set(
        sentOrReceivedBox.map(
          (sentOrReceivedDocumentBox) =>
            sentOrReceivedDocumentBox.outboxMetadataId,
        ),
      ),
    ];

    return await Promise.all(
      uniqueSentOrReceivedDocumentsBox.map(async (outboxMetadataId) => {
        if (options.sentOrReceived === 'sent') {
          return {
            outboxMetadata:
              await this.documentBoxMetadataService.getDocumentBoxMetadata({
                outboxMetadataId,
              }),
            documentIds: sentDocumentBox.find(
              (sentDocumentBox) =>
                sentDocumentBox.outboxMetadataId === outboxMetadataId,
            ).documentIds,
            recipientIds: sentDocumentBox.find(
              (sentDocumentBox) =>
                sentDocumentBox.outboxMetadataId === outboxMetadataId,
            ).recipientIds,
          } as SentDocumentBox;
        } else if (options.sentOrReceived === 'received') {
          return {
            outboxMetadata:
              await this.documentBoxMetadataService.getDocumentBoxMetadata({
                outboxMetadataId,
              }),
            documentIds: receivedDocumentBox.find(
              (receivedDocumentBox) =>
                receivedDocumentBox.outboxMetadataId === outboxMetadataId,
            ).documentIds,
            senderIds: receivedDocumentBox.find(
              (receivedDocumentBox) =>
                receivedDocumentBox.outboxMetadataId === outboxMetadataId,
            ).senderIds,
          } as ReceivedDocumentBox;
        }
      }),
    );
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

    const sentDocumentsBox = <Awaited<SentDocumentBoxes>[]>(
      await this.getSentOrReceivedDocumentBoxes({
        sentOrReceivedDocumentBoxes: sentDocumentBoxes,
        sentOrReceived: 'sent',
        userId: user.id,
      })
    );

    const [sentDocumentBox] = sentDocumentsBox;

    return {
      outboxMetadata:
        await this.documentBoxMetadataService.getDocumentBoxMetadata({
          outboxMetadataId: sentDocumentBox.outboxMetadataId,
        }),
      documentIds: sentDocumentBox.documentIds,
      recipientIds: sentDocumentBox.recipientIds,
    };
  }

  async findAllSentDocumentBoxesByUser(user: User) {
    // get all documentIds that the user has sent for each sent document-box
    const sentDocumentBoxes = await this.documentOutboxesRepository.findAll({
      where: { SenderId: user.id },
    });

    if (sentDocumentBoxes.length <= 0) {
      return sentDocumentBoxes;
    }

    return await this.getSentOrReceivedDocumentBoxesByUser({
      sentOrReceivedDocumentBoxes: sentDocumentBoxes,
      sentOrReceived: 'sent',
      userId: user.id,
    });
  }

  async findAllReceivedDocumentBoxesByUser(user: User) {
    const receivedDocumentBoxes = await this.documentOutboxesRepository.findAll(
      {
        where: { RecipientId: user.id },
      },
    );

    if (user.role === Roles.ADMIN) {
      console.error({
        receivedDocumentBoxes: receivedDocumentBoxes.map(
          (value) => value.dataValues,
        ),
        length: receivedDocumentBoxes.length,
      });
    }
    if (receivedDocumentBoxes.length <= 0) {
      return receivedDocumentBoxes;
    }

    return await this.getSentOrReceivedDocumentBoxesByUser({
      sentOrReceivedDocumentBoxes: receivedDocumentBoxes,
      sentOrReceived: 'received',
      userId: user.id,
    });
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

    if (receivedDocumentBoxes.length > 0) {
      const receivedDocumentsBox = <Awaited<ReceivedDocumentBoxes>[]>(
        await this.getSentOrReceivedDocumentBoxes({
          sentOrReceivedDocumentBoxes: receivedDocumentBoxes,
          sentOrReceived: 'received',
          userId: user.id,
        })
      );

      // mark the received document box as read
      const [theReceivedDocument] = receivedDocumentBoxes;

      if (theReceivedDocument.markStatus === MarkStatus.UNREAD) {
        theReceivedDocument.markStatus = MarkStatus.READ;
        theReceivedDocument.readAt = new Date();
        await theReceivedDocument.save();
      }

      const [receivedDocumentBox] = receivedDocumentsBox;

      return {
        outboxMetadata:
          await this.documentBoxMetadataService.getDocumentBoxMetadata({
            outboxMetadataId: receivedDocumentBox.outboxMetadataId,
          }),
        documentsId: receivedDocumentBox.documentIds,
        senderIds: receivedDocumentBox.senderIds,
      };
    } else
      return {
        outboxMetadata: {},
        documentsId: [],
        senderIds: [],
      };
  }

  async findAllReceivedReadOrUnreadDocuments(
    markStatus: MarkStatus,
    user: User,
  ) {
    const unreadReceivedDocumentBoxes: DocumentBox[] =
      await this.documentOutboxesRepository.findAll({
        where: {
          RecipientId: user.id,
          markStatus,
        },
      });

    if (unreadReceivedDocumentBoxes.length <= 0) {
      return unreadReceivedDocumentBoxes;
    }
    return await this.getSentOrReceivedDocumentBoxesByUser({
      sentOrReceivedDocumentBoxes: unreadReceivedDocumentBoxes,
      sentOrReceived: 'received',
      userId: user.id,
    });
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
