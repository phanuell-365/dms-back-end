import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class DocumentFile extends Model {
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
  mimetype: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  newFilename: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  originalFilename: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  size: number;
}
