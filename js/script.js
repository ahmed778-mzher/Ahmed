
    // ------------------------------
    // سكرول ناعم للروابط الداخلية
    // ------------------------------
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefValue = this.getAttribute('href');
            const isMainPageLink = hrefValue.startsWith('index.html#');
            const targetId = isMainPageLink ? hrefValue.substring(hrefValue.indexOf('#')) : hrefValue;

            if (targetId && targetId.length > 1 && (hrefValue.startsWith('#') || isMainPageLink)) {
                if (isMainPageLink && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                    return;
                }
                e.preventDefault();

                if (mobileMenu && mobileMenu.classList.contains('hidden') === false) {
                    mobileMenu.classList.add('hidden');
                }

                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const navbar = document.querySelector('nav');
                        const navbarHeight = navbar ? navbar.offsetHeight : 0;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                } catch (error) {
                    console.error("Error scrolling to target:", targetId, error);
                }
            } else if (targetId === "#") {
                e.preventDefault();
                if (mobileMenu && mobileMenu.classList.contains('hidden') === false) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // ------------------------------
    // السنة الحالية في الفوتر
    // ------------------------------
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ------------------------------
    // معالجة إرسال النماذج
    // ------------------------------
    function handleFormSubmit(formElement, statusElement) {
        if (formElement && statusElement) {
            formElement.addEventListener("submit", async function (event) {
                event.preventDefault();
                const data = new FormData(event.target);
                statusElement.className = 'form-status-message';
                statusElement.textContent = 'جارٍ الإرسال...';
                statusElement.style.display = 'block';

                fetch(event.target.action, {
                    method: formElement.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        statusElement.textContent = "شكراً لك! تم استلام طلبك بنجاح وسأتواصل معك قريباً.";
                        statusElement.className = 'form-status-message success';
                        formElement.reset();
                    } else {
                        response.json().then(responseData => {
                            if (Object.hasOwn(responseData, 'errors')) {
                                statusElement.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                            } else {
                                statusElement.textContent = "عذراً! حدث خطأ ما ولم يتم إرسال طلبك. يرجى المحاولة مرة أخرى.";
                            }
                            statusElement.className = 'form-status-message error';
                        }).catch(() => {
                            statusElement.textContent = "عذراً! حدث خطأ في تحليل استجابة الخادم. يرجى المحاولة مرة أخرى.";
                            statusElement.className = 'form-status-message error';
                        });
                    }
                }).catch(error => {
                    console.error('Form submission error:', error);
                    statusElement.textContent = "عذراً! حدث خطأ ما ولم يتم إرسال طلبك. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
                    statusElement.className = 'form-status-message error';
                });
            });
        }
    }

    // تهيئة نموذج التواصل
    const contactForm = document.getElementById('contact-form');
    const contactFormStatus = document.getElementById('form-status-message');
    handleFormSubmit(contactForm, contactFormStatus);

    // ------------------------------
    // حركة شريط الشهادات (إذا كان مطلوباً)
    // ------------------------------
    const testimonialMarquee = document.querySelector('.testimonial-marquee');
    if (testimonialMarquee) {
        const marqueeContainer = document.querySelector('.testimonial-marquee-container');
        if (marqueeContainer) {
            marqueeContainer.addEventListener('mouseenter', () => {
                testimonialMarquee.style.animationPlayState = 'paused';
            });
            marqueeContainer.addEventListener('mouseleave', () => {
                testimonialMarquee.style.animationPlayState = 'running';
            });
        }
    }

    // ------------------------------
    // زر "اظهار المزيد" للمشاريع
    // ------------------------------
    const projectGrid = document.getElementById('project-grid');
    const showMoreProjectsButton = document.getElementById('show-more-projects-button');
    const projectsInitiallyVisible = 3;

    if (projectGrid && showMoreProjectsButton) {
        const allProjectCards = Array.from(projectGrid.getElementsByClassName('project-card'));
        const totalProjects = allProjectCards.length;
        let isShowingMore = false;

        function updateProjectVisibility() {
            if (totalProjects <= projectsInitiallyVisible) {
                showMoreProjectsButton.classList.add('hidden');
                allProjectCards.forEach(card => card.classList.remove('hidden'));
                return;
            }
            showMoreProjectsButton.classList.remove('hidden');
            allProjectCards.forEach((card, index) => {
                if (isShowingMore) {
                    card.classList.remove('hidden');
                } else {
                    if (index < projectsInitiallyVisible) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
            showMoreProjectsButton.textContent = isShowingMore ? 'إظهار أقل' : 'اظهار المزيد';
        }

        showMoreProjectsButton.addEventListener('click', () => {
            isShowingMore = !isShowingMore;
            updateProjectVisibility();
        });

        updateProjectVisibility();
    }

    // ------------------------------
    // زر العودة للأعلى
    // ------------------------------
    const scrollToTopButton = document.getElementById('scroll-to-top-button');
    if (scrollToTopButton) {
        // إخفاء الزر عند تحميل الصفحة إذا كان في الأعلى
        if (window.scrollY === 0) {
            scrollToTopButton.classList.add('hidden');
        }

        // إظهار/إخفاء الزر عند التمرير
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.remove('hidden');
            } else {
                scrollToTopButton.classList.add('hidden');
            }
        });

        // عند الضغط على الزر
        scrollToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    document.addEventListener('DOMContentLoaded', function () {
        const ticker = document.getElementById('ticker-track');
        if (ticker) {
            // كرر البطاقات لجعل الحركة دائرية
            ticker.innerHTML += ticker.innerHTML;

            let pos = 0;
            const speed = 1; // سرعة الحركة (يمكنك تعديلها)
            const tickerWidth = ticker.scrollWidth / 2;
            let paused = false;

            ticker.addEventListener('mouseenter', () => paused = true);
            ticker.addEventListener('mouseleave', () => paused = false);

            function animate() {
                if (!paused) {
                    pos -= speed;
                    if (Math.abs(pos) >= tickerWidth) {
                        pos = 0;
                    }
                    ticker.style.transform = `translateX(${pos}px)`;
                }
                requestAnimationFrame(animate);
            }
            animate();
        }
    });
