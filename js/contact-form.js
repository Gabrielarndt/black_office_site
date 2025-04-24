/* 
   BLACK OFFICE - Script para o formulário de contato
   Validação e funcionalidades interativas
*/

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar o formulário de contato
    const contactForm = document.getElementById('consultaForm');
    
    if (contactForm) {
        // Adicionar link para o CSS de contato no head
        const head = document.querySelector('head');
        const contactCssLink = document.createElement('link');
        contactCssLink.rel = 'stylesheet';
        contactCssLink.href = 'css/contact-form.css';
        head.appendChild(contactCssLink);
        
        // Adicionar mensagem de sucesso após o formulário
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 15px;"></i>
            <h3>Solicitação Enviada com Sucesso!</h3>
            <p>Agradecemos pelo seu interesse em nossos serviços. Nossa equipe entrará em contato com você em breve para discutir como podemos ajudar a levar seu negócio para outro patamar.</p>
        `;
        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
        
        // Adicionar contagem de caracteres para o textarea
        const textarea = document.getElementById('especificacoes');
        if (textarea) {
            const charCountDiv = document.createElement('div');
            charCountDiv.className = 'char-count';
            textarea.parentNode.appendChild(charCountDiv);
            
            textarea.addEventListener('input', function() {
                const remaining = 500 - this.value.length;
                charCountDiv.textContent = `${this.value.length}/500 caracteres`;
                
                if (remaining < 0) {
                    charCountDiv.style.color = '#ff3366';
                } else {
                    charCountDiv.style.color = 'var(--text-color-muted)';
                }
            });
            
            // Trigger inicial para mostrar a contagem
            textarea.dispatchEvent(new Event('input'));
        }
        
        // Adicionar política de privacidade
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const privacyDiv = document.createElement('div');
        privacyDiv.className = 'form-privacy';
        privacyDiv.innerHTML = 'Ao enviar este formulário, você concorda com nossa <a href="#">Política de Privacidade</a> e com o processamento de seus dados para fins de contato.';
        
        submitBtn.parentNode.insertBefore(privacyDiv, submitBtn);
        
        // Adicionar status ao botão de envio
        const formSubmitDiv = document.createElement('div');
        formSubmitDiv.className = 'form-submit';
        submitBtn.parentNode.insertBefore(formSubmitDiv, submitBtn);
        formSubmitDiv.appendChild(submitBtn);
        
        const formStatus = document.createElement('div');
        formStatus.className = 'form-status';
        formSubmitDiv.appendChild(formStatus);
        
        // Validação do formulário
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            formStatus.textContent = '';
            
            // Remover classes de erro anteriores
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('error');
            });
            
            // Validar nome
            const nome = document.getElementById('nome');
            if (nome.value.trim() === '') {
                isValid = false;
                nome.parentNode.classList.add('error');
                const errorMsg = nome.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Por favor, informe seu nome.';
                if (!nome.parentNode.querySelector('.error-message')) {
                    nome.parentNode.appendChild(errorMsg);
                }
            }
            
            // Validar email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                isValid = false;
                email.parentNode.classList.add('error');
                const errorMsg = email.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Por favor, informe um email válido.';
                if (!email.parentNode.querySelector('.error-message')) {
                    email.parentNode.appendChild(errorMsg);
                }
            }
            
            // Validar telefone
            const telefone = document.getElementById('telefone');
            if (telefone.value.trim() === '') {
                isValid = false;
                telefone.parentNode.classList.add('error');
                const errorMsg = telefone.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Por favor, informe seu telefone.';
                if (!telefone.parentNode.querySelector('.error-message')) {
                    telefone.parentNode.appendChild(errorMsg);
                }
            }
            
            // Validar serviço
            const servico = document.getElementById('servico');
            if (servico.value === '') {
                isValid = false;
                servico.parentNode.classList.add('error');
                const errorMsg = servico.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Por favor, selecione um serviço.';
                if (!servico.parentNode.querySelector('.error-message')) {
                    servico.parentNode.appendChild(errorMsg);
                }
            }
            
            // Validar especificações
            if (textarea.value.trim() === '') {
                isValid = false;
                textarea.parentNode.classList.add('error');
                const errorMsg = textarea.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Por favor, descreva suas necessidades.';
                if (!textarea.parentNode.querySelector('.error-message')) {
                    textarea.parentNode.appendChild(errorMsg);
                }
            } else if (textarea.value.length > 500) {
                isValid = false;
                textarea.parentNode.classList.add('error');
                const errorMsg = textarea.parentNode.querySelector('.error-message') || document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'O texto excede o limite de 500 caracteres.';
                if (!textarea.parentNode.querySelector('.error-message')) {
                    textarea.parentNode.appendChild(errorMsg);
                }
            }
            
            // Se o formulário for válido, simular envio
            if (isValid) {
                // Desabilitar botão e mostrar status
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                formStatus.textContent = 'Processando sua solicitação...';
                
                // Simular envio (em um site real, aqui seria feita a requisição AJAX)
                setTimeout(function() {
                    // Esconder formulário e mostrar mensagem de sucesso
                    contactForm.style.display = 'none';
                    successMessage.classList.add('show');
                    
                    // Rolar para a mensagem de sucesso
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Resetar formulário para uso futuro
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Solicitação';
                    formStatus.textContent = '';
                    
                    // Após 5 segundos, mostrar o formulário novamente (apenas para demonstração)
                    setTimeout(function() {
                        contactForm.style.display = 'block';
                        successMessage.classList.remove('show');
                    }, 5000);
                }, 2000);
            }
        });
    }
});
