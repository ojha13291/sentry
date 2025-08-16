import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const PORT = process.env.PORT 
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Connect to the database
});