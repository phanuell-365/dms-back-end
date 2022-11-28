import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities';
import { Document } from '../../documents/entities';
import { OutboxMetadata } from '../../document-box-metadata/entities';
import { MarkStatus } from '../../document-box-metadata/enum';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class DocumentBox extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  public id: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: [MarkStatus.UNREAD, MarkStatus.READ],
  })
  public markStatus: MarkStatus;

  @CreatedAt
  sentAt: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  readAt: Date;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public SenderId: string;

  @BelongsTo(() => User, 'SenderId')
  sender: User;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public RecipientId: string;

  @BelongsTo(() => User, 'RecipientId')
  recipient: User;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public DocumentId: string;

  @BelongsTo(() => Document, 'DocumentId')
  document: Document;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public OutboxMetadataId: string;

  @BelongsTo(() => OutboxMetadata, 'OutboxMetadataId')
  outboxMetadata: OutboxMetadata;
}
