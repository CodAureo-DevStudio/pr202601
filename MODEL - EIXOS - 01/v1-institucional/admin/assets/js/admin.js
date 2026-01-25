/* === ADMIND DASHBOARD LOGIC === */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navigation Handling
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.dashboard-section');
    const pageTitle = document.getElementById('page-title');
    const titleMap = {
        'dashboard': 'Visão Geral',
        'news': 'Gerenciar Notícias',
        'projects': 'Meus Projetos',
        'gallery': 'Galeria de Fotos',
        'transparency': 'Portal da Transparência',
        'messages': 'Caixa de Entrada',
        'users': 'Usuários do Sistema'
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');

            // Remove active classes
            menuLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked
            link.classList.add('active');
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update Header Title
            if (pageTitle && titleMap[targetId]) {
                pageTitle.textContent = titleMap[targetId];
            }

            // Close sidebar on mobile if open
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });

    // 2. Mobile Sidebar Toggle
    const toggleBtn = document.querySelector('.menu-toggle-admin');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn) {
        // Since toggle is display:none on desktop, we force display block via JS or CSS media query check
        // Check CSS in admin.css, it handles display.

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close when clicking outside (simple version)
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    // 3. Simple Action Feedback (Mock)
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             if(confirm('Tem certeza que deseja excluir este item?')) {
                 const row = btn.closest('tr');
                 row.style.opacity = '0.5';
                 setTimeout(() => row.remove(), 500);
             }
        });
    });



    // 0. Login Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock Login
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Autenticando...';
            btn.disabled = true;

            setTimeout(() => {
                // Fade out effect
                const loginScreen = document.getElementById('login-screen');
                loginScreen.classList.add('fade-out');
                
                // Show Dashboard behind it
                const appContent = document.getElementById('app-content');
                appContent.style.display = 'flex'; 
                
                // Wait for fade to finish before hiding display
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    window.dispatchEvent(new Event('resize'));
                }, 500);

                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }


    // 3.5 Logout Confirmation
    // 3.5 Logout Confirmation
    const logoutBtn = document.querySelector('.user-profile a[title="Sair"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
             if (confirm('Deseja realmente sair do painel?')) {
                document.getElementById('app-content').style.display = 'none';
                document.getElementById('login-screen').style.display = 'flex';
                // Reset form
                if(document.getElementById('login-form')) document.getElementById('login-form').reset();
            }
        });
    }

    // 4. Modal Handling
    window.openModal = function(modalId) {
        document.getElementById(modalId).classList.add('open');
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('open');
    }

    // Close on overlay click
    document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });
    });

    // 5. Submit New Project (Mock)
    window.submitProject = function() {
        const form = document.getElementById('form-new-project');
        // In a real app, we would gather FormData here
        // const formData = new FormData(form);

        // Visual feedback
        const btn = form.nextElementSibling.querySelector('.btn-primary');
        const originalText = btn.innerText;
        btn.innerText = 'Salvando...';
        btn.disabled = true;

        setTimeout(() => {
            // Mock Success
            alert('Projeto salvo com sucesso!');
            closeModal('modal-new-project');
            btn.innerText = originalText;
            btn.disabled = false;
            form.reset();

            // Add visual row (Optional simplified mock)
            const table = document.getElementById('projects-table').querySelector('tbody');
            const newRow = `
                <tr style="animation: fade-in 0.5s;">
                    <td>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 4px;"></div>
                            <div>
                                <strong>Novo Projeto Adicionado</strong>
                                <div style="font-size: 0.8rem; color: #64748b;">Recém criado</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="status-badge" style="background: #f1f5f9; color: #475569;">Pendente</span></td>
                    <td>
                        <div style="font-size: 0.85rem;">-</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">-</div>
                    </td>
                    <td><span class="status-badge active" style="background: #dcfce7; color: #166534;">Novo</span></td>
                    <td>
                        <button class="btn-action"><i class="fas fa-edit"></i></button>
                        <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            table.insertAdjacentHTML('afterbegin', newRow);
        }, 1500);
    }
});
