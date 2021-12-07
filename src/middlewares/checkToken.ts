import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const cookie = req.cookies['access_token']
        const payload = jwt.verify(cookie, process.env.JWT_SECRET) as any

        if (payload.uid != req.headers.uid) {
            return res.status(401).send({ message: 'Falsified token' })
        }
        res.locals.payload = payload
    } catch (e) {
        return res.status(401).send({ message: `Invalid or expired token` })
    }

    next();
}