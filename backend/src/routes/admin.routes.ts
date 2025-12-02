import { Router } from 'express';
import { seedDatabase } from '../controllers/admin.controller';

const router = Router();

// ⚠️ TEMPORÁRIO: Endpoint para seed
// Remover ou proteger fortemente em produção
router.post('/seed', seedDatabase);

export default router;

