import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const payload = res.locals.payload
        try {
            const user = await User.findById(payload.id)
            if (roles.indexOf(user.role) > -1) next();
            else res.status(401).send({ message: `Permission not granted` })
        } catch (error) {
            console.log(error)
            res.status(401).send({ message: `User doesn't exist anymore` })
        }
    }
}