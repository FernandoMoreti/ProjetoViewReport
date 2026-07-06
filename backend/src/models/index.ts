import sequelize from '../config/db';
import { Bank, BankContestacao, initBank } from './Bank';
import { initTicketCashflow, TicketCashflow } from './Cashflow';
import { initReport, Report } from './Report';
import { initDay, Schedule } from './Schedules';
import { initTicket, Ticket } from './Ticket';
import { initProposal, Proposal } from './Proposal';
import { initUser, User } from './User';
import { initNotification, Notification } from './Notification';

initReport(sequelize);
initBank(sequelize);
initDay(sequelize);
initTicket(sequelize)
initNotification(sequelize)
initTicketCashflow(sequelize)
initProposal(sequelize)
initUser(sequelize);

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

export { sequelize, Bank, Report, Schedule, Ticket, TicketCashflow, User, Proposal, Notification, BankContestacao };
export default sequelize;