/**
 * Controller: UserController
 * Responsável por processar requisições e coordenar Model e View
 */

const User = require('../models/User');

class UserController {
    /**
     * Lista todos os usuários (GET /api/users)
     * Implementa Issue001: Listagem de Usuários
     * Retorna: name, email, age
     */
    static index(req, res) {
        try {
            const users = User.findAll();
            
            // Retorna apenas os campos solicitados: name, email, age
            const usersData = users.map(user => user.toListJSON());
            
            return res.status(200).json({
                success: true,
                message: 'Usuários listados com sucesso',
                count: usersData.length,
                data: usersData
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar usuários',
                error: error.message
            });
        }
    }

    /**
     * Exibe um usuário específico (GET /api/users/:id)
     */
    static show(req, res) {
        try {
            const { id } = req.params;
            const user = User.findById(parseInt(id));
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            
            return res.status(200).json({
                success: true,
                data: user.toPublicJSON()
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar usuário',
                error: error.message
            });
        }
    }

    /**
     * Cria um novo usuário (POST /api/users)
     * Implementa Issue002: Criação de Registro de Usuários
     */
    static store(req, res) {
        try {
            const { name, email, password, age } = req.body;
            
            // Cria o usuário utilizando o Model
            const result = User.create({
                name,
                email,
                password,
                age: age ? parseInt(age) : null
            });
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.errors.join(', '),
                    errors: result.errors
                });
            }
            
            return res.status(201).json({
                success: true,
                message: 'Usuário cadastrado com sucesso!',
                data: result.user.toPublicJSON()
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao criar usuário',
                error: error.message
            });
        }
    }

    /**
     * Atualiza um usuário (PUT /api/users/:id)
     */
    static update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, age } = req.body;
            
            const user = User.findById(parseInt(id));
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            
            // Verifica se o novo email já existe (excluindo o usuário atual)
            if (email && email !== user.email && User.emailExists(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Este email já está cadastrado'
                });
            }
            
            // Atualiza os campos
            if (name) user.name = name;
            if (email) user.email = email;
            if (age !== undefined) user.age = parseInt(age);
            
            // Valida
            const validation = user.validate();
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    message: validation.errors.join(', '),
                    errors: validation.errors
                });
            }
            
            user.save();
            
            return res.status(200).json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: user.toPublicJSON()
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar usuário',
                error: error.message
            });
        }
    }

    /**
     * Remove um usuário (DELETE /api/users/:id)
     */
    static destroy(req, res) {
        try {
            const { id } = req.params;
            const deleted = User.delete(parseInt(id));
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Usuário removido com sucesso'
            });
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno ao remover usuário',
                error: error.message
            });
        }
    }
}

module.exports = UserController;
