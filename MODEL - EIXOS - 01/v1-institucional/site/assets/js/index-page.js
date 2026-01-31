import { db } from './firebase-config.js';
import { collection, query, orderBy, limit, onSnapshot, where, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic News - Premium Cards
    const newsGrid = document.getElementById('newsGridHome');
    if (newsGrid) {
        const qNews = query(collection(db, "noticias"), orderBy("createdAt", "desc"), limit(6));
        onSnapshot(qNews, (snapshot) => {
            if (!snapshot.empty) {
                newsGrid.innerHTML = '';
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    
                    // Format date
                    let dateStr = 'Recente';
                    if (data.createdAt) {
                        const date = data.createdAt.toDate();
                        dateStr = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
                    }
                    
                    // Default image
                    const imageUrl = (data.imageUrl || 'assets/img/projeto-brasilia-2025-1.webp').replace('../', '');
                    
                    const card = `
                        <article class="news-card-premium animated-card">
                            <div class="news-card-image">
                                <span class="news-category-badge">${data.category || 'Novidade'}</span>
                                <img src="${imageUrl}" alt="${data.title}" loading="lazy">
                            </div>
                            <div class="news-card-content">
                                <h3 class="news-card-title">${data.title}</h3>
                                <p class="news-card-excerpt">${data.excerpt || data.content?.substring(0, 150) + '...' || ''}</p>
                                <div class="news-card-meta">
                                    <div class="news-card-date">
                                        <div class="icon-wrapper sm blue">
                                            <img src="assets/icons/calendario.svg" alt="Data">
                                        </div>
                                        <span>${dateStr}</span>
                                    </div>
                                    <a href="noticias.html" class="news-card-link">
                                        Ler mais
                                        <div class="icon-wrapper sm blue">
                                            <img src="assets/icons/noticias.svg" alt="Ler">
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </article>
                    `;
                    newsGrid.insertAdjacentHTML('beforeend', card);
                });
            } else {
                newsGrid.innerHTML = `
                    <div class="news-empty-state">
                        <div class="icon-wrapper xl blue">
                            <img src="assets/icons/noticias.svg" alt="Sem notícias">
                        </div>
                        <h3 style="font-size: 1.5rem; color: var(--secondary); margin-bottom: 0.5rem;">Nenhuma notícia publicada</h3>
                        <p style="color: var(--text-light);">Acompanhe nossas próximas novidades em breve!</p>
                    </div>
                `;
            }
        });
    }

    // 2. Featured Project Image
    const featuredImg = document.querySelector('.split-section.bg-white .split-image img');
    if (featuredImg) {
        const qProj = query(collection(db, "projetos"), where("isMain", "==", true), limit(1));
        onSnapshot(qProj, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                if (data.imageUrl) featuredImg.src = data.imageUrl.replace('../', '');
            }
        });
    }

    // 3. Dynamic Stats Counters (for animation in home.js)
    const updateHomeStats = () => {
        // Projects Count
        onSnapshot(collection(db, "projetos"), (snapshot) => {
            const projectCounter = document.querySelector('.stats-section [data-target="20"]');
            if (projectCounter) {
                projectCounter.setAttribute('data-target', snapshot.size);
                // Trigger animation if it didn't run yet or reset it if needed
                if (window.animateStats && projectCounter.innerText === "0") {
                    projectCounter.innerText = snapshot.size; // Fallback if scroll already happened
                }
            }
        });

        // Families Count (from Transparency Stats)
        onSnapshot(doc(db, "config", "transparency_stats"), (docSnap) => {
            const familiesCounter = document.querySelector('.stats-section [data-target="2500"]');
            if (familiesCounter && docSnap.exists()) {
                const total = docSnap.data().stat_familias_val || "2500";
                familiesCounter.setAttribute('data-target', total.replace(/\D/g, ''));
            }
        });
    };
    updateHomeStats();

    // 4. Dynamic Fluid Gallery (Random 30 images from galeria collection)
    const fluidGalleryTrack = document.getElementById('fluidGalleryTrack');
    if (fluidGalleryTrack) {
        const qGallery = query(collection(db, "galeria"), orderBy("createdAt", "desc"));
        onSnapshot(qGallery, (snapshot) => {
            if (!snapshot.empty) {
                // Get all images
                const allImages = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (data.imageUrl) {
                        allImages.push({
                            url: data.imageUrl.replace('../', ''),
                            title: data.title || 'Galeria'
                        });
                    }
                });

                // Shuffle and limit to 30
                const shuffled = allImages.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 30);

                // Render images
                if (selected.length > 0) {
                    fluidGalleryTrack.innerHTML = '';
                    selected.forEach(img => {
                        const imgElement = document.createElement('img');
                        imgElement.src = img.url;
                        imgElement.alt = img.title;
                        imgElement.loading = 'lazy';
                        fluidGalleryTrack.appendChild(imgElement);
                    });
                } else {
                    fluidGalleryTrack.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">Nenhuma imagem na galeria</p>';
                }
            } else {
                fluidGalleryTrack.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">Nenhuma imagem na galeria</p>';
            }
        });
    }
});
