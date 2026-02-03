import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; 
import { collection, getDocs, deleteDoc, updateDoc, addDoc, doc, query, where, orderBy, limit, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { db, storage, auth, firebaseConfig } from "./config.js";

let todosInscritos = [];
let modoLixeira = false;
let filtroAtual = 'todos'; 
let acaoPendente = null;
let idPendente = null;

let chartCategorias = null;
let chartStatus = null;
let chartEvolucao = null;
let chartTrabalhos = null;
let chartInstituicoes = null;

// --- MONITOR DE SESSÃO ---
onAuthStateChanged(auth, async (user) => {
    const loginOverlay = document.getElementById('login-overlay');
    const painelConteudo = document.getElementById('painel-conteudo');
    if (user) {
        loginOverlay.style.display = 'none';
        painelConteudo.style.display = 'block';
        document.getElementById('display-nome-user').innerText = user.email;
        
        // INICIA NO DASHBOARD IMEDIATAMENTE
        alternarAba('dashboard'); 
    } else {
        loginOverlay.style.display = 'flex';
        painelConteudo.style.display = 'none';
    }
});

// --- LOGIN ---
window.fazerLogin = async function() {
    const email = document.getElementById('usuario-admin').value.trim();
    const senha = document.getElementById('senha-admin').value.trim();
    const btn = document.getElementById('btn-login');
    const msgErro = document.getElementById('msg-erro');
    if(!email || !senha) return;
    btn.innerText = "Verificando..."; btn.disabled = true; msgErro.style.display = 'none';
    try {
        await signInWithEmailAndPassword(auth, email, senha);
    } catch(error) {
        console.error("Erro Login:", error.code);
        msgErro.innerText = "Erro: Verifique email e senha.";
        msgErro.style.display = 'block';
    } finally {
        btn.innerText = "ENTRAR NO SISTEMA"; btn.disabled = false;
    }
}
window.fazerLogout = async function() { await signOut(auth); window.location.reload(); }

// --- FUNÇÕES UTILITÁRIAS (LOGS E ALERTS) ---
window.registrarLog = async function(acao, alvoId) {
    try {
        const user = auth.currentUser;
        const email = user ? user.email : "Sistema";
        await addDoc(collection(db, "logs"), {
            data: new Date().toLocaleString(),
            admin: email,
            acao: acao,
            alvo_id: alvoId || "N/A",
            timestamp: Date.now()
        });
    } catch(e) { console.error("Erro ao registrar log:", e); }
}

window.mostrarAlerta = function(titulo, msg, tipo='info') {
    const icon = document.getElementById('aviso-icon');
    const h2 = document.getElementById('aviso-titulo');
    const p = document.getElementById('aviso-msg');
    
    h2.innerText = titulo;
    p.innerText = msg;
    
    if(tipo === 'erro') { icon.innerText = 'error'; icon.style.color = 'var(--vermelho-erro)'; }
    else if(tipo === 'sucesso') { icon.innerText = 'check_circle'; icon.style.color = 'var(--verde-sucesso)'; }
    else { icon.innerText = 'info'; icon.style.color = 'var(--azul-principal)'; }

    document.getElementById('modal-aviso').style.display = 'flex';
}

// --- CRIAR NOVO ADMIN ---
window.salvarAdmin = async function() {
    const email = document.getElementById('new-admin-email').value.trim();
    const pass = document.getElementById('new-admin-pass').value.trim();
    const btn = document.getElementById('btn-save-admin');
    const msg = document.getElementById('msg-config');

    if(!email || pass.length < 6) {
        mostrarAlerta("Dados Inválidos", "O e-mail é obrigatório e a senha deve ter no mínimo 6 caracteres.", "erro");
        return;
    }

    btn.disabled = true; btn.innerText = "Criando...";
    msg.style.display = 'none';
    
    try {
        const secondaryApp = initializeApp(firebaseConfig, "Secondary");
        const secondaryAuth = getAuth(secondaryApp);
        await createUserWithEmailAndPassword(secondaryAuth, email, pass);
        await signOut(secondaryAuth);
        
        await registrarLog("Criou novo admin", email);
        mostrarAlerta("Sucesso", "Novo administrador criado com sucesso!", "sucesso");
        
        document.getElementById('new-admin-email').value = "";
        document.getElementById('new-admin-pass').value = "";
        fecharModal('modal-config');
    } catch(error) {
        console.error("Erro ao criar admin:", error);
        msg.innerText = "Erro: " + error.code;
        msg.style.color = "var(--vermelho-erro)";
        msg.style.display = "block";
    } finally {
        btn.disabled = false; btn.innerText = "CRIAR ADMINISTRADOR";
    }
}

// --- DEMAIS FUNÇÕES DO PAINEL ---
window.alternarAba = function(aba) {
    const viewInscritos = document.getElementById('view-inscritos');
    const viewDashboard = document.getElementById('view-dashboard-panel');
    const viewGaleria = document.getElementById('view-galeria');
    
    const tabInscritos = document.getElementById('tab-inscritos');
    const tabDashboard = document.getElementById('tab-dashboard');
    const tabGaleria = document.getElementById('tab-galeria');
    
    // Esconde tudo
    if(viewDashboard) viewDashboard.style.display = 'none';
    if(viewInscritos) viewInscritos.style.display = 'none'; 
    if(viewGaleria) viewGaleria.style.display = 'none';
    document.getElementById('view-noticias').style.display = 'none';
    document.getElementById('view-calendario').style.display = 'none'; 
    document.getElementById('view-vencedor').style.display = 'none';
    document.getElementById('view-mensagens').style.display = 'none';
    document.getElementById('view-configuracoes').style.display = 'none'; // NOVO
    
    // Update Page Title
    const titles = {
        'dashboard': 'Visão Geral',
        'inscritos': 'Gestão de Inscritos',
        'galeria': 'Galeria de Fotos',
        'noticias': 'Gerenciar Notícias',
        'calendario': 'Calendário de Eventos',
        'vencedor': 'Resultados Finais',
        'mensagens': 'Mensagens Recebidas',
        'configuracoes': 'Sobre o Sistema' // NOVO
    };
    if(document.getElementById('page-title')) document.getElementById('page-title').innerText = titles[aba] || 'Painel';

    // Remove active class from sidebar items
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('ativo'));

    if(aba === 'dashboard') {
        if(viewDashboard) viewDashboard.style.display = 'block';
        if(tabDashboard) tabDashboard.classList.add('ativo');
        carregarDashboard();
    } else if(aba === 'inscritos') {
        viewInscritos.style.display = 'block';
        tabInscritos.classList.add('ativo');
        if(todosInscritos.length === 0) carregarDados(); 
        else atualizarVisualizacao();
    } else if (aba === 'galeria') {
        viewGaleria.style.display = 'block';
        tabGaleria.classList.add('ativo');
        carregarGaleria(); 
    } else if (aba === 'noticias') {
            document.getElementById('view-noticias').style.display = 'block';
            document.getElementById('tab-noticias').classList.add('ativo');
            carregarNoticias();
    } else if (aba === 'calendario') {
            document.getElementById('view-calendario').style.display = 'block';
            document.getElementById('tab-calendario').classList.add('ativo');
            carregarEventos();
    } else if (aba === 'vencedor') {
            document.getElementById('view-vencedor').style.display = 'block';
            document.getElementById('tab-vencedor').classList.add('ativo');
            carregarVencedorAdmin();
    } else if (aba === 'mensagens') {
            document.getElementById('view-mensagens').style.display = 'block';
            document.getElementById('tab-mensagens').classList.add('ativo');
            carregarMensagens();
    } else if (aba === 'configuracoes') {
            document.getElementById('view-configuracoes').style.display = 'block';
            document.getElementById('tab-configuracoes').classList.add('ativo');
    }
}

