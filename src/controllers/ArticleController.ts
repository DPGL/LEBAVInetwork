import { Request, Response } from "express";
import { Article } from "../entity/Article";
import { User } from "../entity/User";

export class ArticleController {

    static create = async (req: Request, res: Response) => {
        const { title } = req.body
        const payload = res.locals.payload

        try {
            const user = await User.findById(payload.id)

            const article = new Article({ title: title, author: user })
            await article.save()

            user.articles.push(article)
            await user.save()

            return res.send(article)
        } catch (e) {
            console.log(e)
            return res.status(400).send(e)
        }
    }

    static read = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            if (id) {
                const article = await Article.findById(id).populate('author')
                res.send(article)
            } else {
                const articles = await Article.find(req.query).populate('author')
                res.send(articles)
            }
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }

    static update = async (req: Request, res: Response) => {
        const { id } = req.params
    }

    static delete = async (req: Request, res: Response) => {
        const { id } = req.params
    }
}