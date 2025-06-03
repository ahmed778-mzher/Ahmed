document.addEventListener('DOMContentLoaded', function () {
    // زر فتح/إغلاق قائمة الجوال
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        // إغلاق القائمة عند الضغط على أي رابط داخلها
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ------------------------------
    // ظهور تدريجي لبطاقات المهارات عند النزول
    // ------------------------------
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillCards = skillsSection.querySelectorAll('.skill-card-glow');
        skillCards.forEach(card => card.classList.remove('visible'));
        let animated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    skillCards.forEach((card, idx) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, idx * 220);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(skillsSection);
    }

    // ------------------------------
    // ظهور تدريجي لبطاقات المشاريع عند النزول
    // ------------------------------
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const projectCards = projectsSection.querySelectorAll('.bg-gray-50');
        projectCards.forEach(card => card.classList.remove('visible'));
        let animated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    projectCards.forEach((card, idx) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, idx * 180);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(projectsSection);
    }

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

                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
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
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
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
                        // رسالة جانبية عائمة
                        let sideMsg = document.createElement('div');
                        sideMsg.textContent = "✅ تم إرسال النموذج بنجاح!";
                        sideMsg.style.position = 'fixed';
                        sideMsg.style.top = '30px';
                        sideMsg.style.left = '30px';
                        sideMsg.style.background = '#2563eb';
                        sideMsg.style.color = '#fff';
                        sideMsg.style.padding = '1rem 2rem';
                        sideMsg.style.borderRadius = '1rem';
                        sideMsg.style.boxShadow = '0 4px 24px 0 rgba(37,99,235,0.18)';
                        sideMsg.style.fontSize = '1.2rem';
                        sideMsg.style.zIndex = '9999';
                        sideMsg.style.opacity = '0.97';
                        sideMsg.style.transition = 'opacity 0.5s';

                        document.body.appendChild(sideMsg);

                        setTimeout(() => {
                            sideMsg.style.opacity = '0';
                            setTimeout(() => sideMsg.remove(), 600);
                        }, 2500);

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
            showMoreProjectsButton.textContent = isShowingMore ? 'إخفاء المشاريع' : 'عرض المزيد من المشاريع';
        }

        showMoreProjectsButton.addEventListener('click', () => {
            isShowingMore = !isShowingMore;
            updateProjectVisibility();
        });
        // تحديث الرؤية عند تحميل الصفحة
        updateProjectVisibility();
    }

    // ------------------------------
    // تأثير كتابة متحركة واحترافي للهيدر
    // ------------------------------
    const heroTitle = document.querySelector('#hero h1');
    const heroDesc = document.querySelector('#hero p');
    if (heroTitle && heroDesc) {
        const titleText = heroTitle.textContent;
        const descText = heroDesc.textContent;
        heroTitle.textContent = '';
        heroDesc.textContent = '';

        // مؤشر وميض للعنوان
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.textContent = '|';
        heroTitle.appendChild(cursor);

        let i = 0, j = 0;

        function typeTitle() {
            if (i < titleText.length) {
                heroTitle.textContent += titleText.charAt(i);
                i++;
                setTimeout(typeTitle, 45);
            } else {
                setTimeout(typeDesc, 400);
            }
        }
        function typeDesc() {
            if (j < descText.length) {
                heroDesc.textContent += descText.charAt(j);
                j++;
                setTimeout(typeDesc, 25);
            }
        }
        typeTitle();
    }

    // حركة للصورة الشخصية مع ظل متدرج عند التحميل
    const profileImage = document.querySelector('#hero img');
    if (profileImage) {
        profileImage.style.opacity = '0';
        profileImage.style.transform = 'translateY(20px)';
        profileImage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        window.addEventListener('load', () => {
            profileImage.style.opacity = '1';
            profileImage.style.transform = 'translateY(0)';
        });
    }
    // ------------------------------
    // إضافة تأثيرات تفاعلية على الروابط
    // ------------------------------
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.textDecoration = 'underline';
            link.style.color = '#2563eb'; // لون أزرق مميز
        });
        link.addEventListener('mouseout', () => {
            link.style.textDecoration = 'none';
            link.style.color = ''; // إعادة اللون الافتراضي
        });
    });
    // ------------------------------
    // حركة الصورة للخارج عند دخول الصفحة 
    // ------------------------------

// حركة الصورة للخارج عند دخول الصفحة 
    // ...existing code...

// حركة مختلفة للصورة عند دخول الصفحة (تكبير وتدوير خفيف مع تلاشي)
const heroImage = document.querySelector('#hero img');
if (heroImage) {
    // ابدأ الصورة مصغرة وشفافة وبدوران خفيف
    heroImage.style.transform = 'scale(0.7) rotate(-10deg)';
    heroImage.style.opacity = '0';
    heroImage.style.transition = 'transform 1.5s cubic-bezier(.4,2,.3,1), opacity 1.5s cubic-bezier(.4,2,.3,1)';

    // عند تحميل الصفحة، أعد الصورة لحجمها الطبيعي ودوران 0 مع تلاشي للداخل
    setTimeout(() => {
        heroImage.style.transform = 'scale(1) rotate(0)';
        heroImage.style.opacity = '1';
    }, 300);
}
});