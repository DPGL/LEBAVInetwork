import { Request, Response } from "express";
import { User } from "../entity/User";
import { v4 as randomUUID } from 'uuid'
import jwt from 'jsonwebtoken'

export class AuthController {

    static authenticated = async (req: Request, res: Response) => {
        try {
            const cookie = req.cookies['access_token']
            const claims = jwt.verify(cookie, process.env.JWT_SECRET) as any

            if (!claims) {
                return res.status(401).send({ message: `Unauthenticated` })
            }

            const user = await User.findOne(claims.id)
            res.send(user)
        } catch (e) {
            res.status(401).send({ message: `Can't find token` })
        }
    }

    static register = async (req: Request, res: Response) => {

        try {
            const user = new User(req.body)

            const result = await user.save()
            return res.send(result)
        } catch (e) {
            console.log(e)
            return res.status(400).send(e.message)
        }
    }

    static login = async (req: Request, res: Response) => {
        const { pseudo, password } = req.body

        const user = await User.findOne({ pseudo })

        if (!user) {
            return res.status(400).send({ message: "Invalid pseudo" })
        }

        user.comparePassword(password, (error: Error, match: boolean) => {
            if (error) throw error

            if (!match) {
                return res.status(400).send({ message: "Invalid credentials" })
            }

            const uid = randomUUID();

            const token = jwt.sign(
                { id: user._id, uid },
                process.env.JWT_SECRET, {
                expiresIn: '1d'
            })

            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: true
            })

            return res.send({ user, uid })
        })
    }

    static logout = async (req: Request, res: Response) => {
        res.cookie('access_token', '', { maxAge: 0 })
        res.send({ message: 'success ' })
    }
}