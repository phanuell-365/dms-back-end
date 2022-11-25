import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class DocumentMetadata extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  creator: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  description: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  keywords: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  contributors: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  type: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  format: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  creationDate: Date;
}
