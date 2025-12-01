import { Router } from 'express';
import analysisController from '../controllers/analysisController';

const router = Router();

router.post('/analyze', analysisController.analyze);
router.get('/history', analysisController.getHistory);
router.get('/analysis/:id', analysisController.getById);

export default router;
