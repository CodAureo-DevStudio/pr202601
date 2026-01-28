import { auth, db } from './firebase-config.js';

// Common Admin UI Logic
export const initCommon = () => {
    console.log("Admin Common UI Initializing...");

    // Set Static Admin Profile
    const userName = document.querySelector('.user-profile h4');
    const userEmail = document.querySelector('.user-profile p');
    const avatar = document.querySelector('.user-avatar img');
    
    if(userName) userName.textContent = 'Administrador';
    if(userEmail) userEmail.textContent = 'admin@eixos.org';
    if(avatar) avatar.src = `https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff`;

    // Sidebar Toggle (Mobile)
    const toggleBtn = document.querySelector('.menu-toggle-admin');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Modal Helpers
    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('open');
    };

    // Close on overlay click
    document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });
    });

    // Fake Logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja realmente sair?')) {
                window.location.href = 'login.html';
            }
        });
    }
};
