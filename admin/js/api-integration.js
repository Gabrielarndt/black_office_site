// Arquivo de integração com a API
const API_URL = 'http://localhost:3000/api';

// Função para login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Incluir cookies (JWT)
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao fazer login: ' + error.message);
  }
}

// Função para verificar autenticação
async function checkAuth() {
  try {
    const response = await fetch(`${API_URL}/auth/check`, {
      method: 'GET',
      credentials: 'include' // Incluir cookies (JWT)
    });

    if (!response.ok) {
      throw new Error('Não autenticado');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro de autenticação: ' + error.message);
  }
}

// Função para buscar consultas com paginação e filtro
async function fetchConsultas(page = 1, status = 'all') {
    try {
      const response = await fetch(`${API_URL}/consultas?page=${page}&status=${status}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        // Remova credentials: 'include' e Authorization
      });
  
      if (!response.ok) {
        throw new Error('Falha ao buscar consultas');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      throw error;
    }
  }

// Função para buscar detalhes de uma consulta
async function getConsultaDetails(id) {
  try {
    const response = await fetch(`${API_URL}/consultas/${id}`, {
      method: 'GET',
      credentials: 'include' // Incluir cookies (JWT)
    });

    if (!response.ok) {
      throw new Error('Consulta não encontrada');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao buscar detalhes: ' + error.message);
  }
}

// Função para atualizar status de consulta
async function updateConsultaStatus(id, status) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/consultas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = 'login.html';
          return;
        }
        throw new Error('Falha ao atualizar status');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

// Função para excluir consulta
async function deleteConsulta(id) {
  try {
    const response = await fetch(`${API_URL}/consultas/${id}`, {
      method: 'DELETE',
      credentials: 'include' // Incluir cookies (JWT)
    });

    if (!response.ok) {
      throw new Error('Falha ao excluir consulta');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao excluir consulta: ' + error.message);
  }
}

// Função para logout
async function logout() {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Incluir cookies (JWT)
    });

    if (!response.ok) {
      throw new Error('Falha ao fazer logout');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Erro ao fazer logout: ' + error.message);
  }
}

// Exportar todas as funções para o escopo global
window.login = login;
window.checkAuth = checkAuth;
window.fetchConsultas = fetchConsultas;
window.getConsultaDetails = getConsultaDetails;
window.updateConsultaStatus = updateConsultaStatus;
window.deleteConsulta = deleteConsulta;
window.logout = logout;