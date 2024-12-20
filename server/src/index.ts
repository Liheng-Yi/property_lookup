import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import propertyRoutes from './routes/property';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/property', propertyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add at the top of your server file
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Cleaning up...');
    // Add any cleanup code here
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Cleaning up...');
    // Add any cleanup code here
    process.exit(0);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 