// SIDEBAR TOGGLE
window.toggleSidebar = function() {
    const sb = document.getElementById('sidebar');
    if(sb) sb.classList.toggle('open');
    const closeBtn = document.getElementById('close-sidebar-btn');
    if(sb && sb.classList.contains('open')) closeBtn.style.display = 'block';
    else if(closeBtn) closeBtn.style.display = 'none';
}

window.toggleSidebarIfMobile = function() {
        if(window.innerWidth <= 900) {
            toggleSidebar();
        }
}



window.carregarDashboard = async function() {
    const painel = document.getElementById('view-dashboard-panel');
    if(painel && painel.style.display === 'none') return;

    try {
        if(todosInscritos.length === 0) {
             console.log("Dashboard: Sem dados, solicitando carregamento...");
             await carregarDados(); 
             return; 
        }
        
        // 1. Atualizar contadores
        const total = todosInscritos.length;
        const certs = todosInscritos.filter(i => i.certificado_liberado).length;
        const pendentes = todosInscritos.filter(i => !i.confirmado && !i.excluido).length;
        
        document.getElementById('dash-total').innerText = total;
        document.getElementById('dash-certificados').innerText = certs;
        document.getElementById('dash-pendentes').innerText = pendentes;
        
        if(typeof Chart === 'undefined') return;

        // 2. PREPARAR DADOS
        
        // A) Categorias
        const cats = { 'Apresentador': 0, 'Ouvinte': 0, 'Monitor': 0, 'Supervisor': 0 };
        todosInscritos.forEach(i => { if(cats[i.tipo_participacao] !== undefined) cats[i.tipo_participacao]++; });
        
        // B) Status
        const stats = { 'Confirmados': 0, 'Pendentes': 0, 'Excluídos': 0 };
        todosInscritos.forEach(i => {
            if(i.excluido) stats['Excluídos']++;
            else if(i.confirmado) stats['Confirmados']++;
            else stats['Pendentes']++;
        });

        // C) Trabalhos Enviados (Apresentadores/Supervisores que têm titulo_trabalho)
        let trabEnviados = 0;
        let trabPendentes = 0;
        todosInscritos.forEach(i => {
            if (i.tipo_participacao === 'Apresentador' || i.tipo_participacao === 'Supervisor') {
                if (i.titulo_trabalho && i.titulo_trabalho.trim() !== "") trabEnviados++;
                else trabPendentes++;
            }
        });

        // D) Evolução (Data)
        const dates = {};
        todosInscritos.forEach(i => {
            let d = 'Recente';
            if(i.timestamp) d = new Date(i.timestamp).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'});
            else if(i.id && i.id.match(/^\d{13}/)) {
                 // Tenta extrair do ID (YYYYMMDD...)
                 const ano = i.id.substring(0,4);
                 const mes = i.id.substring(4,6);
                 const dia = i.id.substring(6,8);
                 d = `${dia}/${mes}`;
            }
            if(!dates[d]) dates[d] = 0;
            dates[d]++;
        });
        const sortedDates = Object.keys(dates).slice(-7); // Pegar as últimas 7 (?) ou ordenar. Como keys não é garantido ordem e IDs são strings... 
        // Simplificação: vamos confiar na ordem de inserção ou ordenar chaves se forem DD/MM
        sortedDates.sort(); 
        const dataEvolucao = sortedDates.map(d => dates[d]);

        // E) Top Instituições
        const instituicoes = {};
        todosInscritos.forEach(i => {
            if(i.onde_estuda) {
                const inst = i.onde_estuda.trim().toUpperCase(); // Normalizar
                // Pequena limpeza para agrupar (ex: IFAL - CANAPI -> IFAL) se quisesse, mas vamos bruto por enquanto
                if(!instituicoes[inst]) instituicoes[inst] = 0;
                instituicoes[inst]++;
            }
        });
        // Converter para array e ordenar
        const sortedInst = Object.entries(instituicoes).sort((a,b) => b[1] - a[1]).slice(0, 5); // Top 5
        const labelsInst = sortedInst.map(x => x[0]);
        const dataInst = sortedInst.map(x => x[1]);

        // 3. RENDERIZAR GRÁFICOS
        Chart.defaults.font.family = "'Poppins', sans-serif";
        Chart.defaults.color = '#64748b';

        // Destruir anteriores se existirem
        if(chartCategorias) chartCategorias.destroy();
        if(chartStatus) chartStatus.destroy();
        if(chartTrabalhos) chartTrabalhos.destroy();
        if(chartEvolucao) chartEvolucao.destroy();
        if(chartInstituicoes) chartInstituicoes.destroy();

        // -> Chart 1: Categorias (Doughnut)
        const ctx1 = document.getElementById('chart-categorias');
        if(ctx1) chartCategorias = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Apresentador', 'Ouvinte', 'Monitor', 'Supervisor'],
                datasets: [{
                    data: [cats['Apresentador'], cats['Ouvinte'], cats['Monitor'], cats['Supervisor']],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderWidth: 2, borderColor: '#ffffff'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } }
        });

        // -> Chart 2: Status (Doughnut)
        const ctx2 = document.getElementById('chart-status');
        if(ctx2) chartStatus = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Confirmados', 'Pendentes', 'Excluídos'],
                datasets: [{
                    data: [stats['Confirmados'], stats['Pendentes'], stats['Excluídos']],
                    backgroundColor: ['#6366f1', '#cbd5e1', '#ef4444'],
                    borderWidth: 2, borderColor: '#ffffff'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } }
        });

        // -> Chart 3: Trabalhos Entregues (Pie ou Bar) - Vamos de Pie para variar ou Bar horiz
        const ctxTrab = document.getElementById('chart-trabalhos');
        if(ctxTrab) chartTrabalhos = new Chart(ctxTrab, {
            type: 'pie',
            data: {
                labels: ['Enviados', 'Pendentes de Envio'],
                datasets: [{
                    data: [trabEnviados, trabPendentes],
                    backgroundColor: ['#8b5cf6', '#e2e8f0'],
                    borderWidth: 2, borderColor: '#ffffff'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } }, title: {display: true, text: 'Apenas Apresentadores/Supervisores'} } }
        });

        // -> Chart 4: Evolução (Line)
        const ctx3 = document.getElementById('chart-evolucao');
        if(ctx3) {
            const gradient = ctx3.getContext('2d').createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
            
            chartEvolucao = new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: sortedDates,
                    datasets: [{
                        label: 'Inscrições',
                        data: dataEvolucao,
                        backgroundColor: gradient, borderColor: '#3b82f6', borderWidth: 2,
                        pointBackgroundColor: '#fff', pointBorderColor: '#3b82f6', pointRadius: 4,
                        fill: true, tension: 0.4
                    }]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { borderDash: [5,5] } }, x: { grid: { display: false } } }
                }
            });
        }

        // -> Chart 5: Top Instituições (Bar Horizontal)
        const ctxInst = document.getElementById('chart-instituicoes');
        if(ctxInst) {
            chartInstituicoes = new Chart(ctxInst, {
                type: 'bar',
                data: {
                    labels: labelsInst,
                    datasets: [{
                        label: 'Inscritos',
                        data: dataInst,
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y', // Horizontal
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                        x: { 
                            beginAtZero: true,
                            ticks: { stepSize: 1, precision: 0 } 
                        } 
                    }
                }
            });
        }

    } catch(error) {
        console.error("Erro no Dashboard:", error);
    }
}
window.abrirMenuUsuario = function() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}
document.addEventListener('click', function(e) {
    const container = document.querySelector('.user-container');
    const menu = document.getElementById('dropdown-menu');
    if (container && !container.contains(e.target) && menu) menu.style.display = 'none';
});
window.alternarVisibilidadeSenha = function() {
    const campo = document.getElementById('senha-admin');
    const icone = document.getElementById('icone-olho');
    if (campo.type === "password") { campo.type = "text"; icone.innerText = "visibility_off"; } 
    else { campo.type = "password"; icone.innerText = "visibility"; }
}

