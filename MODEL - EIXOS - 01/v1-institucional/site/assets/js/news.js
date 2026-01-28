document.addEventListener("DOMContentLoaded", function () {
    const filterBtns = document.querySelectorAll(".news-controls .filter-btn");
    const newsGrid = document.getElementById("news-grid");
    const loadMoreBtn = document.getElementById("load-more-btn");

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");
                document.querySelectorAll("[data-category]").forEach(el => {
                    const category = el.getAttribute("data-category");
                    const isVisible = (filter === "all" || category === filter);
                    
                    if (el.classList.contains('featured-article')) {
                        // For featured article, we hide/show the wrapper
                        const wrapper = el.closest('.featured-news-wrapper');
                        if (wrapper) wrapper.style.display = isVisible ? "block" : "none";
                    } else {
                        el.style.display = isVisible ? "flex" : "none";
                    }
                });
            });
        });
    }

    if (loadMoreBtn && newsGrid) {
        loadMoreBtn.addEventListener("click", () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = "Não há mais notícias";
                loadMoreBtn.disabled = true;
            }, 1000);
        });
    }
});
