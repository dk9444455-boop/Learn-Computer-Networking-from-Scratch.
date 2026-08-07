document.addEventListener('DOMContentLoaded', () => {

    // Place your Cloudflare Worker URL here once we deploy it in Step 3!
    const API_URL = "https://netacademy-api.dk9444455.workers.dev";

    // ==========================================
    // 1. NEURAL NETWORK CANVAS ANIMATION (HERO)
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 45;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(0, 102, 255, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // 2. STICKY HEADER & ACTIVE SCROLLSPY LINKS
    // ==========================================
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active section highlighting (Scrollspy)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Back to Top Visibility
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to Top Action
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 3. MOBILE MENU HAMBURGER NAVIGATION
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isMenuOpen = navMenu.classList.contains('active');
        hamburgerBtn.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu on clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. ANIMATED STATS COUNTER
    // ==========================================
    const counters = document.querySelectorAll('.count');
    let countersStarted = false;

    function runCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            let countValue = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps target

            const updateCount = () => {
                countValue += increment;
                if (countValue < target) {
                    counter.innerText = Math.ceil(countValue).toLocaleString() + (target === 15000 ? '+' : (target === 49 ? '/5' : '+'));
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString() + (target === 15000 ? '+' : (target === 49 ? '/5' : '+'));
                }
            };
            updateCount();
        });
    }

    const counterSection = document.querySelector('.stats-bar');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                runCounters();
                countersStarted = true;
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(counterSection);

    // ==========================================
    // 6. FAQ ACCORDION TRANSITIONS
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const headerBox = item.querySelector('.faq-header');
        const answer = item.querySelector('.faq-answer');

        headerBox.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close any open FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    // 7. BUTTON RIPPLE EFFECT
    // ==========================================
    const rippleButtons = document.querySelectorAll('.btn-ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripples = document.createElement('span');
            ripples.classList.add('ripple');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // ==========================================
    // 8. CONTACT FORM VALIDATION & API SUBMISSION
    // ==========================================
    const form = document.getElementById('inquiryForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Form inputs
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const phoneInput = document.getElementById('phoneNumber');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Error displays
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const numericPhone = phone.replace(/\D/g, '');
        return numericPhone.length >= 10;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Name Validation
        if (nameInput.value.trim() === '') {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        // Email Validation
        if (!validateEmail(emailInput.value.trim())) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Phone Validation
        if (!validatePhone(phoneInput.value.trim())) {
            phoneError.style.display = 'block';
            isValid = false;
        } else {
            phoneError.style.display = 'none';
        }

        // Subject dropdown Validation
        if (subjectInput.value === '') {
            subjectError.style.display = 'block';
            isValid = false;
        } else {
            subjectError.style.display = 'none';
        }

        // Message Validation
        if (messageInput.value.trim() === '') {
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }

        // If completely valid, send data to the backend!
        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Change button state to show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Inquiry... <i class="fas fa-spinner fa-spin"></i>';

            try {
                // If the user has not replaced the placeholder URL yet, run the simulation instead of throwing an error
                if (API_URL === "YOUR_CLOUDFLARE_WORKER_URL_HERE") {
                    console.log("Using Simulation Mode. Connect your actual API_URL to save to Cloudflare.");
                    setTimeout(() => {
                        modal.classList.add('active');
                        form.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 1000);
                    return;
                }

                // Send a real POST request to our database API
                const response = await fetch(`${API_URL}/inquiry`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        subject: subjectInput.value,
                        message: messageInput.value.trim()
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success: Show the modal popup and clear the form
                    modal.classList.add('active');
                    form.reset();
                } else {
                    alert(data.error || "An error occurred. Please try again.");
                }

            } catch (error) {
                console.error("Connection Error: ", error);
                alert("Could not connect to the database server. Please verify your Worker is running.");
            } finally {
                // Reset button back to normal
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    });

    // Close Modal Action
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close Modal when clicking outside content area
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});