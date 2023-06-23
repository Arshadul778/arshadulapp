import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js'
import cors from 'cors';
//n
import path from "path";

//configuration env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middelware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
//n
app.use(express.static(path.join(__dirname,"./client/build")))

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category", categoryRoutes);

//rest api 
//app.get("/",(req,res)=> {
   // res.send("<h1> Welcome to Ecomerce Apps.</h1>");
//});
// n
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});


//port 
const PORT =process.env.PORT || 8080;

//run listen 
app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`.bgCyan.white);
});