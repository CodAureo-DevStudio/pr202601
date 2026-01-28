document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxCaption = document.getElementById("lightbox-caption");
    
    window.openLightbox = function(src, title, caption) {
        if (lightboxImg) lightboxImg.src = src;
        if (lightboxTitle) lightboxTitle.innerText = title;
        if (lightboxCaption) lightboxCaption.innerText = caption || "";
        
        lightbox.classList.add("active");
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeBtn = document.querySelector(".lightbox-close");
    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = ''; // Restore scroll
    };

    if (closeBtn) {
        closeBtn.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});
