import { Router } from "express";
import AuthRoute from './AuthRoutes'
import UserRoute from './UserRoute'
import ArticleRoute from './ArticleRoute'
import { checkToken } from "../middlewares/checkToken";
import { checkRole } from "../middlewares/checkRole";

const root = Router()

root.use('/', AuthRoute)
root.use('/users', checkToken, UserRoute)
root.use('/articles', checkToken, ArticleRoute)

export default root