import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class OutboxMetadata extends Model {
  // create attributes for sending a document to another user here
  // this is the metadata for the document,
  // it's like the metadata for sending an email

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
    type: DataType.STRING,
  })
  public title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  public content: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  public keywords: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public sentAt: Date;
}
