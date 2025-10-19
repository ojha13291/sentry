import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT
const app = express();
const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // user routes
app.use('/api/chat', chatRoutes); // chat routes

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        connectDB();
    });