import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/tickets';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/tickets', ticketRoutes);

export default app;
