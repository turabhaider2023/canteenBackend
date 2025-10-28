import express from "express";
import dotenv from "dotenv";
dotenv.config()
import {connectToServer} from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import authRoutes from "./router/authRoutes.js";

const app = express()

app.use(express.json())

const port = process.env.PORT 

//basic health 

app.get("/",(req,res)=>{
  res.send("the server is running")
})

//routes

app.use("/api/users/",userRoutes)
app.use("/api/auth/",authRoutes)

//start server function

const startServer = async()=>{
  try {
    await connectToServer()
    app.listen(port,()=>{
      console.log("server is running at port",port)
    })
  } catch (error) {
    console.error("failed to connect to server",error.message);
    process.exit(1)
    
  }


}


