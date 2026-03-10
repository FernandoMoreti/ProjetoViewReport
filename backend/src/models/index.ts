import sequelize from '../config/db';
import { initReport } from './Report';

// Inicializa todos os modelos
initReport(sequelize);

export { sequelize };
export default sequelize;