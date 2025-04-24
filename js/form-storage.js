/* 
   BLACK OFFICE - Script para conectar o formulário de contato ao sistema de armazenamento
*/

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar o formulário de contato
    const contactForm = document.getElementById('consultaForm');
    
    if (contactForm) {
        // Adicionar evento de envio
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar se o formulário é válido (já implementado no contact-form.js)
            // Aqui vamos adicionar a funcionalidade para salvar os dados
            
            // Obter valores dos campos
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const servico = document.getElementById('servico').value;
            const especificacoes = document.getElementById('especificacoes').value.trim();
            
            // Criar objeto com os dados da consulta
            const consulta = {
                id: generateUniqueId(),
                date: new Date().toISOString(),
                name: nome,
                email: email,
                phone: telefone,
                service: getServiceName(servico),
                specifications: especificacoes,
                status: 'new'
            };
            
            // Salvar consulta no localStorage (simulando um banco de dados)
            saveConsulta(consulta);
            
            // Continuar com o comportamento original do formulário
            // O feedback visual para o usuário já está implementado no contact-form.js
        });
    }
    
    // Função para gerar ID único
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
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
    
    // Função para salvar consulta no localStorage
    function saveConsulta(consulta) {
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
        
        console.log('Consulta salva com sucesso:', consulta);
    }
});
