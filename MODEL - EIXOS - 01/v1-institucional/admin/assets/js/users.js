import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initCommon } from './admin-common.js';

// Initialize Page
initCommon();

const usersTable = document.getElementById('users-table')?.querySelector('tbody');

if (usersTable) {
    const qUsers = query(collection(db, "users"), orderBy("createdAt", "desc"));
    
    onSnapshot(qUsers, (snapshot) => {
        if (snapshot.empty) {
            usersTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #64748b;">
                        Nenhum usuário cadastrado.
                    </td>
                </tr>`;
            return;
        }

        usersTable.innerHTML = '';
        snapshot.forEach(docSnap => {
            const user = docSnap.data();
            const createdAt = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('pt-BR') : 'Hoje';
            
            // Role Badge Logic
            let roleBadge = '<span class="status-badge" style="background: #e2e8f0; color: #475569;">Desconhecido</span>';
            if (user.role === 'admin') roleBadge = '<span class="badge-role-admin">Administrador</span>';
            if (user.role === 'editor') roleBadge = '<span class="badge-role-editor">Editor</span>';
            if (user.role === 'viewer') roleBadge = '<span class="status-badge">Visualizador</span>';

            const row = `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div class="user-avatar" style="width: 32px; height: 32px; border: 1px solid #e2e8f0;">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random" alt="${user.name}">
                            </div>
                            <div>
                                <div style="font-weight: 500; color: #1e293b;">${user.name}</div>
                                <small style="color: #64748b;">${user.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>${roleBadge}</td>
                    <td>${createdAt}</td>
                    <td><span class="status-badge active">Ativo</span></td>
                    <td>
                        <button class="btn-action" title="Editar (Em breve)"><i class="fas fa-edit"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteUser('${docSnap.id}')" title="Remover Acesso"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            usersTable.insertAdjacentHTML('beforeend', row);
        });
    });
}

// User Actions
window.submitNewUser = async function() {
    const form = document.getElementById('form-new-user');
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');

    if (!name || !email) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const btn = form.closest('.admin-modal').querySelector('.admin-modal-footer .btn-primary');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        btn.disabled = true;

        // Check if email already exists
        const qCheck = query(collection(db, "users"), where("email", "==", email));
        const checkSnap = await getDocs(qCheck);
        
        if (!checkSnap.empty) {
            alert("Este e-mail já está cadastrado no sistema.");
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        await addDoc(collection(db, "users"), {
            name,
            email,
            role,
            createdAt: serverTimestamp(),
            status: 'active',
            createdBy: 'admin'
        });
        
        alert(`Usuário ${name} cadastrado com sucesso!`);
        window.closeModal('modal-new-user');
        form.reset();

    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        alert("Erro ao criar usuário. Tente novamente.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

window.deleteUser = async function(id) {
    if(confirm('Tem certeza que deseja remover este usuário? Ele perderá o acesso ao sistema.')) {
        try {
            await deleteDoc(doc(db, "users", id));
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
        }
    }
};
