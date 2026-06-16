import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { TicketCashflowAttributes } from '../Types/type'

export interface TicketCashflowCreationAttributes extends Optional<TicketCashflowAttributes, 'id'> {}

export class TicketCashflow extends Model<TicketCashflowAttributes, TicketCashflowCreationAttributes> implements TicketCashflowAttributes {
  declare id: number;
  declare idParceiro: number;
  declare phone: number;
  declare proposal: string;
  declare obs: string;
  declare resolved: boolean;
}

export function initTicketCashflow(sequelize: Sequelize) {
  TicketCashflow.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idParceiro: { type: DataTypes.INTEGER },
    phone: { type: DataTypes.BIGINT },
    proposal: { type: DataTypes.STRING },
    obs: { type: DataTypes.STRING },
    resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    tableName: 'tb_ticket_cashflow',
    underscored: true
  });
}