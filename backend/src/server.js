import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT 
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // user routes
app.use('/api/chat', chatRoutes); // chat routes

app.use(cookieParser()); 


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); 
});