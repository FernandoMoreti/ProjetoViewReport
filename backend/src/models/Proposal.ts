import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { ProposalAttriibutes } from '../Types/type'

export interface ProposalCreationAttributes extends Optional<ProposalAttriibutes, 'id'> {}

export class Proposal extends Model<ProposalAttriibutes, ProposalCreationAttributes> implements ProposalAttriibutes {
  public id!: number;
  public bank!: string;
  public proposal!: string;
  public date!: string;
  public typeCommission!: string;
  public valBase!: number;
  public valCommission!: number;
  public pclCommission!: number;
  public duplicate!: boolean;
}

export function initProposal(sequelize: Sequelize) {
  Proposal.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bank: { type: DataTypes.STRING, allowNull: false },
    proposal: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    typeCommission: { type: DataTypes.STRING, allowNull: false },
    valBase: { type: DataTypes.FLOAT, allowNull: false },
    valCommission: { type: DataTypes.FLOAT, allowNull: false },
    pclCommission: { type: DataTypes.FLOAT, allowNull: false },
    duplicate: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    tableName: 'tb_proposal',
    underscored: true
  });
}