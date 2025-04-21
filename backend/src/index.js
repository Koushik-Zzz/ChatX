import express from "express";
import { config } from "dotenv";
import AuthRouter from './routes/auth.route.js';
import ConnectDB from "./lib/db.js";
import cookieParser from 'cookie-parser'
config()
const PORT = process.env.PORT
const app = express()

ConnectDB()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', AuthRouter)
app.use(cookieParser)
app.listen(PORT, ()=> console.log(`Server is running at ${PORT}`))