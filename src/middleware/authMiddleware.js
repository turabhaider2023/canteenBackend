import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export const verifyToken = async(req,res,next)=>{
    try {
        const authHeader=req.headers.authorization||req.headers.Authorization;
        if(!authHeader?.startsWith("Bearer ")){
            return res.status(401).json({message:"Token is required"})
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded


        next()



    } catch (error) {
        console.error("access token verification failed ",error.message);
        return res.status(403).json({message:"invalid token"})

        
    }
}