import { Router } from "express";
import { ArticleController } from "../controllers/ArticleController";

const router = Router();

router.post('/', ArticleController.create)

router.get('/', ArticleController.read)
router.get('/:id', ArticleController.read)

router.put('/', ArticleController.update)
router.put('/:id', ArticleController.update)

router.delete('/', ArticleController.delete)
router.delete('/:id', ArticleController.delete)

export default router;