import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DocumentFile } from '../../document-files/entities';
import { VersionType } from '../enum';
import { VersionStatus } from '../enum/version-status';
import { Document } from '../../documents/entities';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class DocumentVersion extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  purposeChange: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  versionNumber: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  versioningDate: Date;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: Object.values(VersionType),
  })
  versionType: VersionType;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: Object.values(VersionStatus),
  })
  versionStatus: VersionStatus;

  @ForeignKey(() => DocumentFile)
  DocumentId: string;

  @BelongsTo(() => Document, 'DocumentId')
  documentId: Document;

  @ForeignKey(() => DocumentFile)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  DocumentFileId: string;

  @BelongsTo(() => DocumentFile, 'DocumentFileId')
  documentFile: DocumentFile;
}
