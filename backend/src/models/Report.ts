import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

interface ReportAttributes {
  id: number;
  filename: string;
  dateOfReport: string;
  received: boolean;
  processed: boolean;
  processedAt: Date | null;
}

export interface ReportCreationAttributes extends Optional<ReportAttributes, 'id'> {}

export class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number;
  public filename!: string;
  public dateOfReport!: string;
  public received!: boolean;
  public processed!: boolean;
  public processedAt!: Date | null;
}

export function initReport(sequelize: Sequelize) {
  Report.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    dateOfReport: { type: DataTypes.DATEONLY, allowNull: false },
    received: { type: DataTypes.BOOLEAN, defaultValue: false },
    processed: { type: DataTypes.BOOLEAN, defaultValue: false },
    processedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    sequelize,
    tableName: 'tb_reports'
  });
}