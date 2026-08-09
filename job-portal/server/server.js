import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import mongoose from 'mongoose'
import JobApplication from './models/JobApplication.js'

const app = express()

// Connect first
// await connectDB()
// await connectCloudinary()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => res.send("API Working"))

app.post('/webhooks', clerkWebhooks)

app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Debug database
app.get('/debug-db', (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        state:
            mongoose.connection.readyState === 0 ? 'disconnected' :
            mongoose.connection.readyState === 1 ? 'connected' :
            mongoose.connection.readyState === 2 ? 'connecting' :
            mongoose.connection.readyState === 3 ? 'disconnecting' :
            'unknown',
        database: mongoose.connection.name,
        host: mongoose.connection.host
    })
})

// 
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.get('/debug-db', (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        state:
            mongoose.connection.readyState === 0 ? 'disconnected' :
            mongoose.connection.readyState === 1 ? 'connected' :
            mongoose.connection.readyState === 2 ? 'connecting' :
            mongoose.connection.readyState === 3 ? 'disconnecting' :
            'unknown',
        database: mongoose.connection.name,
        host: mongoose.connection.host
    })
})

const startServer = async () => {
    try {
        const dbConnected = await connectDB();

        if (!dbConnected) {
            console.error("Server not started because MongoDB connection failed.");
            process.exit(1);
        }

        await connectCloudinary();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

app.get('/debug-applications', async (req, res) => {
    try {
        const applications = await JobApplication.find({})

        res.json({
            success: true,
            count: applications.length,
            applications
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
})

startServer();