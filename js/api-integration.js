// Arquivo para integrar o formulário de contato com a API backend

document.addEventListener('DOMContentLoaded', function() {
    // URL base da API
    const API_URL = 'https://black-office-site-1.onrender.com/api';
    
    // Selecionar o formulário de contato
    const contactForm = document.getElementById('consultaForm');
    
    if (contactForm) {
        // Adicionar evento de envio
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obter valores dos campos
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const servico = document.getElementById('servico').value;
            const especificacoes = document.getElementById('especificacoes').value.trim();
            
            // Mostrar mensagem de carregamento
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Enviar dados para a API
                const response = await fetch(`${API_URL}/consultas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nome,
                        email: email,
                        phone: telefone,
                        service: getServiceName(servico),
                        specifications: especificacoes
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao enviar consulta');
                }
                
                // Limpar formulário
                contactForm.reset();
                
                // Mostrar mensagem de sucesso
                const formContainer = contactForm.closest('.contact-form-container');
                formContainer.classList.add('success');
                formContainer.querySelector('.success-message').style.display = 'block';
                formContainer.querySelector('.form-container').style.display = 'none';
                
                // Também salvar no localStorage para compatibilidade com a versão anterior
                saveConsultaToLocalStorage({
                    id: data.consulta.id,
                    date: new Date().toISOString(),
                    name: nome,
                    email: email,
                    phone: telefone,
                    service: getServiceName(servico),
                    specifications: especificacoes,
                    status: 'new'
                });
                
            } catch (error) {
                console.error('Erro ao enviar consulta:', error);
                
                // Mostrar mensagem de erro
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = error.message || 'Ocorreu um erro ao enviar sua consulta. Por favor, tente novamente.';
                
                const formControls = contactForm.querySelector('.form-controls');
                formControls.insertBefore(errorElement, formControls.firstChild);
                
                // Remover mensagem de erro após 5 segundos
                setTimeout(() => {
                    errorElement.remove();
                }, 5000);
            } finally {
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
    
    // Função para obter o nome do serviço a partir do valor do select
    function getServiceName(value) {
        const serviceMap = {
            'trafego': 'Gestão de Tráfego',
            'design': 'Design Gráfico',
            'copywriting': 'CopyWriting',
            'programacao': 'Programação Web',
            'video': 'Edição de Vídeo',
            'lancamento': 'Lançamentos de Alta Performance',
            'social': 'Social Mídia'
        };
        
        return serviceMap[value] || 'Serviço não especificado';
    }
    
    // Função para salvar consulta no localStorage (para compatibilidade)
    function saveConsultaToLocalStorage(consulta) {
        // Obter consultas existentes
        let consultas = [];
        const storedConsultas = localStorage.getItem('blackOfficeConsultas');
        
        if (storedConsultas) {
            try {
                consultas = JSON.parse(storedConsultas);
            } catch (error) {
                console.error('Erro ao processar consultas armazenadas:', error);
                consultas = [];
            }
        }
        
        // Adicionar nova consulta
        consultas.push(consulta);
        
        // Salvar no localStorage
        localStorage.setItem('blackOfficeConsultas', JSON.stringify(consultas));
    }
});
