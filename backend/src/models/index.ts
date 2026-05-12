import sequelize from '../config/db';
import { Bank, initBank } from './Bank';
import { initReport, Report } from './Report';
import { initDay, Schedule } from './Schedules';
import { initTicket, Ticket } from './Ticket';

initReport(sequelize);
initBank(sequelize);
initDay(sequelize);
initTicket(sequelize)

Bank.hasMany(Report, {
    foreignKey: 'bankId',
    as: 'reports'
});

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

export { sequelize, Bank, Report, Schedule, Ticket };
export default sequelize;