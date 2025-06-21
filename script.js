/**
 * هذا الملف يحتوي على كل الأكواد التفاعلية للموقع
 */

// هذه الدالة تنتظر حتى يتم تحميل الصفحة بالكامل ثم تقوم بتشغيل الوظائف الأخرى
document.addEventListener('DOMContentLoaded', () => {
    setupSourcesToggle();
    setupShareLinks();
});

/**
 * دالة مسؤولة عن تشغيل زر "عرض/إخفاء المصادر"
 */
function setupSourcesToggle() {
    const toggleBtn = document.getElementById('toggle-sources-btn');
    if (!toggleBtn) return; // نتوقف إذا لم يكن الزر موجوداً في الصفحة

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
