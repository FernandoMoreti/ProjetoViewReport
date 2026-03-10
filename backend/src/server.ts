import app from './app';

import sequelize from './models';

const PORT = process.env.PORT || 3003;

sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`🚀 Server on in: http://localhost:${PORT}`);
    });
});