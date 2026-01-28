import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    onSnapshot, 
    query, 
    where, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initialData } from './migration-data.js';
import { initCommon } from './admin-common.js';

// Initialize Page
initCommon();

// Stats Real-time Listeners
onSnapshot(collection(db, "projetos"), (snapshot) => {
    const projectStat = document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-value');
    if (projectStat) projectStat.textContent = snapshot.size;
});

onSnapshot(query(collection(db, "fale-conosco"), where("status", "==", "unread")), (snapshot) => {
    const msgDashboardStat = document.querySelector('.stats-grid .stat-card:nth-child(4) .stat-value');
    if (msgDashboardStat) msgDashboardStat.textContent = snapshot.size;
});

// Migration Check
const checkAndShowMigration = async () => {
    const snap = await getDocs(collection(db, "projetos"));
    if (snap.empty) {
        const container = document.querySelector('.stats-grid');
        if (!container) return;
        
        const migrateBtn = document.createElement('div');
        migrateBtn.className = 'stat-card';
        migrateBtn.style.cursor = 'pointer';
        migrateBtn.style.background = '#2563eb';
        migrateBtn.style.color = 'white';
        migrateBtn.innerHTML = `
            <div class="stat-header">
                <div>
                    <div class="stat-value" style="font-size: 1.25rem;">Sincronizar Dados</div>
                    <div class="stat-label" style="color: rgba(255,255,255,0.85);">Restaurar conteúdo padrão</div>
                </div>
                <div class="stat-icon" style="color: white;"><i class="fas fa-sync-alt"></i></div>
            </div>
        `;
        migrateBtn.onclick = runMigration;
        container.appendChild(migrateBtn);
    }
};

const runMigration = async () => {
    if (!confirm('Deseja sincronizar o conteúdo padrão para o banco de dados?')) return;
    
    try {
        for (const [collName, items] of Object.entries(initialData)) {
            console.log(`Sincronizando ${collName}...`);
            for (const item of items) {
                await addDoc(collection(db, collName), {
                    ...item,
                    createdAt: serverTimestamp()
                });
            }
        }
        alert('Sucesso! Dados sincronizados com sucesso.');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Erro na sincronização: ' + error.message);
    }
};

checkAndShowMigration();