// --- CARREGAMENTO DE DADOS ---
let unsubscribeInscritos = null;

window.carregarDados = function() {
    if(unsubscribeInscritos) return;

    const grid = document.getElementById('grid-cards'); if(!grid) return;
    document.getElementById('loader').style.display = "block"; 
    
    const q = collection(db, "inscricoes");
    unsubscribeInscritos = onSnapshot(q, (snap) => {
        todosInscritos = [];
        let cT=0, cA=0, cO=0, cM=0, cS=0;
        
        snap.forEach(doc => {
            const d = doc.data(); 
            const item = { id: doc.id, ...d, excluido: d.excluido || false };
            todosInscritos.push(item);
            
            if(!item.excluido) { 
                cT++; 
                if(d.tipo_participacao==="Apresentador") cA++; 
                else if(d.tipo_participacao==="Ouvinte") cO++; 
                else if(d.tipo_participacao==="Monitor") cM++; 
                else if(d.tipo_participacao==="Supervisor") cS++; 
            }
        });
        
        todosInscritos.sort((a,b) => b.id.localeCompare(a.id));

        document.getElementById('total-geral').innerText = cT; 
        document.getElementById('total-apresentadores').innerText = cA;
        document.getElementById('total-ouvintes').innerText = cO; 
        document.getElementById('total-monitores').innerText = cM;
        if(document.getElementById('total-supervisores')) document.getElementById('total-supervisores').innerText = cS;
        
        atualizarVisualizacao(); 
        document.getElementById('loader').style.display = "none";
        
        // Sempre tenta atualizar o dashboard se houver dados novos
        // A função carregarDashboard cuidará de verificar se os elementos existem
        if (typeof window.carregarDashboard === 'function') {
             carregarDashboard();
        }

    }, (error) => {
        console.error("Erro listener:", error);
        document.getElementById('loader').style.display = "none";
    });
}

// --- RENDERIZAÇÃO ---
function renderizarCards(lista) {
    const grid = document.getElementById('grid-cards'); 
    grid.innerHTML = "";
    
    if(lista.length === 0) { 
        grid.innerHTML = "<p>Nada encontrado.</p>"; 
        return; 
    }

    lista.forEach(i => {
        let badgesHtml = '';
        if (modoLixeira) {
            badgesHtml = `<div class='status-badge status-lixeira'>Excluído</div>`;
        } else {
            if (!i.confirmado) {
                badgesHtml += `<div class='status-badge status-pendente'>Pendente</div>`;
            } else {
                badgesHtml += `<div class='status-badge status-ok'>Inscrito</div>`;
            }
            if (i.certificado_liberado) {
                badgesHtml += `<div class='status-badge status-ok' style='background:#e0f2fe; color:#0284c7; border-color:#bae6fd;'>Certificado OK</div>`;
            }
        }

        const statusContainer = `<div style="display:flex; flex-wrap:wrap; gap:5px;">${badgesHtml}</div>`;

        let btns;
        if (modoLixeira) {
            btns = `<button class='btn-icon btn-restore' onclick="solicitarConfirmacao('restaurar','${i.id}')" title="Restaurar"><span class='material-symbols-rounded'>restore_from_trash</span></button>
                    <button class='btn-icon btn-forever' onclick="solicitarConfirmacao('excluir_permanente','${i.id}')" title="Excluir"><span class='material-symbols-rounded'>delete_forever</span></button>`;
        } else {
            const btnCert = `<button class='btn-icon' style='background:#f59e0b; color:white;' onclick="alternarCertificado('${i.id}', ${!i.certificado_liberado})" title="Autorizar/Bloquear Certificado"><span class='material-symbols-rounded'>workspace_premium</span></button>`;
            
            btns = `<button class='btn-icon btn-view' onclick="verDetalhes('${i.id}')"><span class='material-symbols-rounded'>visibility</span></button>
                    ${(i.tipo_participacao !== 'Ouvinte' && !i.confirmado) ? `<button class='btn-icon btn-confirm' onclick="solicitarConfirmacao('confirmar','${i.id}')"><span class='material-symbols-rounded'>check</span></button>` : ''}
                    ${btnCert} <button class='btn-icon btn-delete' onclick="solicitarConfirmacao('lixeira','${i.id}')"><span class='material-symbols-rounded'>delete</span></button>`;
        }
        
        grid.innerHTML += `<div class='card-pessoa tipo-${i.tipo_participacao} ${modoLixeira ? 'na-lixeira' : ''}'>
            <div class='card-header'><span class='protocolo'>#${i.protocolo || 'N/A'}</span><span class='card-tag tag-${i.tipo_participacao}'>${i.tipo_participacao}</span></div>
            <div class='card-body'><h3>${i.nome}</h3><p>${i.cpf}</p></div>
            <div class='card-footer'>
                ${statusContainer}
                <div style='display:flex'>${btns}</div>
            </div>
        </div>`;
    });
}

