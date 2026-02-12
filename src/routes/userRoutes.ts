/**
 * Routes: User Routes
 * Define as rotas da API de usuários
 */

import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

// GET /api/users - Lista todos os usuários (Issue001)
router.get('/', UserController.index);

// GET /api/users/:id - Busca usuário por ID
router.get('/:id', UserController.show);

// POST /api/users - Cria novo usuário (Issue002)
router.post('/', UserController.store);

// PUT /api/users/:id - Atualiza usuário
router.put('/:id', UserController.update);

// DELETE /api/users/:id - Remove usuário
router.delete('/:id', UserController.destroy);

export default router;
