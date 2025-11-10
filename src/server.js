import express from "express";
import dotenv from "dotenv";
dotenv.config()
import {connectToServer} from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import authRoutes from "./router/authRoutes.js";
import categoryRoutes from "./router/categoryRoutes.js";
import itemRoutes from "./router/itemRoutes.js";
import vendorRoutes from "./router/vendorRoutes.js";
import officeRoutes from "./router/officeRoutes.js";
import userOrderRoutes from "./router/userOdersRoutes.js";
import designationRoutes from "./router/designationRoutes.js";
import inventoryRoutes from "./router/inventoryRoutes.js";
import stockTransactionRoutes from "./router/stockTransactionRoutes.js"
import canteenRestockOrderRoutes from "./router/canteenRestockOrderRoutes.js"
import canteenIssueOrderRoutes from "./router/canteenIssueOrderRoutes.js";

const app = express()

app.use(express.json())

const port = process.env.PORT 

//basic health 

app.get("/",(req,res)=>{
  res.send("the server is running")
})

//routes

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/categories",categoryRoutes)
app.use("/api/items",itemRoutes)
app.use("/api/vendors",vendorRoutes)
app.use("/api/offices",officeRoutes)
app.use("/api/userOrders",userOrderRoutes)
app.use("/api/designations",designationRoutes)
app.use("/api/inventory",inventoryRoutes)
app.use("/api/stockTransactions",stockTransactionRoutes)
app.use("/api/canteenRestockOrders",canteenRestockOrderRoutes)
app.use("/api/canteenIssueOrders", canteenIssueOrderRoutes);

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

startServer()


