import sequelize from '../config/db';
import { initBank } from './Bank';
import { initReport } from './Report';

// Inicializa todos os modelos
initReport(sequelize);
initBank(sequelize);

export { sequelize };
export default sequelize;