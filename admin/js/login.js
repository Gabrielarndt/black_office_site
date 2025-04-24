/* 
   BLACK OFFICE - Script simplificado para autenticação na área administrativa
*/

document.addEventListener('DOMContentLoaded', function() {
    // Configurações de autenticação
    const validCredentials = {
        email: "eliseugularte898@gmail.com",
        password: "MtDalenha2048@@"
    };

    // Selecionar elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    // Verificar se já existe uma sessão ativa
    const sessionData = localStorage.getItem('blackOfficeAdminSession');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            if (session.isAdmin) {
                window.location.href = 'dashboard.html';
                return;
            }
        } catch (error) {
            // Ignorar erro e continuar com o login
            localStorage.removeItem('blackOfficeAdminSession');
        }
    }

    // Processar envio do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpar mensagem de erro anterior
            if (loginError) {
                loginError.textContent = '';
            }
            
            // Obter valores dos campos
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            console.log('Tentativa de login:', email);
            console.log('Credencial esperada:', validCredentials.email);
            
            // Validar credenciais
            if (email === validCredentials.email && password === validCredentials.password) {
                console.log('Login bem-sucedido');
                
                // Credenciais válidas - criar sessão
                const sessionData = {
                    email: email,
                    isAdmin: true,
                    loginTime: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
                };
                
                // Salvar sessão no localStorage
                localStorage.setItem('blackOfficeAdminSession', JSON.stringify(sessionData));
                
                // Redirecionar para o dashboard
                window.location.href = 'dashboard.html';
            } else {
                console.log('Login falhou');
                
                // Credenciais inválidas - mostrar erro
                if (loginError) {
                    loginError.textContent = 'Email ou senha incorretos. Por favor, tente novamente.';
                } else {
                    alert('Email ou senha incorretos. Por favor, tente novamente.');
                }
                
                // Animação de shake no formulário
                if (loginForm.classList) {
                    loginForm.classList.add('shake');
                    setTimeout(() => {
                        loginForm.classList.remove('shake');
                    }, 500);
                }
            }
        });
    }
});
