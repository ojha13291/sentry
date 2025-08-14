import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT 
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('api/auth', authRoutes);
// app.get('/api/auth/login', (req, res) => {
//     res.send('Login endpoint');
// });

// app.get('/api/auth/signup', (req, res) => {
//     res.send('signup endpoint');
// });

// app.get('/api/auth/logout', (req, res) => {
//     res.send('Logout endpoint');
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});