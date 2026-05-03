const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const foodLogRoutes = require('./src/routes/foodLogRoutes');
const userRoutes = require('./src/routes/userRoutes');

class App {
    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
    }

    setupMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    setupRoutes() {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/notes', noteRoutes);
        this.app.use('/api/tasks', taskRoutes);
        this.app.use('/api/food-logs', foodLogRoutes);
        this.app.use('/api/users', userRoutes);

        // Test route
        this.app.get('/', (req, res) => {
            res.json({ message: 'API is working' });
        });
    }

    getApp() {
        return this.app;
    }
}

module.exports = new App().getApp();
