import sequelize from '../config/db';
import { Bank, initBank } from './Bank';
import { initTicketCashflow, TicketCashflow } from './Cashflow';
import { initReport, Report } from './Report';
import { initDay, Schedule } from './Schedules';
import { initTicket, Ticket } from './Ticket';

initReport(sequelize);
initBank(sequelize);
initDay(sequelize);
initTicket(sequelize)
initTicketCashflow(sequelize)

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

export { sequelize, Bank, Report, Schedule, Ticket, TicketCashflow };
export default sequelize;