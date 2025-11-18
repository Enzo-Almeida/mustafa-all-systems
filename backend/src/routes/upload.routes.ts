import { Router } from 'express';
import { getPresignedUrl } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/photo', getPresignedUrl);

export default router;

