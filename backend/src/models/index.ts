import sequelize from '../config/db';
import { Bank, initBank } from './Bank';
import { initReport, Report } from './Report';
import { initDay, Schedule } from './Schedules';

initReport(sequelize);
initBank(sequelize);
initDay(sequelize);

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

Bank.hasMany(Schedule, {
    foreignKey: 'bankId',
    as: 'schedules'
});

Schedule.belongsTo(Bank, {
    foreignKey: 'bankId',
    as: 'bank'
});

export { sequelize, Bank, Report, Schedule };
export default sequelize;