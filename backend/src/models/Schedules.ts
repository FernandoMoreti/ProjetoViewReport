import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface ScheduleAttributes {
  id: number;
  bankId: number;
  dayOfWeek: string;
  time: string;
}

export interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
  public id!: number;
  public bankId!: number;
  public dayOfWeek!: string;
  public time!: string;
}

export function initDay(sequelize: Sequelize) {
  Schedule.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bankId: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'tb_bank',
        key: 'id'
    }},
    dayOfWeek: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    tableName: 'tb_schedule',
    underscored: true
  });
}