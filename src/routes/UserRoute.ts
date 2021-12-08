import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AddFriendContoller } from "../controllers/AddFriendContoller";

const router = Router();

router.get('/', UserController.read)

router.get('/list', AddFriendContoller.list)
router.delete('/list/:id', AddFriendContoller.delete)
router.get('/accept/:id', AddFriendContoller.accept)

router.get('/:id', UserController.read)

router.get('/:id/articles', UserController.wrote)

router.get('/:id/demand', AddFriendContoller.demand)

router.delete('/', UserController.delete)
router.delete('/:id', UserController.delete)

export default router;