window.alternarCertificado = async function(id, estado) {
    try {
        await updateDoc(doc(db, "inscricoes", id), { certificado_liberado: estado });
        await registrarLog(estado ? "Liberou certificado" : "Bloqueou certificado", id);
        carregarDados();
    } catch(e) {
        mostrarAlerta("Erro", "Falha ao alterar status do certificado: " + e.message, "erro");
    }
}

// --- GALERIA E UPLOAD MÚLTIPLO ---
window.mostrarNomeArquivo = function() {
    const fileInput = document.getElementById('input-foto');
    const nomeDisplay = document.getElementById('nome-arquivo-selecionado');
    if(fileInput.files.length > 0) nomeDisplay.innerText = fileInput.files.length + " arquivo(s) selecionado(s)";
    else nomeDisplay.innerText = "";
}

window.fazerUploadFoto = async function() {
    const fileInput = document.getElementById('input-foto');
    const tituloInput = document.getElementById('foto-titulo');
    const btn = document.getElementById('btn-upload');
    const progresso = document.getElementById('progresso-upload');
    
    if (fileInput.files.length === 0) return mostrarAlerta("Atenção", "Selecione pelo menos uma imagem!", "erro");
    
    const files = fileInput.files;
    const tituloBase = tituloInput.value;
    btn.disabled = true;
    progresso.style.display = 'block';
    let sucessos = 0;

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const nomeArquivo = Date.now() + '-' + i + '-' + file.name;
            const storageRef = ref(storage, 'galeria/' + nomeArquivo);
            progresso.innerText = `Enviando arquivo ${i + 1} de ${files.length}...`;
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            await addDoc(collection(db, "galeria"), { 
                url: downloadURL, 
                caminho_storage: 'galeria/' + nomeArquivo, 
                titulo: files.length > 1 ? `${tituloBase} (${i + 1})` : tituloBase, 
                data_upload: new Date().toISOString() 
            });
            sucessos++;
        }
        await registrarLog("Upload de fotos", `Enviou ${sucessos} fotos (${tituloBase})`);
        mostrarAlerta("Concluído", `${sucessos} fotos enviadas com sucesso!`, "sucesso"); 
        fileInput.value = ""; tituloInput.value = ""; 
        document.getElementById('nome-arquivo-selecionado').innerText = ""; 
        carregarGaleria();
    } catch (error) { 
        console.error("Erro no upload:", error); mostrarAlerta("Erro", "Erro ao enviar foto: " + error.message, "erro");
    } finally { 
        btn.disabled = false; progresso.style.display = 'none'; progresso.innerText = "Enviando...";
    }
}

