import { db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    deleteDoc, 
    doc, 
    query, 
    orderBy,
    serverTimestamp,
    setDoc,
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initCommon } from './admin-common.js';

// Initialize Common UI (sidebar, profile)
initCommon();

const transparencyTable = document.getElementById('transparency-table');

if (transparencyTable) {
    const tbody = transparencyTable.querySelector('tbody');

    const renderDocRow = (docSnap) => {
        const data = docSnap.data();
        const date = data.date ? new Date(data.date).toLocaleDateString('pt-BR') : 'N/A';
        
        let statusBadge = '';
        if (data.status === 'Aberto') statusBadge = '<span class="status-badge" style="background: #dbeafe; color: #1e40af;">Aberto</span>';
        else if (data.status === 'Concluído') statusBadge = '<span class="status-badge" style="background: #dcfce7; color: #15803d;">Concluído</span>';
        else if (data.status === 'Em Execução') statusBadge = '<span class="status-badge" style="background: #fffcdb; color: #b45309;">Em Execução</span>';
        else statusBadge = `<span class="status-badge">${data.status}</span>`;

        let icon = 'fa-file-alt';
        let color = '#64748b';
        if (data.category === 'Editais') { icon = 'fa-file-pdf'; color = '#ef4444'; }
        else if (data.category === 'Financeiro') { icon = 'fa-chart-line'; color = '#10b981'; }

        const downloadBtn = data.fileUrl 
            ? `<a href="${data.fileUrl}" target="_blank" class="btn-action" title="Baixar"><i class="fas fa-download"></i></a>`
            : `<button class="btn-action" disabled title="Sem arquivo"><i class="fas fa-ban"></i></button>`;

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas ${icon}" style="color: ${color}; font-size: 1.2rem;"></i>
                        <strong>${data.title}</strong>
                    </div>
                    <small style="color: #64748b; margin-left: 1.7rem;">${data.description || ''}</small>
                </td>
                <td><span class="status-badge" style="background: #f1f5f9; color: #475569;">${data.category}</span></td>
                <td>${date}</td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        ${downloadBtn}
                        <button class="btn-action btn-delete" onclick="deleteDocument('${docSnap.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    };

    onSnapshot(query(collection(db, "transparencia"), orderBy("date", "desc")), (snapshot) => {
        if (tbody) {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhum documento encontrado</td></tr>';
                return;
            }
            snapshot.forEach(doc => {
                tbody.innerHTML += renderDocRow(doc);
            });
        }
    });
}

// Global functions for the HTML
window.updateDocFileLabel = function(input) {
    const label = document.getElementById('doc-file-label');
    if (input.files && input.files[0]) {
        label.innerText = input.files[0].name;
    } else {
        label.innerText = 'Clique para enviar o documento';
    }
};

window.submitDoc = async function() {
    const form = document.getElementById('form-new-doc');
    const fileInput = document.getElementById('doc-file-input');
    const btn = document.querySelector('#modal-new-doc .btn-primary');
    
    const title = form.querySelector('[name="doc_title"]').value;
    const date = form.querySelector('[name="doc_date"]').value;
    const category = form.querySelector('[name="doc_category"]').value;
    const status = form.querySelector('[name="doc_status"]').value;
    const description = form.querySelector('[name="doc_desc"]').value;

    if (!title || !date) {
        alert('Preencha Título e Data.');
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        let fileUrl = '';
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const storageRef = ref(storage, `transparencia_docs/${timestamp}_${safeName}`);
            const snapshot = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "transparencia"), {
            title,
            category,
            status,
            date,
            description,
            fileUrl,
            createdAt: serverTimestamp()
        });

        alert("Documento salvo com sucesso!");
        window.closeModal('modal-new-doc');
        form.reset();
        window.updateDocFileLabel(fileInput);

    } catch (error) {
        console.error("Erro ao salvar documento:", error);
        alert("Erro ao salvar.");
    } finally {
        btn.innerHTML = 'Salvar Documento';
        btn.disabled = false;
    }
};

window.deleteDocument = async function(id) {
    if(!confirm('Tem certeza que deseja excluir este documento?')) return;
    try {
        await deleteDoc(doc(db, "transparencia", id));
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir.");
    }
};

// --- Execution Actions Logic ---
const actionsTable = document.getElementById('actions-table');

