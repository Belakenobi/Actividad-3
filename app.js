const express = require('express');
const { inicializarArchivos } = require('./src/database');
const { PORT } = require('./src/config');
const errorMiddleware = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const tareasRoutes = require('./src/routes/tareasRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.use('/', authRoutes);
app.use('/tareas', tareasRoutes);

app.use(errorMiddleware);

inicializarArchivos().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
