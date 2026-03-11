import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface BankAttributes {
  id: number;
  name: string;
}

export interface BankCreationAttributes extends Optional<BankAttributes, 'id'> {}

export class Bank extends Model<BankAttributes, BankCreationAttributes> implements BankAttributes {
  public id!: number;
  public name!: string;
}

export function initBank(sequelize: Sequelize) {
  Bank.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    tableName: 'tb_bank'
  });
}