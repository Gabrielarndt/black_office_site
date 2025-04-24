/* 
   BLACK OFFICE - Script para a seção de equipe
*/

document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade de navegação da equipe
    const teamGrid = document.querySelector('.team-grid');
    const prevBtn = document.querySelector('.prev-team');
    const nextBtn = document.querySelector('.next-team');
    
    if (teamGrid && prevBtn && nextBtn) {
        // Verificar se estamos em dispositivo móvel
        const isMobile = window.innerWidth <= 768;
        
        // Configurar navegação apenas se necessário (em dispositivos móveis ou quando houver muitos membros)
        if (isMobile || teamGrid.children.length > 4) {
            prevBtn.addEventListener('click', function() {
                teamGrid.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', function() {
                teamGrid.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
            
            // Adicionar estilo para scroll horizontal em dispositivos móveis
            if (isMobile) {
                teamGrid.style.display = 'flex';
                teamGrid.style.overflowX = 'auto';
                teamGrid.style.scrollSnapType = 'x mandatory';
                teamGrid.style.scrollPadding = '0 20px';
                teamGrid.style.gap = '20px';
                
                // Ajustar cada membro da equipe
                const teamMembers = teamGrid.querySelectorAll('.team-member');
                teamMembers.forEach(member => {
                    member.style.flex = '0 0 80%';
                    member.style.scrollSnapAlign = 'center';
                });
            }
        } else {
            // Esconder botões de navegação se não forem necessários
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
    
    // Adicionar efeitos de hover para membros da equipe
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // Adicionar classe para efeito de hover
            this.classList.add('hovered');
        });
        
        member.addEventListener('mouseleave', function() {
            // Remover classe ao sair do hover
            this.classList.remove('hovered');
        });
    });
});
