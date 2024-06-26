import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import router from "./routes/router.js";

const app = express();

// Accept json data upto 20kb
app.use(express.json({ limit: '20kb'}))
// Encode the url
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());

// Allow specific origins to send request
app.use(cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}))


app.use('/api/v1', router)

export { app }