// Configuração da API
const API_URL = 'http://localhost:3000/api/users';

// Elementos do DOM
const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const formMessage = document.getElementById('formMessage');
const usersMessage = document.getElementById('usersMessage');

// ==================== UTILIDADES ====================

/**
 * Exibe uma mensagem na tela
 * @param {HTMLElement} element - Elemento onde a mensagem será exibida
 * @param {string} message - Texto da mensagem
 * @param {string} type - Tipo da mensagem ('success' ou 'error')
 */
function showMessage(element, message, type) {
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => { element.innerHTML = ''; }, 5000);
}

/**
 * Limpa o formulário
 */
function clearForm() {
    userForm.reset();
}

// ==================== CRIAR USUÁRIO (POST) ====================

userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(formMessage, `✅ ${data.message || 'Usuário cadastrado com sucesso!'}`, 'success');
            clearForm();
            loadUsers();
        } else {
            showMessage(formMessage, `❌ ${data.message || 'Erro ao cadastrar usuário'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showMessage(formMessage, '❌ Erro ao conectar com o servidor.', 'error');
    }
});

// ==================== LISTAR USUÁRIOS (GET) ====================

async function loadUsers() {
    try {
        usersList.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span>Carregando usuários...</span>
            </div>
        `;

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            if (data.data && data.data.length > 0) {
                displayUsers(data.data);
                showMessage(usersMessage, `✅ ${data.count} usuário(s) encontrado(s)`, 'success');
            } else {
                usersList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-title">Nenhum usuário cadastrado</div>
                        <p class="empty-state-description">Comece adicionando um novo usuário usando o formulário acima</p>
                    </div>
                `;
            }
        } else {
            showMessage(usersMessage, `❌ ${data.message || 'Erro ao carregar usuários'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        usersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔌</div>
                <div class="empty-state-title">Erro de conexão</div>
                <p class="empty-state-description">Verifique se a API está rodando em http://localhost:3000</p>
            </div>
        `;
    }
}

/**
 * Renderiza a lista de usuários com botões de editar e excluir
 */
function displayUsers(users) {
    usersList.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-header">
                <h3>${user.name}</h3>
                <span class="user-badge">ID: ${user.id}</span>
            </div>
            <div class="user-details">
                <div class="user-detail">
                    <span class="user-detail-label">Email:</span>
                    <span>${user.email}</span>
                </div>
                <div class="user-detail">
                    <span class="user-detail-label">Idade:</span>
                    <span>${user.age !== null ? user.age + ' anos' : '—'}</span>
                </div>
            </div>
            <div class="user-actions">
                <button class="btn btn-edit" onclick="openEditModal(${user.id}, '${user.name.replace(/'/g, "\\'")}', '${user.email.replace(/'/g, "\\'")}', ${user.age})">
                    ✏️ Editar
                </button>
                <button class="btn btn-delete" onclick="openDeleteModal(${user.id}, '${user.name.replace(/'/g, "\\'")}')">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== EDITAR USUÁRIO (PUT) ====================

/**
 * Abre o modal de edição preenchido com os dados do usuário
 */
function openEditModal(id, name, email, age) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editAge').value = age || '';
    document.getElementById('editModal').classList.add('active');
}

/**
 * Fecha o modal de edição
 */
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editMessage').innerHTML = '';
}

/**
 * Envia a atualização via PUT
 */
document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const editMessage = document.getElementById('editMessage');

    const updatedData = {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        age: parseInt(document.getElementById('editAge').value)
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(editMessage, `✅ ${data.message || 'Usuário atualizado!'}`, 'success');
            setTimeout(() => {
                closeEditModal();
                loadUsers();
            }, 1000);
        } else {
            showMessage(editMessage, `❌ ${data.message || 'Erro ao atualizar'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        showMessage(editMessage, '❌ Erro ao conectar com o servidor.', 'error');
    }
});

// ==================== EXCLUIR USUÁRIO (DELETE) ====================

/**
 * Abre o modal de confirmação de exclusão
 */
function openDeleteModal(id, name) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteUserName').textContent = name;
    document.getElementById('deleteModal').classList.add('active');
}

/**
 * Fecha o modal de exclusão
 */
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
}

/**
 * Confirma e executa a exclusão via DELETE
 */
async function confirmDelete() {
    const id = document.getElementById('deleteId').value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        closeDeleteModal();

        if (response.ok) {
            showMessage(usersMessage, `✅ ${data.message || 'Usuário excluído com sucesso!'}`, 'success');
            loadUsers();
        } else {
            showMessage(usersMessage, `❌ ${data.message || 'Erro ao excluir usuário'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        closeDeleteModal();
        showMessage(usersMessage, '❌ Erro ao conectar com o servidor.', 'error');
    }
}

// ==================== FECHAR MODAIS COM ESC/CLICK FORA ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
        closeDeleteModal();
    }
});

document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') closeEditModal();
});

document.getElementById('deleteModal').addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') closeDeleteModal();
});

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
