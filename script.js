/**
 * هذا الملف يحتوي على كل الأكواد التفاعلية للموقع
 */

// هذه الدالة تنتظر حتى يتم تحميل الصفحة بالكامل ثم تقوم بتشغيل الوظائف الأخرى
document.addEventListener('DOMContentLoaded', () => {
    setupSourcesToggle();
    setupShareLinks();
    setupMobileMenu();
    setupScrollProgress();
    setupThemeToggle();
    lazyLoadImages();
});

/**
 * دالة مسؤولة عن تشغيل زر "عرض/إخفاء المصادر"
 */
function setupSourcesToggle() {
    const toggleBtn = document.getElementById('toggle-sources-btn');
    if (!toggleBtn) return;

    const sourcesContainer = document.getElementById('sources-container');
    const icon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', () => {
        const isOpen = sourcesContainer.classList.contains('open');
        if (isOpen) {
            sourcesContainer.classList.remove('open');
            toggleBtn.querySelector('span').textContent = 'عرض المصادر';
            icon.classList.remove('rotate-180');
        } else {
            sourcesContainer.classList.add('open');
            toggleBtn.querySelector('span').textContent = 'إخفاء المصادر';
            icon.classList.add('rotate-180');
        }
    });
}

/**
 * دالة مسؤولة عن تجهيز روابط المشاركة على وسائل التواصل الاجتماعي
 */
function setupShareLinks() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    const shareTwitter = document.getElementById('share-twitter');
    const shareFacebook = document.getElementById('share-facebook');
    const shareTelegram = document.getElementById('share-telegram');
    const shareLinkedin = document.getElementById('share-linkedin');

    if (shareTwitter) {
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
    }
    if (shareFacebook) {
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    }
     if (shareTelegram) {
        shareTelegram.href = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
    }
    if (shareLinkedin) {
        shareLinkedin.href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
    }
}

/**
 * دالة لتنظيم قائمة الجوال
 */
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

/**
 * دالة لشريط تقدم التمرير
 */
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * دالة لتبديل الوضع الليلي/النهاري
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // استعادة وضع الثيم من التخزين المحلي
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

/**
 * دالة للتحميل البطيء للصور
 */
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('[loading="lazy"]');
    
    const observer = new IntersectionObserver((entries) => {
       function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// ثم أضفها لدالة التحميل الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    // ... الدوال الأخرى الموجودة لديك ...
});