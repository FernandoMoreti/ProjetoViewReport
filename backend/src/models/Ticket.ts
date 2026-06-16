import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { TicketAtt } from '../Types/type'

export interface TicketCreationAttributes extends Optional<TicketAtt, 'id'> {}

export class Ticket extends Model<TicketAtt, TicketCreationAttributes> implements TicketAtt {
  public id!: number;
  public bank!: string;
  public dateOfTicket!: string;
  public about!: string;
  public numTicket!: string;
  public resolved!: boolean;
}

export function initTicket(sequelize: Sequelize) {
  Ticket.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bank: { type: DataTypes.STRING, allowNull: false },
    dateOfTicket: { type: DataTypes.DATEONLY, allowNull: false, unique: false },
    about: { type: DataTypes.STRING },
    numTicket: { type: DataTypes.STRING },
    resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    tableName: 'tb_ticket',
    underscored: true
  });
}