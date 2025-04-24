/* 
   BLACK OFFICE - Script para autenticação e proteção de rotas
*/

// Função para verificar autenticação em todas as páginas administrativas
function checkAuthentication() {
    // Verificar se estamos em uma página administrativa
    const isAdminPage = window.location.pathname.includes('/admin/');
    const isLoginPage = window.location.pathname.includes('/admin/login.html');
    
    // Se não estamos em uma página administrativa, não fazer nada
    if (!isAdminPage) {
        return;
    }
    
    // Obter dados da sessão
    const sessionData = localStorage.getItem('blackOfficeAdminSession');
    
    // Se estamos na página de login
    if (isLoginPage) {
        // Se já existe uma sessão válida, redirecionar para o dashboard
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date();
                const expiresAt = new Date(session.expiresAt);
                
                if (now < expiresAt && session.isAdmin) {
                    window.location.href = 'dashboard.html';
                } else {
                    // Sessão expirada, remover
                    localStorage.removeItem('blackOfficeAdminSession');
                }
            } catch (error) {
                // Erro ao processar sessão, remover
                localStorage.removeItem('blackOfficeAdminSession');
            }
        }
        return;
    }
    
    // Se não estamos na página de login, verificar se existe uma sessão válida
    if (!sessionData) {
        // Não existe sessão, redirecionar para login
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const session = JSON.parse(sessionData);
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        // Verificar se a sessão ainda é válida
        if (now >= expiresAt || !session.isAdmin) {
            // Sessão expirada ou não é admin, redirecionar para login
            localStorage.removeItem('blackOfficeAdminSession');
            window.location.href = 'login.html';
        }
    } catch (error) {
        // Erro ao processar sessão, redirecionar para login
        localStorage.removeItem('blackOfficeAdminSession');
        window.location.href = 'login.html';
    }
}

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', checkAuthentication);

// Função para fazer login
function login(email, password) {
    // Credenciais válidas (em um cenário real, isso seria verificado no servidor)
    const validCredentials = {
        email: "admin@blackoffice.com",
        password: "blackOffice007"
    };
    
    // Verificar credenciais
    if (email === validCredentials.email && password === validCredentials.password) {
        // Credenciais válidas, criar sessão
        const sessionData = {
            email: email,
            isAdmin: true,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };
        
        // Salvar sessão no localStorage
        localStorage.setItem('blackOfficeAdminSession', JSON.stringify(sessionData));
        
        return true;
    }
    
    return false;
}

// Função para fazer logout
function logout() {
    // Remover sessão
    localStorage.removeItem('blackOfficeAdminSession');
    
    // Redirecionar para login
    window.location.href = 'login.html';
}

// Exportar funções para uso em outros scripts
window.authSystem = {
    checkAuthentication,
    login,
    logout
};
