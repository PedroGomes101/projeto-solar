/**
 * Routes: User Routes
 * Define as rotas da API de usuários
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

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

module.exports = router;
