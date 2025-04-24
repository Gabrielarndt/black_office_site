/*
   BLACK OFFICE - Script principal
   Funcionalidades interativas para o site
*/

// Espera o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Remover preloader quando a página estiver carregada
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    });

    // Header fixo ao rolar a página
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Menu mobile
    const menuMobile = document.querySelector('.menu-mobile');
    const nav = document.querySelector('nav');
    
    if (menuMobile) {
        menuMobile.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuMobile.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuMobile.classList.remove('active');
        });
    });

    // Filtro de portfólio
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else if (item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Slider de depoimentos
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    // Função para mostrar slide específico
    function showSlide(index) {
        // Esconder todos os slides
        testimonialItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Remover classe active de todos os dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide atual
        testimonialItems[index].style.display = 'block';
        dots[index].classList.add('active');
    }

    // Inicializar slider
    showSlide(currentSlide);

    // Evento para dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Evento para botão anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = testimonialItems.length - 1;
            }
            showSlide(currentSlide);
        });
    }

    // Evento para botão próximo
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentSlide++;
            if (currentSlide >= testimonialItems.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        });
    }

    // Auto slide a cada 5 segundos
    setInterval(function() {
        currentSlide++;
        if (currentSlide >= testimonialItems.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 5000);

    // Formulário de contato
    const contactForm = document.getElementById('consultaForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar a lógica para enviar o formulário
            // Por enquanto, apenas mostraremos uma mensagem de sucesso
            
            const formData = new FormData(contactForm);
            let formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log('Formulário enviado:', formValues);
            
            // Simular envio bem-sucedido
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            setTimeout(function() {
                submitBtn.textContent = 'Enviado com Sucesso!';
                
                // Limpar formulário
                contactForm.reset();
                
                // Restaurar botão após 3 segundos
                setTimeout(function() {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 3000);
                
                // Mostrar alerta
                alert('Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.');
            }, 1500);
        });
    }

    // Animação de elementos ao rolar a página
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-content');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('show');
            }
        });
    }
    
    // Verificar posição inicial dos elementos
    window.addEventListener('load', checkScroll);
    
    // Verificar ao rolar a página
    window.addEventListener('scroll', checkScroll);

    // Smooth scroll para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
