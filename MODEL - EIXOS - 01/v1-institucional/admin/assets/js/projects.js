import { db, storage } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    where, 
    writeBatch,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { initCommon } from './admin-common.js';

// Initialize Page
initCommon();

const projectsGrid = document.getElementById('projects-grid');
const mainProjectContainer = document.getElementById('main-project-container');
let allProjects = [];

if (projectsGrid) {
    const renderProjects = () => {
        projectsGrid.innerHTML = '';
        
        const featured = allProjects.find(p => p.data.isMain === true);
        let others = allProjects.filter(p => !p.data.isMain);

        // Render Featured
        if (featured && mainProjectContainer) {
            const fData = featured.data;
            mainProjectContainer.innerHTML = `
                <div class="content-card" style="border: 2px solid #fbbf24; background: #fffcf0; width: 100%;">
                    <div class="card-header">
                        <h3 style="color: #92400e;"><i class="fas fa-star" style="color: #f59e0b;"></i> Projeto em Destaque</h3>
                    </div>
                    <div style="padding: 2rem; display: flex; gap: 2rem; align-items: center;">
                        <img src="${fData.imageUrl || '../assets/img/projeto-brasilia-2025-1.webp'}" style="width: 200px; height: 120px; border-radius: 12px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h3>${fData.title}</h3>
                            <p>${fData.excerpt || ''}</p>
                            <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                                <span class="status-badge" style="background: #fef3c7; color: #92400e;">DESTAQUE ATIVO</span>
                                <button class="btn-action btn-delete" onclick="deleteProject('${featured.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render Grid
        others.forEach(p => {
            const data = p.data;
            const card = `
                <div class="content-card">
                    <div style="height: 180px; overflow: hidden;"><img src="${data.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                    <div style="padding: 1.5rem;">
                        <h4>${data.title}</h4>
                        <p style="font-size: 0.85rem; color: #64748b; margin: 0.5rem 0 1rem;">${data.excerpt || ''}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <button class="btn-sm btn-outline" onclick="setMainProject('${p.id}')"><i class="far fa-star"></i> Destacar</button>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn-action" title="Editar"><i class="fas fa-edit"></i></button>
                                <button class="btn-action btn-delete" onclick="deleteProject('${p.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            projectsGrid.insertAdjacentHTML('beforeend', card);
        });
    };

    const q = query(collection(db, "projetos"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        allProjects = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        renderProjects();
    });
}

window.setMainProject = async (newId) => {
    if (!confirm('Deseja destacar este projeto na página inicial?')) return;
    try {
        const batch = writeBatch(db);
        const qMain = query(collection(db, "projetos"), where("isMain", "==", true));
        const snapshot = await getDocs(qMain);
        snapshot.forEach(docSnap => batch.update(doc(db, "projetos", docSnap.id), { isMain: false }));
        batch.update(doc(db, "projetos", newId), { isMain: true });
        await batch.commit();
    } catch (error) {
        console.error(error);
    }
};

window.deleteProject = async (id) => {
    if (confirm('Excluir projeto?')) {
        try { await deleteDoc(doc(db, "projetos", id)); }
        catch (error) { console.error(error); }
    }
};
