import { Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {

    static read = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            if (id) {
                const user = await User.findById(id)
                res.send(user)
            } else {
                const users = await User.find(req.query)
                res.send(users)
            }
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }

    static wrote = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const user = await User.findById(id).populate('articles')
            res.send(user)
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }

    static delete = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            if (id) {
                const user = await User.deleteOne({ _id: id })
                if (user.deletedCount === 0) {
                    return res.send({ message: `User doesn't exists` })
                }
                res.send({ message: `User: ${id} deleted` })
            } else {
                await User.deleteMany()
                res.send({ message: `All user have been deleted` })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send({ message: `Wild error appeared` })
        }
    }
}