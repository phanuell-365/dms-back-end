import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Roles } from '../enum';

@Table({
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt'],
    },
  },
})
export class User extends Model {
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
  firstname: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  lastname: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  username: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: [Roles.ADMIN, Roles.PRINCIPAL, Roles.REGISTRAR, Roles.HOD],
  })
  role: Roles;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  departmentName: string;
}
