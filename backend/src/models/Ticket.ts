import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface TicketAttributes {
  id: number;
  bank: string;
  dateOfTicket: string;
  about: string;
  numTicket: string;
  resolved: boolean;
}

export interface TicketCreationAttributes extends Optional<TicketAttributes, 'id'> {}

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
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