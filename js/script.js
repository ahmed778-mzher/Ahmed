// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth scroll for navigation links (within the same page)
document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefValue = this.getAttribute('href');
        const isMainPageLink = hrefValue.startsWith('index.html#');
        const targetId = isMainPageLink ? hrefValue.substring(hrefValue.indexOf('#')) : hrefValue;

        if (targetId && targetId.length > 1 && (hrefValue.startsWith('#') || isMainPageLink)) {
            if (isMainPageLink && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                // Allow default navigation to index.html if we are on a different page
                return;
            }
            e.preventDefault(); 

            if(mobileMenu && mobileMenu.classList.contains('hidden') === false){
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
             if(mobileMenu && mobileMenu.classList.contains('hidden') === false){
                mobileMenu.classList.add('hidden'); 
            }
        }
    });
});

// Set current year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}


// Form submission handling with Formspree and status message
const form = document.getElementById('contact-form');
const formStatusMessage = document.getElementById('form-status-message');

if (form && formStatusMessage) { 
    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                formStatusMessage.textContent = "شكراً لك! تم إرسال رسالتك بنجاح.";
                formStatusMessage.className = 'success'; 
                form.reset(); 
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        formStatusMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatusMessage.textContent = "عذراً! حدث خطأ ما ولم يتم إرسال رسالتك. يرجى المحاولة مرة أخرى.";
                    }
                    formStatusMessage.className = 'error'; 
                })
            }
        }).catch(error => {
            console.error('Form submission error:', error);
            formStatusMessage.textContent = "عذراً! حدث خطأ ما ولم يتم إرسال رسالتك. يرجى المحاولة مرة أخرى.";
            formStatusMessage.className = 'error'; 
        });
    }
    form.addEventListener("submit", handleSubmit);
}