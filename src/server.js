import {connectToServer} from "./config/db.js"
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config()
import userRoutes from "./router/userRoutes.js"

const port=process.env.PORT||5000


app.use(express.json());
// router attach

app.use("/api/users",userRoutes)

const startServer = async()=>{
    await connectToServer()
    app.listen(port,()=>{
        console.log(`you have successfully connected to the server at port ${port}`)

    })
}

startServer()

