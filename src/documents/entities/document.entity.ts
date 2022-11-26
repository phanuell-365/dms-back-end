import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DocumentMetadata } from '../../document-metadata/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class Document extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @ForeignKey(() => DocumentMetadata)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  DocumentMetadataId: string;

  @BelongsTo(() => DocumentMetadata, 'DocumentMetadataId')
  documentMetadata: DocumentMetadata;
}
