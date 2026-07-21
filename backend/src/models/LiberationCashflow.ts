import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface LiberationCashflowAttributes {
  id: number;
  agent: string;
  obs: string;
  resolved: boolean;
  phone: string;
}

export interface LiberationCashflowCreationAttributes extends Optional<LiberationCashflowAttributes, 'id'> {}

export class LiberationCashflow extends Model<LiberationCashflowAttributes, LiberationCashflowCreationAttributes> implements LiberationCashflowAttributes {
  public id!: number;
  public agent!: string;
  public obs!: string;
  public resolved!: boolean;
  public phone!: string;
}
export function initLiberationCashflow(sequelize: Sequelize) {
  LiberationCashflow.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    agent: { type: DataTypes.STRING, allowNull: false },
    obs: { type: DataTypes.STRING, allowNull: true },
    resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    phone: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  }, {
    sequelize,
    tableName: 'tb_liberation_cashflow',
    underscored: true
  })
}