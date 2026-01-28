import { db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initCommon } from './admin-common.js';

initCommon();

window.runDeduplication = async (event) => {
    if (!confirm('Deseja remover registros duplicados?')) return;
    
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Limpando...';

    try {
        const collections = [
            { name: 'projetos', key: 'title' },
            { name: 'noticias', key: 'title' },
            { name: 'galeria', key: 'imageUrl' }
        ];

        let totalRemoved = 0;
        for (const coll of collections) {
            const snap = await getDocs(collection(db, coll.name));
            const seen = new Set();
            const batch = writeBatch(db);
            let collRemoved = 0;

            snap.forEach(docSnap => {
                const val = docSnap.data()[coll.key];
                if (seen.has(val)) {
                    batch.delete(doc(db, coll.name, docSnap.id));
                    totalRemoved++;
                    collRemoved++;
                } else {
                    seen.add(val);
                }
            });
            if (collRemoved > 0) await batch.commit();
        }
        alert(`Sucesso! ${totalRemoved} duplicados removidos.`);
    } catch (error) {
        console.error(error);
        alert('Erro: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
};
