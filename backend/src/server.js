import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT 
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Example for user routes

app.use(cookieParser()); // Middleware to parse cookies


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Connect to the database
});