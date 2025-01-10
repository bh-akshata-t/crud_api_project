//npm install --save sequelize ==>>to install sequelize
import express from 'express';
import { connection } from './postgres/postgres.js';
import typeRoutes from './routes/typeRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
//import cors from 'cors';
const app=express();
const PORT=8000;
app.use(express.json())
app.use('/',typeRoutes);
app.use('/',alertRoutes);
const startServer=async()=>{
    try{
        await connection();
        app.listen(PORT,()=>{
            console.log(`Server is running at PORT ${PORT}`)
        });
    }catch(error){
        console.log('failed to start the server',error);
    }
    
};
startServer();