window.carregarGaleria = async function() {
    const grid = document.getElementById('grid-galeria'); const loader = document.getElementById('loader-galeria');
    grid.innerHTML = ""; loader.style.display = "block";
    try {
        let q = query(collection(db, "galeria"), orderBy("data_upload", "desc"));
        const querySnapshot = await getDocs(q);
        loader.style.display = "none";
        if (querySnapshot.empty) { grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Nenhuma foto na galeria.</p>"; return; }
        querySnapshot.forEach((doc) => {
            const foto = doc.data();
            const card = document.createElement('div'); card.className = 'card-foto';
            card.innerHTML = `<input type="checkbox" class="foto-chk" value="${doc.id}" data-path="${foto.caminho_storage}" onclick="atualizarContador()" style="position: absolute; top: 10px; left: 10px; z-index: 20; width: 22px; height: 22px; cursor: pointer; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                <button class="btn-delete-foto" onclick="deletarFoto('${doc.id}', '${foto.caminho_storage}')" title="Excluir Imagem"><span class="material-symbols-rounded">close</span></button>
                <div class="foto-img-container"><img src="${foto.url}" class="foto-img" alt="Foto" loading="lazy"></div>
                <div class="card-foto-body">
                    <div style="display:flex; gap:5px;">
                        <input type="text" id="input-legenda-${doc.id}" value="${foto.titulo || ''}" style="flex:1; font-size:0.8rem; border:1px solid #eee; border-radius:4px; padding:2px 5px;">
                        <button onclick="editarLegenda('${doc.id}')" style="background:var(--verde-sucesso); color:white; border:none; border-radius:4px; padding:2px 8px; cursor:pointer;"><span class="material-symbols-rounded" style="font-size:16px;">save</span></button>
                    </div>
                    <div class="card-foto-date">Enviada em: ${foto.data_upload ? new Date(foto.data_upload).toLocaleDateString() : 'Data N/A'}</div>
                </div>`;
            grid.appendChild(card);
        });
    } catch (error) { console.error(error); loader.innerText = "Erro ao carregar galeria."; }
}

window.selecionarTodas = function(source) {
    document.querySelectorAll('.foto-chk').forEach(c => c.checked = source.checked);
    atualizarContador();
}

window.atualizarContador = function() {
    const count = document.querySelectorAll('.foto-chk:checked').length;
    const btn = document.getElementById('btn-bulk-delete');
    const span = document.getElementById('count-sel');
    const chkAll = document.getElementById('chk-todos');
    
    span.innerText = count;
    btn.style.display = count > 0 ? 'flex' : 'none';
    
    const total = document.querySelectorAll('.foto-chk').length;
    if(total > 0 && count === total) chkAll.checked = true;
    else if(count < total) chkAll.checked = false;
}

window.solicitarExclusaoEmMassa = function() {
    const count = document.querySelectorAll('.foto-chk:checked').length;
    if(count === 0) return;
    acaoPendente = 'bulk_delete';
    document.getElementById('modal-confirmacao').style.display = 'flex';
    document.getElementById('confirm-title').innerText = "Excluir Múltiplos?";
    document.getElementById('confirm-text').innerText = `Você tem certeza que deseja excluir permanentemente ${count} fotos?`;
    document.getElementById('btn-confirm-action').classList.add('danger');
}

window.editarLegenda = async function(docId) {
    const novoTitulo = document.getElementById(`input-legenda-${docId}`).value;
    try {
        await updateDoc(doc(db, "galeria", docId), { titulo: novoTitulo });
        await registrarLog("Editou legenda", docId);
        mostrarAlerta("Salvo", "Legenda atualizada!", "sucesso");
    } catch (error) {
        console.error(error); mostrarAlerta("Erro", "Erro ao salvar.", "erro");
    }
}

// --- CALENDÁRIO LOGIC ---
window.salvarEvento = async function() {
    const data = document.getElementById('evt-data').value;
    const desc = document.getElementById('evt-desc').value;
    if(!data || !desc) return mostrarAlerta("Erro", "Preencha data e descrição.", "erro");

    try {
        const idEvento = "evt_" + Date.now();
        await setDoc(doc(db, "inscricoes", idEvento), {
            tipo: 'evento', 
            data: data, 
            descricao: desc, 
            timestamp: new Date().toISOString()
        });
        mostrarAlerta("Sucesso", "Evento adicionado!", "sucesso");
        document.getElementById('evt-desc').value = "";
        carregarEventos();
    } catch(e) { console.error(e); mostrarAlerta("Erro", "Falha ao salvar evento: " + e.message, "erro"); }
}

window.carregarEventos = async function() {
    const lista = document.getElementById('lista-eventos');
    const total = document.getElementById('total-eventos');
    lista.innerHTML = "Carregando...";
    try {
        const q = query(collection(db, "inscricoes"), where("tipo", "==", "evento"));
        const snap = await getDocs(q);
        total.innerText = snap.size;
        lista.innerHTML = "";
        if(snap.empty) { lista.innerHTML = "Nenhum evento."; return; }
        
        let eventos = [];
        snap.forEach(doc => eventos.push({id: doc.id, ...doc.data()}));
        
        eventos.sort((a,b) => a.data.localeCompare(b.data));

        eventos.forEach(d => {
            const dataFormatada = new Date(d.data + "T00:00:00").toLocaleDateString('pt-BR');
            lista.innerHTML += `
                <div style="background: white; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--azul-principal); box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div><strong>${dataFormatada}</strong> - ${d.descricao}</div>
                    <button onclick="deletarEvento('${d.id}')" style="background:none; border:none; color:var(--vermelho-erro); cursor:pointer;"><span class="material-symbols-rounded">delete</span></button>
                </div>
            `;
        });

    } catch(e) { lista.innerHTML = "Erro ao carregar."; }
}

window.deletarEvento = async function(id) {
    if(!confirm("Excluir evento?")) return;
    await deleteDoc(doc(db, "inscricoes", id));
    carregarEventos();
}

// --- VENCEDOR LOGIC ---
window.adicionarVencedor = async function() {
    const ano = document.getElementById('win-ano').value;
    const nome = document.getElementById('win-nome').value;
    const texto = document.getElementById('win-texto').value;
    const fileInput = document.getElementById('win-foto-input');
    const btn = document.getElementById('btn-save-winner');
    
    if(!ano || !nome || !texto) return mostrarAlerta("Erro", "Preencha Ano, Nome e Descrição.", "erro");
    if(fileInput.files.length === 0) return mostrarAlerta("Erro", "Selecione uma foto.", "erro");

    btn.disabled = true; btn.innerText = "Salvando...";
    
    try {
        const file = fileInput.files[0];
        const storageRef = ref(storage, 'vencedores/' + Date.now() + '_' + file.name);
        await uploadBytes(storageRef, file);
        const urlFoto = await getDownloadURL(storageRef);
        
        await addDoc(collection(db, "vencedores"), {
            ano: parseInt(ano),
            nome: nome,
            texto: texto,
            fotoUrl: urlFoto,
            criadoEm: new Date().toISOString()
        });
        
        mostrarAlerta("Sucesso", "Vencedor adicionado com sucesso!", "sucesso");
        
        document.getElementById('win-ano').value = "";
        document.getElementById('win-nome').value = "";
        document.getElementById('win-texto').value = "";
        document.getElementById('win-foto-input').value = "";
        
        carregarVencedorAdmin(); 
        
    } catch(e) { console.error(e); mostrarAlerta("Erro", "Erro ao salvar: " + e.message, "erro"); }
    finally { btn.disabled = false; btn.innerText = "SALVAR VENCEDOR"; }
}

window.carregarVencedorAdmin = async function() {
    const container = document.getElementById('lista-vencedores-admin');
    container.innerHTML = "Carregando...";
    try {
        const q = query(collection(db, "vencedores"), orderBy("ano", "desc"));
        const snap = await getDocs(q);
        
        container.innerHTML = "";
        if(snap.empty) {
            container.innerHTML = "<p>Nenhum vencedor cadastrado.</p>";
            return;
        }

        snap.forEach(doc => {
            const d = doc.data();
            container.innerHTML += `
                <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid var(--amarelo-alerta); position: relative;">
                    <div style="position: absolute; top: 15px; right: 15px;">
                        <button onclick="excluirVencedorId('${doc.id}')" style="background: #fee2e2; color: var(--vermelho-erro); border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">Excluir</button>
                    </div>
                    <h2 style="color: var(--azul-principal); font-size: 2rem; margin-bottom: 5px;">${d.ano}</h2>
                    <h4 style="margin-bottom: 10px; color: #555;">${d.nome}</h4>
                    <img src="${d.fotoUrl}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
                    <p style="font-size: 0.9rem; color: #666;">${d.texto}</p>
                </div>
            `;
        });

    } catch(e) { console.log(e); container.innerHTML = "Erro ao carregar lista."; }
}

window.excluirVencedorId = async function(id) {
    if(!confirm("Excluir este registro de vencedor?")) return;
    try {
        await deleteDoc(doc(db, "vencedores", id));
        await registrarLog("Excluiu Vencedor", id);
        carregarVencedorAdmin();
    } catch(e) { console.error(e); }
}

window.deletarFoto = async function(docId, caminhoStorage) {
    if(!confirm("Tem certeza que deseja excluir esta foto permanentemente?")) return;
    try {
        if(caminhoStorage) await deleteObject(ref(storage, caminhoStorage)).catch(e => console.log(e));
        await deleteDoc(doc(db, "galeria", docId)); 
        await registrarLog("Excluiu foto", docId);
        carregarGaleria();
    } catch(error) { console.error(error); mostrarAlerta("Erro", "Erro ao excluir imagem.", "erro"); }
}

// --- LOGS E MODAIS ---
window.abrirModalLogs = async function() {
    document.getElementById('modal-logs').style.display = 'flex';
    const tbody = document.getElementById('tbody-logs'); tbody.innerHTML = '';
    try {
        const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(10));
        const snap = await getDocs(q);
        snap.forEach(d => {
            const l = d.data();
            tbody.innerHTML += `<tr><td>${l.data}</td><td>${l.admin}</td><td>${l.acao}</td><td>${l.alvo_id}</td></tr>`;
        });
    } catch(e){ tbody.innerHTML = "<tr><td colspan='4'>Erro ao carregar logs</td></tr>"; }
}
window.abrirModalConfig = function() { document.getElementById('modal-config').style.display = 'flex'; }
window.solicitarConfirmacao = function(tipo, id) {
    idPendente = id; acaoPendente = tipo;
    const btn = document.getElementById('btn-confirm-action'); const txt = document.getElementById('confirm-title');
    document.getElementById('modal-confirmacao').style.display = 'flex';
    if(tipo === 'lixeira' || tipo === 'excluir_permanente') { btn.classList.add('danger'); txt.innerText = "Tem certeza?"; }
    else { btn.classList.remove('danger'); txt.innerText = "Confirmar?"; }
}
window.executarAcaoConfirmada = async function() {
    fecharModal('modal-confirmacao');
    try {
        if(acaoPendente === 'confirmar') {
                await updateDoc(doc(db,"inscricoes",idPendente),{confirmado:true});
                await registrarLog("Confirmou Inscrição", idPendente);
        }
        else if(acaoPendente === 'lixeira') {
                await updateDoc(doc(db,"inscricoes",idPendente),{excluido:true});
                await registrarLog("Moveu para lixeira", idPendente);
        }
        else if(acaoPendente === 'restaurar') {
                await updateDoc(doc(db,"inscricoes",idPendente),{excluido:false});
                await registrarLog("Restaurou da lixeira", idPendente);
        }
        else if(acaoPendente === 'excluir_permanente') {
                await deleteDoc(doc(db,"inscricoes",idPendente));
                await registrarLog("Excluiu permanentemente", idPendente);
        }
        else if(acaoPendente === 'bulk_delete') {
            const chks = document.querySelectorAll('.foto-chk:checked');
            let deletados = 0;
            const btn = document.getElementById('btn-confirm-action');
            btn.innerText = "Excluindo...";
            
            for (const chk of chks) {
                const id = chk.value;
                const path = chk.getAttribute('data-path');
                try {
                    if(path && path !== 'undefined') await deleteObject(ref(storage, path)).catch(e => console.log('Erro storage:', e));
                    await deleteDoc(doc(db, "galeria", id));
                    deletados++;
                } catch(e) { console.error('Erro delete:', e); }
            }
            await registrarLog("Exclusão Disponível", `Excluiu ${deletados} fotos em massa`);
            mostrarAlerta("Concluído", `${deletados} fotos foram excluídas.`, "sucesso");
            carregarGaleria();
            document.getElementById('chk-todos').checked = false;
            document.getElementById('btn-bulk-delete').style.display = 'none';
            btn.innerText = "Sim, Confirmar"; // Reset
        }
        carregarDados();
    } catch(e) { mostrarAlerta("Erro", "Erro na ação: " + e.message, "erro"); }
}
window.verDetalhes = function(id) {
    const i = todosInscritos.find(x => x.id === id);
    
    let htmlTrabalho = '';
    if (i.titulo_trabalho || i.tema_trabalho) {
        htmlTrabalho = `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                <h3 style="color: var(--azul-principal); font-size: 1.1rem; margin-bottom: 10px;">Dados do Trabalho</h3>
                <p><strong>Título:</strong> ${i.titulo_trabalho || '---'}</p>
                <p><strong>Tema:</strong> ${i.tema_trabalho || '---'}</p>
                <p style="margin-top: 10px;"><strong>Resumo:</strong></p>
                <div style="background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; max-height: 200px; overflow-y: auto; font-size: 0.9rem; color: #555; white-space: pre-wrap;">${i.resumo_trabalho || '---'}</div>
                ${i.data_submissao ? `<p style="margin-top:10px;"><small style="color: #999;">Enviado em: ${i.data_submissao}</small></p>` : ''}
            </div>
        `;
    }

    document.getElementById('modal-body').innerHTML = `
        <h2 style="color: var(--azul-escuro); margin-bottom: 15px;">${i.nome}</h2>
        <div style="display: grid; gap: 8px; color: #444;">
            <p><strong>Tipo:</strong> <span class="card-tag tag-${i.tipo_participacao}">${i.tipo_participacao}</span></p>
            <p><strong>CPF:</strong> ${i.cpf}</p>
            <p><strong>Email:</strong> ${i.email || 'Não informado'}</p>
            <p><strong>Instituição:</strong> ${i.onde_estuda}</p>
            <p><strong>Protocolo:</strong> ${i.protocolo || '---'}</p>
        </div>
        ${htmlTrabalho}
    `;
    document.getElementById('modal-detalhes').style.display = 'flex';
}
window.fecharModal = (id) => document.getElementById(id).style.display = 'none';
window.alternarModoLixeira = function() { modoLixeira = !modoLixeira; atualizarVisualizacao(); }
window.filtrar = (tipo, btn) => { 
    document.querySelectorAll('.btn-filtro').forEach(x => x.classList.remove('ativo')); 
    btn.classList.add('ativo'); 
    filtroAtual = tipo; atualizarVisualizacao(); 
}
window.atualizarVisualizacao = function() { 
    let listaFiltrada = todosInscritos.filter(i => modoLixeira ? i.excluido : !i.excluido);
    if (!modoLixeira) {
        if (filtroAtual === 'confirmados') listaFiltrada = listaFiltrada.filter(i => i.confirmado);
        else if (filtroAtual !== 'todos') listaFiltrada = listaFiltrada.filter(i => i.tipo_participacao === filtroAtual);
    }
    renderizarCards(listaFiltrada); 
    const tL = document.getElementById('titulo-grid'); if(tL) tL.style.display = modoLixeira ? 'block' : 'none';
}
window.abrirModalRelatorios = () => document.getElementById('modal-relatorios').style.display = 'flex';
window.gerarRelatorio = function(tipo) {
    const area = document.getElementById('area-impressao');
    let listaParaImprimir = todosInscritos.filter(i => !i.excluido);
    let tituloRelatorio = "Lista Geral de Presença";
    
    if (tipo === 'lista_presenca') {
        listaParaImprimir = listaParaImprimir.filter(i => i.tipo_participacao === 'Apresentador');
        tituloRelatorio = "Lista de Presença - Apresentadores";
    }
    else if (tipo === 'lista_apresentadores') {
        listaParaImprimir = listaParaImprimir.filter(i => i.tipo_participacao === 'Apresentador');
        tituloRelatorio = "Relatório de Apresentadores de Projetos";
    }
    // REMOVIDO: img src="ufal.webp"
    let html = `<div class="print-header"><img src="assets/pibid.webp" style="height:70px"></div>
        <div style="text-align:center; margin-bottom:20px;"><h2>${tituloRelatorio}</h2><p>Feira da Matemática - PIBID UFAL | Data: ${new Date().toLocaleDateString()}</p></div>
        <table class="relatorio-oficial"><thead><tr><th>Nome do Participante</th><th>CPF</th><th>Escola de Origem</th><th>Projeto / Função</th><th style="width:150px">Assinatura</th></tr></thead><tbody>`;
    listaParaImprimir.forEach(i => {
        html += `<tr><td>${i.nome}</td><td>${i.cpf}</td><td>${i.onde_estuda || '---'}</td><td>${i.nome_projeto || i.tipo_participacao}</td><td></td></tr>`;
    });
    html += `</tbody></table><p style="font-size:9px; margin-top:20px; font-style:italic;">Documento emitido em ${new Date().toLocaleString()} - Sistema de Gestão PIBID</p>`;
    area.innerHTML = html;
    fecharModal('modal-relatorios');
    setTimeout(() => { window.print(); }, 500);
};

