import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5002;

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\x1b[32m%s\x1b[0m`, `[Server] Book Catalog Service running on port ${PORT}`);
    });
});