import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import pool from "./config/db.config.js";
import userRoutes from "./routes/userRoutes.js";
import {AppError, handleError} from "./utils/errorhandler.js";
import cors from "cors";
import * as https from "node:https";

const app = express();
const port = process.env.PORT || 4000;

//Middleware
app.use(express.json());


//დავაყენე cors. ამით სერერზე შემოდის მხოლოდ ის, ვისაც ქვემოთ გავუწერთ და შეძ₾ებს ამ მეთოდების გამოყენებას
const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(','),  //env-ში მიწერია ამათი მისამართი, იხილეთ იქ
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    //თუ მინდა ყველაფრიდან გამოიგზავნოს, მაშინ origin: '*',
}
app.use(cors(corsOptions));

app.use('/uploads', express.static("./uploads"));  // კლიენტმა რომ შეძლოს მისწვდეს ფოტოს
                                     //http://localhost:4000/uploads/1746324312431-182757769.jpg


//Routes
app.get('/', (req, res) => {
    res.json({message:'Welcome to the Express PostgreSQL API'});
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);    /////იუზერებისთვის

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use(handleError);

//Error handling middleware
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     res.status(500).json({message: "Something went wrong!"});
// });

//Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
