document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar AOS (Animate On Scroll) com config premium
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        delay: 0
    });

    // 2. Sticky Header com transição premium
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Progress bar no topo (indicador de scroll)
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (currentScroll / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
        
        lastScroll = currentScroll;
    });

    // 3. Animação do Contador de Estatísticas com easing
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const startCounting = () => {
        stats.forEach(stat => {
            const targetAttr = stat.getAttribute('data-target');
            const target = parseInt(targetAttr.replace(/\D/g, '')) || 0; // Pega apenas os números
            const suffix = targetAttr.replace(/[0-9]/g, ''); // Pega o que não for número (+, h, etc)
            const duration = 2500;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.round(easedProgress * target);
                
                stat.innerText = current + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = targetAttr;
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    // IntersectionObserver para o contador
    const statsSection = document.querySelector('.social-proof');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                startCounting();
                hasCounted = true;
            }
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // 4. LGPD Banner
    const lgpdBanner = document.getElementById('lgpd-banner');
    const btnAceitar = document.getElementById('aceitar-cookies');
    
    if (!localStorage.getItem('lgpd_accepted')) {
        setTimeout(() => {
            lgpdBanner.classList.add('show');
        }, 2500);
    }

    if(btnAceitar) {
        btnAceitar.addEventListener('click', () => {
            lgpdBanner.classList.remove('show');
            localStorage.setItem('lgpd_accepted', 'true');
        });
    }

    // 5. Iniciar Swiper (Carrossel de Depoimentos)
    if(typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                }
            }
        });
    }

    // 6. Efeito Magnético nos Botões CTA (Premium UX)
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 7. Typewriter Effect no Trust Badge
    const trustBadge = document.querySelector('.trust-badge');
    if (trustBadge) {
        const originalText = trustBadge.innerHTML;
        const icon = trustBadge.querySelector('i');
        const textContent = trustBadge.textContent.trim();
        
        // Limpa e faz o efeito de aparecimento gradual
        trustBadge.style.opacity = '0';
        setTimeout(() => {
            trustBadge.style.transition = 'opacity 0.8s ease';
            trustBadge.style.opacity = '1';
        }, 500);
    }

    // 8. (Parallax removido - imagem estática)

    // 9. Reveal progressivo nos service-cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card-icon').style.transform = 'scale(1.2) rotateY(180deg)';
            this.querySelector('.card-icon').style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        card.addEventListener('mouseleave', function() {
            this.querySelector('.card-icon').style.transform = 'scale(1) rotateY(0)';
        });
    });

    // 10. Active nav link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a:not(.btn)');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // 11. Tilt 3D sutil na imagem "Sobre"
    const aboutImg = document.querySelector('.about-image-wrapper');
    if (aboutImg) {
        aboutImg.addEventListener('mousemove', (e) => {
            const rect = aboutImg.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * -10;
            aboutImg.querySelector('.about-image').style.transform = 
                `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });
        aboutImg.addEventListener('mouseleave', () => {
            aboutImg.querySelector('.about-image').style.transform = 
                'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // 12. Formulário Funcional → WhatsApp
    const formTriagem = document.getElementById('form-triagem');
    if (formTriagem) {
        formTriagem.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const area = document.getElementById('area').value;

            if (!nome || !telefone || !area) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Monta a mensagem formatada
            const mensagem = 
`*Nova Solicitação de Análise*
━━━━━━━━━━━━━━━━━
👤 *Nome:* ${nome}
📱 *WhatsApp:* ${telefone}
⚖️ *Área:* ${area}
━━━━━━━━━━━━━━━━━
_Enviado pelo site MARINS Advocacia_`;

            const whatsappURL = `https://wa.me/556392162150?text=${encodeURIComponent(mensagem)}`;

            // Feedback visual no botão
            const btnSubmit = formTriagem.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> REDIRECIONANDO...';
            btnSubmit.style.backgroundColor = '#198754';
            btnSubmit.disabled = true;

            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                
                // Resetar formulário e botão
                setTimeout(() => {
                    formTriagem.reset();
                    btnSubmit.innerHTML = textoOriginal;
                    btnSubmit.style.backgroundColor = '';
                    btnSubmit.disabled = false;
                }, 2000);
            }, 800);
        });
    }

    // 13. Smooth Scroll com offset para header fixo
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
