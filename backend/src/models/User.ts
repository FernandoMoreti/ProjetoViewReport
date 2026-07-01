import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  role: "COMMISSION" | "CONTROLADORIA" | "CONTESTAÇÃO" | "ADMIN";
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: "COMMISSION" | "CONTROLADORIA" | "CONTESTAÇÃO" | "ADMIN";
}

export function initUser(sequelize: Sequelize) {
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    tableName: 'tb_user',
    underscored: true
  });
}