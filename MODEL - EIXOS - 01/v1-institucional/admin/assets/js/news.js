import { db } from './firebase-config.js';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initCommon } from './admin-common.js';

initCommon();

const newsTable = document.getElementById('news-table')?.querySelector('tbody');
if (newsTable) {
    const q = query(collection(db, "noticias"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        newsTable.innerHTML = '';
        if (snapshot.empty) {
            newsTable.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem;">Nenhuma notícia encontrada.</td></tr>';
            return;
        }
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recente';
            const row = `
                <tr>
                    <td><strong>${data.title}</strong></td>
                    <td><span class="status-badge active">${data.category || 'Geral'}</span></td>
                    <td>${date}</td>
                    <td>
                        <button class="btn-action" onclick="alert('Funcionalidade em desenvolvimento')"><i class="fas fa-edit"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteNews('${docSnap.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            newsTable.insertAdjacentHTML('beforeend', row);
        });
    });
}

window.deleteNews = async (id) => {
    if (confirm('Excluir notícia?')) {
        try { await deleteDoc(doc(db, "noticias", id)); }
        catch (error) { console.error(error); }
    }
};

// New News Submission
const btnSaveNews = document.getElementById('btn-save-news');
if (btnSaveNews) {
    btnSaveNews.addEventListener('click', async () => {
        const form = document.getElementById('form-new-news');
        const formData = new FormData(form);
        
        const newNews = {
            title: formData.get('news_title'),
            category: formData.get('news_category'),
            excerpt: formData.get('news_excerpt'),
            content: formData.get('news_content'),
            imageUrl: formData.get('news_image') || '../assets/img/news-hero.png',
            createdAt: new Date() // use serverTimestamp if imported, but Date is fine for local test
        };

        if (!newNews.title) {
            alert('Por favor, insira um título.');
            return;
        }

        btnSaveNews.disabled = true;
        btnSaveNews.innerText = 'Salvando...';

        try {
            await addDoc(collection(db, "noticias"), newNews);
            alert('Notícia publicada com sucesso!');
            window.closeModal('modal-new-news');
            form.reset();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar notícia.');
        } finally {
            btnSaveNews.disabled = false;
            btnSaveNews.innerText = 'Publicar Notícia';
        }
    });
}
