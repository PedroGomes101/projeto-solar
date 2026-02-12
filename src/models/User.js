/**
 * Model: User
 * Responsável pela estrutura de dados e regras de negócio dos usuários
 */

// Armazenamento em memória (simula banco de dados)
let users = [];
let nextId = 1;

class User {
    constructor(data) {
        this.id = data.id || nextId++;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password || null;
        this.age = data.age || null;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    /**
     * Valida os dados do usuário
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validate() {
        const errors = [];

        // Validação do nome
        if (!this.name || this.name.trim() === '') {
            errors.push('O nome é obrigatório');
        } else if (this.name.trim().length < 2) {
            errors.push('O nome deve ter pelo menos 2 caracteres');
        }

        // Validação do email
        if (!this.email || this.email.trim() === '') {
            errors.push('O email é obrigatório');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                errors.push('O email deve ser válido');
            }
        }

        // Validação da idade (opcional, mas se fornecida deve ser válida)
        if (this.age !== null && this.age !== undefined) {
            if (typeof this.age !== 'number' || this.age < 0 || this.age > 150) {
                errors.push('A idade deve ser um número entre 0 e 150');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Retorna dados públicos do usuário (sem senha)
     * @returns {Object}
     */
    toPublicJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            is_active: this.is_active,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    /**
     * Retorna dados básicos para listagem (Issue001)
     * @returns {Object}
     */
    toListJSON() {
        return {
            name: this.name,
            email: this.email,
            age: this.age
        };
    }

    /**
     * Salva o usuário no "banco de dados"
     * @returns {User}
     */
    save() {
        this.updated_at = new Date().toISOString();
        
        const existingIndex = users.findIndex(u => u.id === this.id);
        if (existingIndex >= 0) {
            users[existingIndex] = this;
        } else {
            users.push(this);
        }
        
        return this;
    }

    // ==================== MÉTODOS ESTÁTICOS ====================

    /**
     * Busca todos os usuários
     * @returns {User[]}
     */
    static findAll() {
        return users.filter(u => u.is_active);
    }

    /**
     * Busca usuário por ID
     * @param {number} id
     * @returns {User|null}
     */
    static findById(id) {
        return users.find(u => u.id === id && u.is_active) || null;
    }

    /**
     * Busca usuário por email
     * @param {string} email
     * @returns {User|null}
     */
    static findByEmail(email) {
        return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.is_active) || null;
    }

    /**
     * Verifica se email já existe
     * @param {string} email
     * @returns {boolean}
     */
    static emailExists(email) {
        return users.some(u => u.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Cria um novo usuário
     * @param {Object} data
     * @returns {Object} - { success: boolean, user?: User, errors?: string[] }
     */
    static create(data) {
        const user = new User(data);
        
        // Valida os dados
        const validation = user.validate();
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        // Verifica unicidade do email
        if (User.emailExists(user.email)) {
            return { success: false, errors: ['Este email já está cadastrado'] };
        }

        // Salva o usuário
        user.save();
        
        return { success: true, user };
    }

    /**
     * Deleta um usuário (soft delete)
     * @param {number} id
     * @returns {boolean}
     */
    static delete(id) {
        const user = User.findById(id);
        if (user) {
            user.is_active = false;
            user.updated_at = new Date().toISOString();
            return true;
        }
        return false;
    }

    /**
     * Retorna a contagem de usuários ativos
     * @returns {number}
     */
    static count() {
        return users.filter(u => u.is_active).length;
    }
}

module.exports = User;
