import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
    user?: JwtPayload
}


export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return 
    }

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
        req.user = verified;
        next();

    } catch (error) {
        console.error(`Error during token validation: ${error}`);
        res.status(400).json({ message: "Invalid token" });
    }
}