import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config()

const uri = process.env.MONGODB_URI
const client=new MongoClient(uri)

let database;

export const connectToServer = async()=>{
    try {
        const DB=await client.connect()
        database=DB.db("users")
        console.log("successfully connected to the database")
    } catch (error) {
        console.error("not able to connect to database")
        process.exit(1)
        
    }

}

export const getDB = ()=>{
    if(!database) throw new Error("Not connected to mongoDB database")
    return database
}