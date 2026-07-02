import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { NotificationAtt } from '../Types/type'

export interface NotificationCreationAttributes extends Optional<NotificationAtt, 'id'> {}

export class Notification extends Model<NotificationAtt, NotificationCreationAttributes> implements NotificationAtt {
  public id!: number;
  public bank!: string;
  public date!: string;
  public notificated!: boolean;
  public received!: boolean;
  public notReceived!: boolean;
  public obs!: string;
  public automatication!: boolean;
}

export function initNotification(sequelize: Sequelize) {
  Notification.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bank: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false, unique: false },
    notificated: { type: DataTypes.BOOLEAN, defaultValue: false },
    received: { type: DataTypes.BOOLEAN, defaultValue: false },
    notReceived: { type: DataTypes.BOOLEAN, defaultValue: false },
    obs: { type: DataTypes.STRING },
    automatication: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    tableName: 'tb_notification',
    underscored: true
  });
}