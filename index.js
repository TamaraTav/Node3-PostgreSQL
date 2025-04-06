import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import pool from "./config/db.config.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

//Middleware
app.use(express.json());

//Routes
app.get('/', (req, res) => {
    res.json({message:'Welcome to the Express PostgreSQL API'});
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);    /////იუზერებისთვის

//Error handling middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({message: "Something went wrong!"});
});

//Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
