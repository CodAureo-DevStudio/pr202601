import { db } from './firebase-config.js';
import { 
    collection, 
    onSnapshot, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initCommon } from './admin-common.js';

// Initialize Page
initCommon();

// Initialize Page
initCommon();

const messagesListBody = document.getElementById('messages-list-body');
const msgFilter = document.getElementById('msg-filter');
const msgSearch = document.getElementById('msg-search');
const msgCountBadge = document.getElementById('msg-count-badge');
const btnReload = document.getElementById('btn-reload-msg');

let allMessages = [];
let currentViewingId = null;

const renderMessages = () => {
    if (!messagesListBody) return;
    
    const filterVal = msgFilter ? msgFilter.value : 'all';
    const searchVal = msgSearch ? msgSearch.value.toLowerCase() : '';
    
    messagesListBody.innerHTML = '';
    
    const filtered = allMessages.filter(msg => {
        const data = msg.data;
        const matchesFilter = filterVal === 'all' || data.status === filterVal;
        const matchesSearch = !searchVal || 
            (data.senderName?.toLowerCase().includes(searchVal)) || 
            (data.subject?.toLowerCase().includes(searchVal)) || 
            (data.message?.toLowerCase().includes(searchVal));
        
        return matchesFilter && matchesSearch;
    });

    if (msgCountBadge) {
        msgCountBadge.innerText = `${filtered.length} de ${allMessages.length} mensagens`;
    }

    if (filtered.length === 0) {
        messagesListBody.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma mensagem encontrada nesta visualização.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(msg => {
        const data = msg.data;
        const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Recente';
        const isUnread = data.status === 'unread';
        const initials = data.senderName ? data.senderName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
        
        const item = `
            <div class="message-item ${isUnread ? 'unread' : ''}" onclick="window.viewMessage('${msg.id}')">
                <div class="msg-avatar">${initials}</div>
                <div class="msg-info">
                    <span class="msg-sender">${data.senderName || 'Anônimo'}</span>
                    <div class="msg-subject">${data.subject || 'Sem Assunto'}</div>
                </div>
                <div class="msg-date">${date}</div>
                <div class="msg-actions">
                    <button class="btn-action" onclick="event.stopPropagation(); window.toggleMessageStatus('${msg.id}', '${data.status}')" title="${isUnread ? 'Marcar como lida' : 'Marcar como não lida'}">
                        <i class="fas ${isUnread ? 'fa-envelope-open' : 'fa-envelope'}"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="event.stopPropagation(); window.deleteMessage('${msg.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        messagesListBody.insertAdjacentHTML('beforeend', item);
    });
};

// Initial Load
const qMsg = query(collection(db, "fale-conosco"), orderBy("createdAt", "desc"));
onSnapshot(qMsg, (snapshot) => {
    allMessages = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    renderMessages();
});

// Event Listeners
if (msgFilter) msgFilter.addEventListener('change', renderMessages);
if (msgSearch) msgSearch.addEventListener('input', renderMessages);
if (btnReload) btnReload.addEventListener('click', () => renderMessages());

// Global Functions
window.viewMessage = async (id) => {
    const msg = allMessages.find(m => m.id === id);
    if (!msg) return;
    
    currentViewingId = id;
    const data = msg.data;
    
    // Fill Modal
    document.getElementById('view-msg-subject').innerText = data.subject || 'Sem Assunto';
    document.getElementById('view-msg-sender').innerText = data.senderName || 'Anônimo';
    document.getElementById('view-msg-email').innerText = data.email || 'N/A';
    document.getElementById('view-msg-content').innerText = data.message || '(Sem conteúdo)';
    document.getElementById('view-msg-date').innerText = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString('pt-BR') : 'Recente';
    
    const initials = data.senderName ? data.senderName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    document.getElementById('view-msg-avatar').innerText = initials;
    
    document.getElementById('btn-reply-msg').href = `mailto:${data.email}?subject=RE: ${data.subject}`;
    
    window.openModal('modal-view-msg');
    
    // Mark as read automatically if unread
    if (data.status === 'unread') {
        await updateDoc(doc(db, "fale-conosco", id), { status: 'read' });
    }
};

window.toggleMessageStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
        await updateDoc(doc(db, "fale-conosco", id), { status: newStatus });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
};

window.deleteMessage = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    try {
        await deleteDoc(doc(db, "fale-conosco", id));
        if (currentViewingId === id) window.closeModal('modal-view-msg');
    } catch (error) {
        console.error("Erro ao excluir mensagem:", error);
    }
};

document.getElementById('btn-delete-viewing')?.addEventListener('click', () => {
    if (currentViewingId) window.deleteMessage(currentViewingId);
});
