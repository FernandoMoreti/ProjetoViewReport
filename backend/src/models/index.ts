import sequelize from '../config/db';
import { Bank, initBank } from './Bank';
import { initReport, Report } from './Report';

// Inicializa todos os modelos
initReport(sequelize);
initBank(sequelize);

// Um bank tem varios reports
Bank.hasMany(Report, {
    foreignKey: 'bankId',
    as: 'reports'
});

// Um Report pertence a um bank
Report.belongsTo(Bank, {
    foreignKey: 'bankId',
    as: 'bank'
});

export { sequelize, Bank, Report };
export default sequelize;