if (actionsTable) {
    const tbody = actionsTable.querySelector('tbody');

    const renderAcaoRow = (docSnap) => {
        const data = docSnap.data();
        
        let statusBadge = '';
        if (data.status === 'CONCLUÍDO') statusBadge = '<span class="status-badge" style="background: #dcfce7; color: #15803d;">CONCLUÍDO</span>';
        else if (data.status === 'EM EXECUÇÃO') statusBadge = '<span class="status-badge" style="background: #dbeafe; color: #1e40af;">EM EXECUÇÃO</span>';
        else statusBadge = `<span class="status-badge" style="background: #f1f5f9; color: #475569;">${data.status}</span>`;

        return `
            <tr>
                <td><strong>${data.nome}</strong></td>
                <td>${data.local}</td>
                <td>${statusBadge}</td>
                <td><strong>R$ ${data.valor}</strong></td>
                <td>${data.data}</td>
                <td>
                    <button class="btn-action btn-delete" onclick="deleteAcao('${docSnap.id}')" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    };

    onSnapshot(query(collection(db, "transparencia_acoes"), orderBy("createdAt", "desc")), (snapshot) => {
        if (tbody) {
            tbody.innerHTML = '';
            if (snapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhum registro encontrado</td></tr>';
                return;
            }
            snapshot.forEach(doc => {
                tbody.innerHTML += renderAcaoRow(doc);
            });
        }
    });
}

window.submitAcao = async function() {
    const form = document.getElementById('form-new-acao');
    const btn = document.querySelector('#modal-new-acao .btn-primary');
    
    const nome = form.querySelector('[name="acao_nome"]').value;
    const local = form.querySelector('[name="acao_local"]').value;
    const valor = form.querySelector('[name="acao_valor"]').value;
    const dataAcao = form.querySelector('[name="acao_data"]').value;
    const status = form.querySelector('[name="acao_status"]').value;

    if (!nome || !local || !dataAcao) {
        alert('Preencha os campos obrigatórios (Projeto, Localidade e Data).');
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        await addDoc(collection(db, "transparencia_acoes"), {
            nome,
            local,
            valor,
            data: dataAcao,
            status,
            createdAt: serverTimestamp()
        });

        alert("Registro salvo com sucesso!");
        window.closeModal('modal-new-acao');
        form.reset();

    } catch (error) {
        console.error("Erro ao salvar ação:", error);
        alert("Erro ao salvar.");
    } finally {
        btn.innerHTML = 'Salvar Registro';
        btn.disabled = false;
    }
};

window.deleteAcao = async function(id) {
    if(!confirm('Tem certeza que deseja excluir este registro?')) return;
    try {
        await deleteDoc(doc(db, "transparencia_acoes", id));
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir.");
    }
};

// --- Dashboard Stats Logic ---
const statsForm = document.getElementById('form-dashboard-stats');

async function loadDashboardStats() {
    try {
        const docRef = doc(db, "config", "transparency_stats");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            Object.keys(data).forEach(key => {
                const input = statsForm.querySelector(`[name="${key}"]`);
                if (input) {
                    let val = data[key];
                    // Strip R$ if it was accidentally saved, as we have a visual prefix now
                    if ((key === 'stat_arrecadado_val' || key === 'stat_investido_val') && val) {
                        val = val.replace('R$', '').trim();
                    }
                    input.value = val;
                }
            });
        }
    } catch (error) {
        console.error("Erro ao carregar stats:", error);
    }
}

window.saveDashboardStats = async function() {
    const btn = document.getElementById('btn-save-stats');
    const formData = new FormData(statsForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        await setDoc(doc(db, "config", "transparency_stats"), data);
        alert("Dashboard atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar stats:", error);
        alert("Erro ao salvar painel.");
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Atualizar Painel';
        btn.disabled = false;
    }
};

if (statsForm) {
    loadDashboardStats();
}

// --- Institutional Docs Logic ---
async function loadInstitutionalDocs() {
    try {
        const docRef = doc(db, "config", "institutional_docs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const docs = ['estatuto', 'ata', 'oscip', 'cnpj'];
            docs.forEach(id => {
                const linkDiv = document.getElementById(`link-${id}`);
                if (linkDiv && data[id]) {
                    linkDiv.innerHTML = `<a href="${data[id]}" target="_blank" class="current-link-btn"><i class="fas fa-external-link-alt"></i> Visualizar atual</a>`;
                }
            });
        }
    } catch (error) {
        console.error("Erro ao carregar docs institucionais:", error);
    }
}

window.updateInstLabel = function(input, labelId) {
    const label = document.getElementById(labelId);
    if (input.files && input.files[0]) {
        label.innerText = `Selecionado: ${input.files[0].name}`;
        label.style.color = "#10b981";
    } else {
        label.innerText = "";
    }
};

window.saveInstitutionalDocs = async function() {
    const btn = document.getElementById('btn-save-institutional');
    const docs = [
        { id: 'estatuto', file: document.getElementById('file-estatuto').files[0] },
        { id: 'ata', file: document.getElementById('file-ata').files[0] },
        { id: 'oscip', file: document.getElementById('file-oscip').files[0] },
        { id: 'cnpj', file: document.getElementById('file-cnpj').files[0] }
    ];

    const hasFiles = docs.some(d => d.file);
    if (!hasFiles) {
        alert("Selecione pelo menos um arquivo para atualizar.");
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    try {
        const docRef = doc(db, "config", "institutional_docs");
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        const newData = { ...currentData };

        for (const item of docs) {
            if (item.file) {
                const storageRef = ref(storage, `institutional_docs/${item.id}.pdf`);
                const snapshot = await uploadBytes(storageRef, item.file);
                const url = await getDownloadURL(snapshot.ref);
                newData[item.id] = url;
            }
        }

        await setDoc(docRef, newData);
        alert("Documentos institucionais atualizados!");
        loadInstitutionalDocs(); // Refresh links
        
        // Reset file inputs
        docs.forEach(doc => {
            const input = document.getElementById(`file-${doc.id}`);
            if(input) input.value = '';
        });

    } catch (error) {
        console.error("Erro ao salvar docs institucionais:", error);
        alert("Erro ao salvar documentos.");
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Salvar Documentos';
        btn.disabled = false;
    }
};

loadInstitutionalDocs();