// --- FUNÇÕES DE GERENCIAMENTO DE NOTÍCIAS ---
window.abrirModalNoticia = function() {
    limparFormNoticia(); 
    document.getElementById('modal-noticia').style.display = 'flex';
}
window.fecharModalNoticia = function() {
    document.getElementById('modal-noticia').style.display = 'none';
}

window.filtrarNoticias = function() {
    const termo = document.getElementById('busca-noticias').value.toLowerCase();
    const container = document.getElementById('lista-noticias');
    
    const linhas = Array.from(container.children);
    
    linhas.forEach(linha => {
        if (linha.innerText.includes('Nenhuma notícia encontrada')) return;

        const titulo = linha.querySelector('h4')?.innerText.toLowerCase() || '';
        const resumo = linha.querySelector('p')?.innerText.toLowerCase() || '';
        
        if (titulo.includes(termo) || resumo.includes(termo)) {
            linha.style.display = 'grid'; 
        } else {
            linha.style.display = 'none';
        }
    });
}

window.carregarNoticias = async function() {
    const lista = document.getElementById('lista-noticias');
    const contador = document.getElementById('total-noticias');
    lista.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #94a3b8;">
            <span class="material-symbols-rounded" style="font-size: 2rem; display: block; margin-bottom: 10px; animation: spin 1s linear infinite;">sync</span>
            Carregando lista...
            <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
        </div>
    `;
    
    try {
        const q = query(collection(db, "noticias"), orderBy("data", "desc"));
        const snap = await getDocs(q);
        
        lista.innerHTML = '';
        contador.innerText = snap.size;
        
        if (snap.empty) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; border: 2px dashed #e2e8f0; border-radius: 12px; color: #94a3b8;">
                    <span class="material-symbols-rounded" style="font-size: 3rem; margin-bottom: 10px; display: block;">post_add</span>
                    <p>Nenhuma notícia encontrada.</p>
                    <button onclick="abrirModalNoticia()" style="margin-top: 15px; color: var(--azul-principal); font-weight: bold; background: none; border: none; cursor: pointer;">+ Criar a primeira notícia</button>
                </div>
            `;
            return;
        }
        
        snap.forEach(doc => {
            const n = doc.data();
            const dataFormatada = n.data ? new Date(n.data).toLocaleDateString('pt-BR') : '--/--/----';
            
            const tituloEscapado = n.titulo.replace(/'/g, "\\'");
            const subtituloEscapado = n.subtitulo ? n.subtitulo.replace(/'/g, "\\'").replace(/\n/g, "\\n") : '';
            const descEscapada = n.descricao ? n.descricao.replace(/'/g, "\\'").replace(/\n/g, "\\n") : '';
            const imgUrl = n.imagem_url || '';
            const caminhoStorage = n.caminho_storage || '';
            
            let imagemHtml = '';
            if (n.imagem_url) {
                imagemHtml = `<img src="${n.imagem_url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">`;
            } else {
                imagemHtml = `<div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #cbd5e1;"><span class="material-symbols-rounded">image</span></div>`;
            }

            const linha = `
                <div style="display: grid; grid-template-columns: 80px 1fr 150px 100px; gap: 15px; align-items: center; padding: 15px; background: white; border-radius: 10px; border: 1px solid #f1f5f9; transition: all 0.2s hover;">
                    <div style="display: flex; justify-content: center;">
                        ${imagemHtml}
                    </div>
                    
                    <div style="overflow: hidden;">
                        <h4 style="color: var(--azul-escuro); font-size: 0.95rem; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${n.titulo}</h4>
                        <p style="color: #64748b; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${n.subtitulo || n.descricao || 'Sem descrição'}</p>
                    </div>
                    
                    <div style="font-size: 0.9rem; color: #475569; font-variant-numeric: tabular-nums;">
                        <span class="material-symbols-rounded" style="vertical-align: middle; font-size: 1rem; margin-right: 5px; color: #94a3b8;">calendar_today</span>
                        ${dataFormatada}
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 5px;">
                        <button onclick="editarNoticia('${doc.id}', '${tituloEscapado}', '${subtituloEscapado}', '${descEscapada}', '${n.data}', '${imgUrl}', '${caminhoStorage}')" class="btn-icon" style="background: #fef3c7; color: #d97706; width: 35px; height: 35px;" title="Editar">
                            <span class="material-symbols-rounded" style="font-size: 1.1rem;">edit</span>
                        </button>
                        <button onclick="deletarNoticia('${doc.id}', '${caminhoStorage}')" class="btn-icon btn-delete" style="width: 35px; height: 35px;" title="Excluir">
                            <span class="material-symbols-rounded" style="font-size: 1.1rem;">delete</span>
                        </button>
                    </div>
                </div>
            `;
            lista.innerHTML += linha;
        });
        
    } catch(e) {
        console.error("Erro ao carregar notícias:", e);
        lista.innerHTML = '<p style="color: var(--vermelho-erro); padding: 20px;">Erro ao carregar lista de notícias.</p>';
    }
}

window.editarNoticia = function(id, titulo, subtitulo, descricao, data, imagemUrl, caminhoStorage) {
    limparFormNoticia(); 
    
    document.getElementById('noticia-id-edicao').value = id;
    document.getElementById('noticia-img-atual').value = imagemUrl || '';
    
    document.getElementById('titulo-modal-noticia').innerHTML = '<span class="material-symbols-rounded">edit_document</span> Editando Notícia';
    document.getElementById('noticia-titulo').value = titulo;
    document.getElementById('noticia-subtitulo').value = subtitulo || ''; 
    document.getElementById('noticia-descricao').value = descricao;
    document.getElementById('noticia-data').value = data;
    
    const btn = document.getElementById('btn-save-noticia');
    btn.innerText = "SALVAR ALTERAÇÕES";
    
    document.getElementById('modal-noticia').style.display = 'flex';
}

window.salvarNoticia = async function() {
    const idEdicao = document.getElementById('noticia-id-edicao').value;
    const titulo = document.getElementById('noticia-titulo').value.trim();
    const subtitulo = document.getElementById('noticia-subtitulo').value.trim();
    const descricao = document.getElementById('noticia-descricao').value.trim();
    const data = document.getElementById('noticia-data').value;
    const imagemInput = document.getElementById('noticia-imagem');
    const imgAtual = document.getElementById('noticia-img-atual').value;
    const btn = document.getElementById('btn-save-noticia');

    if(!titulo || !descricao || !data) {
        mostrarAlerta("Campos Obrigatórios", "Por favor, preencha o título, o conteúdo completo e a data da notícia.", "erro");
        return;
    }
    
    btn.disabled = true;
    const textoOriginal = btn.innerText;
    btn.innerHTML = '<span class="material-symbols-rounded" style="animation: spin 1s infinite; font-size: 1.2rem;">sync</span> Processando...';
    
    try {
        let imagemUrl = imgAtual;
        let caminhoStorage = ''; 
        
        if (!idEdicao) imagemUrl = ''; 

        if(imagemInput.files.length > 0) {
            const file = imagemInput.files[0];
            const nomeArquivo = Date.now() + '-' + file.name;
            const storageRef = ref(storage, 'noticias/' + nomeArquivo);
            await uploadBytes(storageRef, file);
            imagemUrl = await getDownloadURL(storageRef);
            caminhoStorage = 'noticias/' + nomeArquivo;
        }
        
        const dadosNoticia = {
            titulo: titulo,
            subtitulo: subtitulo, 
            descricao: descricao,
            data: data,
            imagem_url: imagemUrl
        };

        if (caminhoStorage) dadosNoticia.caminho_storage = caminhoStorage;
        
        if (idEdicao) {
            const docRef = doc(db, "noticias", idEdicao);
            await updateDoc(docRef, dadosNoticia);
            await registrarLog("Atualizou notícia", titulo);
            mostrarAlerta("Sucesso", "Notícia atualizada com sucesso!", "sucesso");
        } else {
            dadosNoticia.data_criacao = new Date().toISOString();
            await addDoc(collection(db, "noticias"), dadosNoticia);
            await registrarLog("Criou notícia", titulo);
            mostrarAlerta("Sucesso", "Notícia criada com sucesso!", "sucesso");
        }
        
        fecharModalNoticia();
        carregarNoticias();
        
    } catch(e) {
        console.error("Erro ao salvar:", e);
        mostrarAlerta("Erro Técnico", e.message, "erro");
    } finally {
        btn.disabled = false;
        btn.innerText = textoOriginal;
    }
}

// --- MENSAGENS LOGIC ---
window.carregarMensagens = async function() {
    const lista = document.getElementById('lista-mensagens');
    const loader = document.getElementById('loader-mensagens');
    const badge = document.getElementById('badge-mensagens-novas');
    
    lista.innerHTML = "";
    loader.style.display = "block";
    
    try {
        const q = query(collection(db, "mensagens"), orderBy("data", "desc"));
        const snap = await getDocs(q);
        loader.style.display = "none";
        
        let novasCount = 0;
        
        if (snap.empty) {
            lista.innerHTML = "<p style='text-align:center; padding: 20px; color: #64748b;'>Nenhuma mensagem recebida.</p>";
            badge.style.display = "none";
            return;
        }

        snap.forEach(docSnap => {
            const m = docSnap.data();
            if (!m.lida) novasCount++;
            
            const dataFormatada = new Date(m.data).toLocaleString('pt-BR');
            
            const card = `
                <div class="card-padrao" style="border-left: 5px solid ${m.lida ? '#cbd5e1' : 'var(--azul-claro)'}; padding: 20px; position: relative; background: ${m.lida ? '#f8fafc' : 'white'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <h4 style="margin: 0; color: var(--azul-escuro); font-size: 1.1rem;">${m.nome}</h4>
                            <p style="margin: 2px 0; color: var(--azul-claro); font-size: 0.85rem; font-weight: 600;">WhatsApp: ${m.contato || m.email}</p>
                        </div>
                        <span style="font-size: 0.75rem; color: #94a3b8;">${dataFormatada}</span>
                    </div>
                    <div style="background: ${m.lida ? 'transparent' : '#f1f5f9'}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #334155; line-height: 1.5; font-size: 0.95rem;">${m.mensagem}</p>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        ${!m.lida ? `<button class="btn-padrao" style="height: 35px; min-width: auto; padding: 0 15px; font-size: 0.8rem; background: var(--azul-claro); color: white; border: none;" onclick="marcarLida('${docSnap.id}')"><span class="material-symbols-rounded" style="font-size: 18px;">done_all</span> Marcar como Lida</button>` : ''}
                        <button class="btn-trash-view" style="height: 35px; min-width: auto; padding: 0 15px; font-size: 0.8rem;" onclick="deletarMensagem('${docSnap.id}')"><span class="material-symbols-rounded" style="font-size: 18px;">delete</span> Excluir</button>
                    </div>
                </div>
            `;
            lista.innerHTML += card;
        });
        
        if (novasCount > 0) {
            badge.innerText = novasCount > 9 ? "9+" : novasCount;
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }

    } catch(e) {
        console.error(e);
        lista.innerHTML = "<p style='color: var(--vermelho-erro); text-align:center;'>Erro ao carregar mensagens.</p>";
    } finally {
        loader.style.display = "none";
    }
}

window.marcarLida = async function(id) {
    try {
        await updateDoc(doc(db, "mensagens", id), { lida: true });
        carregarMensagens();
    } catch(e) { console.error(e); }
}

window.deletarMensagem = async function(id) {
    if (!confirm("Excluir esta mensagem permanentemente?")) return;
    try {
        await deleteDoc(doc(db, "mensagens", id));
        carregarMensagens();
        await registrarLog("Excluiu mensagem", id);
    } catch(e) { console.error(e); }
}

window.limparFormNoticia = function() {
    document.getElementById('noticia-id-edicao').value = '';
    document.getElementById('noticia-img-atual').value = '';
    document.getElementById('titulo-modal-noticia').innerHTML = '<span class="material-symbols-rounded">article</span> Nova Notícia';
    document.getElementById('noticia-titulo').value = '';
    document.getElementById('noticia-subtitulo').value = '';
    document.getElementById('noticia-descricao').value = '';
    document.getElementById('noticia-data').value = '';
    document.getElementById('noticia-imagem').value = '';
    
    const btn = document.getElementById('btn-save-noticia');
    btn.innerText = "PUBLICAR NOTÍCIA";
}
