import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js'; 
import adminRoutes from './routes/adminRoute.js';
import employeeRoutes from './routes/employeeRoute.js';
import managerRoutes from './routes/managerRoute.js';
import locationRoutes from './routes/locationRoute.js';
import authRoutes from './routes/authRoute.js';
import layerRoutes from './routes/layerRoute.js';
import userGeoLayer from './routes/userGeoLayer.js';
import cors from 'cors'; 
import { swaggerDocs, swaggerUi } from './swaggerConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://127.0.0.1:5500'],
//   credentials: true
// }));

app.use(cors());
app.use(cookieParser());


// Middleware 
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/admin', adminRoutes); 
app.use('/api/employee', employeeRoutes); 
app.use('/api/manager', managerRoutes); 
app.use('/api/location', locationRoutes); 
app.use('/api', authRoutes); 
app.use('/api/layers', layerRoutes);
app.use('/api/usergeolayer', userGeoLayer);

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

