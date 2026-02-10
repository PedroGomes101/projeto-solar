// Configuração da API
const API_URL = 'http://localhost:3000/api/users';

// Elementos do DOM
const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const formMessage = document.getElementById('formMessage');
const usersMessage = document.getElementById('usersMessage');

/**
 * Exibe uma mensagem na tela
 * @param {HTMLElement} element - Elemento onde a mensagem será exibida
 * @param {string} message - Texto da mensagem
 * @param {string} type - Tipo da mensagem ('success' ou 'error')
 */
function showMessage(element, message, type) {
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}

/**
 * Limpa o formulário
 */
function clearForm() {
    userForm.reset();
}

/**
 * Captura o envio do formulário e envia os dados via POST
 */
userForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    
    // Captura os dados do formulário
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value)
    };
    
    try {
        // Envia os dados via fetch com método POST
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(formMessage, `✅ ${data.message || 'Usuário cadastrado com sucesso!'}`, 'success');
            clearForm();
            // Atualiza a lista de usuários
            loadUsers();
        } else {
            showMessage(formMessage, `❌ ${data.message || 'Erro ao cadastrar usuário'}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showMessage(formMessage, '❌ Erro ao conectar com o servidor. Verifique se a API está rodando.', 'error');
    }
});

/**
 * Carrega e exibe a lista de usuários usando fetch com método GET
 */
async function loadUsers() {
    try {
        // Exibe estado de carregamento
        usersList.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span>Carregando usuários...</span>
            </div>
        `;
        
        // Busca os usuários via fetch com método GET
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Verifica se há usuários
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
            usersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-title">Erro ao carregar usuários</div>
                    <p class="empty-state-description">${data.message || 'Tente novamente mais tarde'}</p>
                </div>
            `;
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
        showMessage(usersMessage, '❌ Erro ao conectar com o servidor. Verifique se a API está rodando.', 'error');
    }
}

/**
 * Renderiza a lista de usuários na tela
 * @param {Array} users - Array de usuários
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
                    <span>${user.age} anos</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Carrega os usuários quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
