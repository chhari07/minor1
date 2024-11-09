
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());          // Enable CORS for all routes

// Serve static files for generated images
app.use('/dataset/generated_images', express.static(path.resolve('dataset/generated_images')));

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Import routes
import dalleRoutes from './routes/dalleRoutes.js';
import postRoutes from './routes/postRoutes.js';
import vaeRoutes from './routes/vaeRoutes.js';

// API Routes
app.use('/api/dalle', dalleRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/vae', vaeRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the VAE and DALL·E API server!');
});

// Error handling middleware (for catching errors)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
});

// Start the server and connect to MongoDB
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
