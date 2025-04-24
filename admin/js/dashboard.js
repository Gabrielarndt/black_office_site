/* 
   BLACK OFFICE - Script para o painel administrativo
*/

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    checkAuth();
    
    // Elementos do DOM
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const statusFilter = document.getElementById('statusFilter');
    const consultasTableBody = document.getElementById('consultasTableBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');
    const consultaModal = document.getElementById('consultaModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const consultaDetail = document.getElementById('consultaDetail');
    
    // Variáveis de estado
    let consultas = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let currentFilter = 'all';
    let currentConsulta = null;
    
    // Dados de exemplo para demonstração
    const mockConsultas = [
        {
            id: 1,
            date: '2025-04-19T10:30:00',
            name: 'João Silva',
            email: 'joao.silva@exemplo.com',
            phone: '(11) 98765-4321',
            service: 'Gestão de Tráfego',
            specifications: 'Preciso aumentar o tráfego para meu e-commerce de produtos naturais. Atualmente tenho cerca de 1000 visitas por mês e gostaria de triplicar esse número.',
            status: 'new'
        },
        {
            id: 2,
            date: '2025-04-18T14:15:00',
            name: 'Maria Oliveira',
            email: 'maria.oliveira@exemplo.com',
            phone: '(21) 97654-3210',
            service: 'Design Gráfico',
            specifications: 'Estou precisando de uma identidade visual completa para minha nova empresa de consultoria financeira.',
            status: 'in-progress'
        },
        {
            id: 3,
            date: '2025-04-17T09:45:00',
            name: 'Pedro Santos',
            email: 'pedro.santos@exemplo.com',
            phone: '(31) 96543-2109',
            service: 'CopyWriting',
            specifications: 'Preciso de textos persuasivos para minha landing page de venda de curso online sobre marketing digital.',
            status: 'completed'
        },
        {
            id: 4,
            date: '2025-04-16T16:20:00',
            name: 'Ana Costa',
            email: 'ana.costa@exemplo.com',
            phone: '(41) 95432-1098',
            service: 'Programação Web',
            specifications: 'Gostaria de um site institucional para minha clínica médica, com sistema de agendamento online.',
            status: 'new'
        },
        {
            id: 5,
            date: '2025-04-15T11:10:00',
            name: 'Carlos Ferreira',
            email: 'carlos.ferreira@exemplo.com',
            phone: '(51) 94321-0987',
            service: 'Edição de Vídeo',
            specifications: 'Preciso de edição profissional para 10 vídeos de 15 minutos cada para meu canal do YouTube sobre tecnologia.',
            status: 'in-progress'
        }
    ];
    
    // Inicializar dados
    consultas = mockConsultas;
    
    // Event Listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadConsultas);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportConsultas);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilter = this.value;
            currentPage = 1;
            renderConsultas();
        });
    }
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderConsultas();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const filteredConsultas = filterConsultas();
            const totalPages = Math.ceil(filteredConsultas.length / itemsPerPage);
            
            if (currentPage < totalPages) {
                currentPage++;
                renderConsultas();
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            consultaModal.classList.remove('show');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            consultaModal.classList.remove('show');
        });
    }
    
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', updateConsultaStatus);
    }
    
    // Carregar consultas iniciais
    loadConsultas();
    
    // Funções
    function checkAuth() {
        const sessionData = localStorage.getItem('blackOfficeAdminSession');
        
        if (!sessionData) {
            // Não autenticado - redirecionar para login
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            // Verificar se a sessão ainda é válida
            if (now >= expiresAt || !session.isAdmin) {
                // Sessão expirada ou não é admin - redirecionar para login
                localStorage.removeItem('blackOfficeAdminSession');
                window.location.href = 'login.html';
            }
        } catch (error) {
            // Erro ao processar sessão - redirecionar para login
            localStorage.removeItem('blackOfficeAdminSession');
            window.location.href = 'login.html';
        }
    }
    
    function logout() {
        // Remover sessão e redirecionar para login
        localStorage.removeItem('blackOfficeAdminSession');
        window.location.href = 'login.html';
    }
    
    function loadConsultas() {
        // Simular carregamento
        consultasTableBody.innerHTML = '<tr><td colspan="6" class="loading-message">Carregando consultas...</td></tr>';
        
        // Carregar consultas do localStorage
        const storedConsultas = localStorage.getItem('blackOfficeConsultas');
        
        if (storedConsultas) {
            try {
                // Substituir os dados mockados pelos dados reais
                consultas = JSON.parse(storedConsultas);
            } catch (error) {
                console.error('Erro ao processar consultas armazenadas:', error);
                // Manter os dados mockados em caso de erro
            }
        }
        
        // Simular delay de rede
        setTimeout(() => {
            renderConsultas();
        }, 500);
    }
    
    function filterConsultas() {
        // Filtrar consultas pelo status selecionado
        if (currentFilter === 'all') {
            return consultas;
        }
        
        return consultas.filter(consulta => consulta.status === currentFilter);
    }
    
    function renderConsultas() {
        const filteredConsultas = filterConsultas();
        const totalPages = Math.ceil(filteredConsultas.length / itemsPerPage);
        
        // Atualizar informações de paginação
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
        
        // Habilitar/desabilitar botões de paginação
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // Calcular índices para a página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageConsultas = filteredConsultas.slice(startIndex, endIndex);
        
        // Limpar tabela
        consultasTableBody.innerHTML = '';
        
        // Verificar se há consultas para exibir
        if (pageConsultas.length === 0) {
            consultasTableBody.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhuma consulta encontrada.</td></tr>';
            return;
        }
        
        // Renderizar consultas
        pageConsultas.forEach(consulta => {
            const row = document.createElement('tr');
            
            // Formatar data
            const date = new Date(consulta.date);
            const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
            
            // Criar células
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${consulta.name}</td>
                <td>${consulta.email}</td>
                <td>${consulta.service}</td>
                <td>
                    <span class="status-badge status-${consulta.status}">
                        ${getStatusLabel(consulta.status)}
                    </span>
                </td>
                <td>
                    <button class="action-btn view" data-id="${consulta.id}" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" data-id="${consulta.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Adicionar à tabela
            consultasTableBody.appendChild(row);
            
            // Adicionar event listeners para os botões
            const viewBtn = row.querySelector('.view');
            const deleteBtn = row.querySelector('.delete');
            
            viewBtn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                openConsultaDetail(id);
            });
            
            deleteBtn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteConsulta(id);
            });
        });
    }
    
    function getStatusLabel(status) {
        switch (status) {
            case 'new':
                return 'Novo';
            case 'in-progress':
                return 'Em andamento';
            case 'completed':
                return 'Concluído';
            default:
                return 'Desconhecido';
        }
    }
    
    function openConsultaDetail(id) {
        // Encontrar consulta pelo ID
        currentConsulta = consultas.find(consulta => consulta.id === id);
        
        if (!currentConsulta) {
            return;
        }
        
        // Formatar data
        const date = new Date(currentConsulta.date);
        const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
        
        // Preencher detalhes
        consultaDetail.innerHTML = `
            <div class="detail-group">
                <div class="detail-label">Data da Solicitação</div>
                <div class="detail-value">${formattedDate}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Nome</div>
                <div class="detail-value">${currentConsulta.name}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Email</div>
                <div class="detail-value">${currentConsulta.email}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Telefone</div>
                <div class="detail-value">${currentConsulta.phone}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Serviço</div>
                <div class="detail-value">${currentConsulta.service}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <select id="statusSelect">
                        <option value="new" ${currentConsulta.status === 'new' ? 'selected' : ''}>Novo</option>
                        <option value="in-progress" ${currentConsulta.status === 'in-progress' ? 'selected' : ''}>Em andamento</option>
                        <option value="completed" ${currentConsulta.status === 'completed' ? 'selected' : ''}>Concluído</option>
                    </select>
                </div>
            </div>
            <div class="detail-group detail-full">
                <div class="detail-label">Especificações</div>
                <div class="detail-value">${currentConsulta.specifications}</div>
            </div>
        `;
        
        // Mostrar modal
        consultaModal.classList.add('show');
    }
    
    function updateConsultaStatus() {
        if (!currentConsulta) {
            return;
        }
        
        // Obter novo status
        const statusSelect = document.getElementById('statusSelect');
        const newStatus = statusSelect.value;
        
        // Atualizar status
        currentConsulta.status = newStatus;
        
        // Em um cenário real, aqui seria feita uma requisição AJAX para o servidor
        
        // Fechar modal
        consultaModal.classList.remove('show');
        
        // Atualizar tabela
        renderConsultas();
    }
    
    function deleteConsulta(id) {
        // Confirmar exclusão
        if (!confirm('Tem certeza que deseja excluir esta consulta?')) {
            return;
        }
        
        // Remover consulta
        consultas = consultas.filter(consulta => consulta.id !== id);
        
        // Em um cenário real, aqui seria feita uma requisição AJAX para o servidor
        
        // Atualizar tabela
        renderConsultas();
    }
    
    function exportConsultas() {
        // Filtrar consultas
        const filteredConsultas = filterConsultas();
        
        // Criar CSV
        let csv = 'Data,Nome,Email,Telefone,Serviço,Especificações,Status\n';
        
        filteredConsultas.forEach(consulta => {
            // Formatar data
            const date = new Date(consulta.date);
            const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
            
            // Escapar campos com vírgula
            const escapeCsv = (text) => {
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    return `"${text.replace(/"/g, '""')}"`;
                }
                return text;
            };
            
            // Adicionar linha
            csv += [
                formattedDate,
                escapeCsv(consulta.name),
                escapeCsv(consulta.email),
                escapeCsv(consulta.phone),
                escapeCsv(consulta.service),
                escapeCsv(consulta.specifications),
                getStatusLabel(consulta.status)
            ].join(',') + '\n';
        });
        
        // Criar blob e link para download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Configurar link
        link.setAttribute('href', url);
        link.setAttribute('download', `consultas_black_office_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        // Adicionar ao DOM, clicar e remover
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
