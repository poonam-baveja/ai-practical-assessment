import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/tickets';
import commentRoutes from './routes/comments';
import userRoutes from './routes/users';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets/:id/comments', commentRoutes);
app.use('/api/users', userRoutes);

export default app;
