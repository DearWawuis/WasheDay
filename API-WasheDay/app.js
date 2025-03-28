import express from 'express';
import washosRoutes from './src/routes/washos.routes';
import washersRoutes from './src/routes/washers.routes';
import authRoutes from './src/routes/auth.routes';
import orderServiceRoutes from './src/routes/orderService.routes';
import { createRoles } from './src/libs/initialSetup';

const app = express();
const cors = require('cors');
// Middleware para parsear cuerpos de solicitud como JSON
app.use(express.json());

// Middleware para habilitar CORS (si es necesario)
app.use(cors());

// Ejecutar función para crear roles y divisiones
createRoles();

app.use(express.json());
app.use('/washos', washosRoutes);
app.use('/washers', washersRoutes);
app.use('/api/auth', authRoutes);
app.use('/orderService', orderServiceRoutes);

// Ruta para servir la SPA
app.get('/', (req, res) => {
    res.send('Bienvenido a mi API');
});

export default app;
