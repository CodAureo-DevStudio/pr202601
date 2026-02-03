import { collection, addDoc, getDocs, updateDoc, doc, query, where, getDoc, setDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { db, storage } from "../config.js";

// --- NAVEGAÇÃO ---
window.navegar = function(idPagina) {
    const paginas = document.querySelectorAll('.pagina-conteudo');
    paginas.forEach(pag => pag.classList.remove('ativa'));
    
    const botoes = document.querySelectorAll('nav ul li a');
    botoes.forEach(btn => btn.classList.remove('menu-ativo'));
    
    const paginaAlvo = document.getElementById(idPagina);
    if (paginaAlvo) paginaAlvo.classList.add('ativa');
    
    const botaoAlvo = document.getElementById('btn-' + idPagina);
    if (botaoAlvo) botaoAlvo.classList.add('menu-ativo');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger loads for specific pages
    if (idPagina === 'resultados') carregarResultados();
    if (idPagina === 'galeria') carregarGaleria();
};

window.verificarFormulario = function() {
    const nome = document.getElementById('inp-nome');
    const cpf = document.getElementById('inp-cpf');
    const fone = document.getElementById('inp-fone');
    const email = document.getElementById('inp-email');
    const inst = document.getElementById('inp-inst');
    const tipo = document.getElementById('inp-tipo');
    const btnConfirmar = document.getElementById('btn-confirmar-inscricao');
    const divEmail = document.getElementById('div-email');
    
    if (!nome) return;

    // Monitor deve ter email visível, os outros é opcional mas o campo existe
    // Monitor E Supervisor devem ter email visível
    const tagEmailReq = document.getElementById('tag-email-req');
    
    if (tipo.value === "Monitor" || tipo.value === "Supervisor") { 
        divEmail.style.display = "block"; 
        if(tagEmailReq) tagEmailReq.style.display = "inline-block";
    } else { 
        divEmail.style.display = "block"; 
        if(tagEmailReq) tagEmailReq.style.display = "none";
    }

    // --- REGRAS ESPECIAIS DE INTERFACE ---
    const blocoSubmissao = document.getElementById('bloco-submissao');
    const msgAviso = document.getElementById('msg-aviso');
    const btnEnviarTrabalho = document.querySelector('#form-trabalho .btn-acao');

    if (tipo.value === "Supervisor") {
        // Supervisor: Libera Imediatamente a área de trabalho
        if(blocoSubmissao) blocoSubmissao.classList.remove('bloqueado');
        if(msgAviso) msgAviso.style.display = 'none';
        // Esconde botão "Enviar Trabalho" pois Supervisor envia tudo no botão principal
        if(btnEnviarTrabalho) btnEnviarTrabalho.style.display = 'none';
        
    } else {
        // Outros: Mantém bloqueado até confirmar (regra padrão)
        if(blocoSubmissao && !idUsuarioAtual) {
            blocoSubmissao.classList.add('bloqueado');
            if(msgAviso) msgAviso.style.display = 'block';
        }
        // Exibe botão normal para Apresentadores (para usar depois)
        if(btnEnviarTrabalho) btnEnviarTrabalho.style.display = 'flex';
    }

    // --- REGRAS DE VALIDAÇÃO ---
    // 1. Campos Básicos Obrigatórios para TODOS
    const nomeOk = nome.value.trim() !== "";
    const foneOk = fone.value.trim() !== "";
    const instOk = inst.value.trim() !== "";
    const tipoOk = tipo.value !== "";

    // 2. Regras Específicas
    let extraOk = true;

    if (tipo.value === "Monitor") {
        // Monitor: Email Obrigatório
        if (email.value.trim() === "") extraOk = false;
    } else if (tipo.value === "Supervisor") {
        // Supervisor: TUDO Obrigatório (CPF e Email inclusos) + DADOS DO TRABALHO
        const cpfOk = cpf.value.trim() !== "";
        const emailSupOk = email.value.trim() !== "";
        
        // Validação dos Campos de Trabalho (Supervisores enviam tudo junto)
        const tituloTrab = document.getElementById('inp-titulo-trab');
        const temaTrab = document.getElementById('inp-tema-trab');
        const resumoTrab = document.getElementById('inp-resumo-trab');
        
        const trabOk = tituloTrab.value.trim() !== "" && 
                       temaTrab.value.trim() !== "" && 
                       resumoTrab.value.trim() !== "";

        if (!cpfOk || !emailSupOk || !trabOk) extraOk = false;
    }

    let formularioValido = nomeOk && foneOk && instOk && tipoOk && extraOk;

    [nome, cpf, fone, email, inst, tipo].forEach(campo => {
        if(campo && campo.value.trim() !== "") campo.classList.add('campo-preenchido');
        else if(campo) campo.classList.remove('campo-preenchido');
    });

    if (formularioValido) {
        btnConfirmar.style.opacity = "1";
        btnConfirmar.style.pointerEvents = "auto";
        btnConfirmar.innerHTML = "<span>CONFIRMAR INSCRIÇÃO</span><span class='material-symbols-rounded'>check_circle</span>";
    } else {
        btnConfirmar.style.opacity = "0.5";
        btnConfirmar.style.pointerEvents = "none";
        // Feedback mais simples
        btnConfirmar.innerText = "Preencha os campos obrigatórios (*)";
    }
    // Limpeza de código duplicado
};

// --- MODAIS ---
window.exibirModal = function(tipo, titulo, mensagem, protocolo = null) {
    const modal = document.getElementById('modal-global');
    const box = document.getElementById('modal-box-style');
    const icon = document.getElementById('modal-icon');
    const tit = document.getElementById('modal-titulo');
    const msg = document.getElementById('modal-msg');
    const protContainer = document.getElementById('modal-protocolo-container');

    box.className = 'modal-box';
    
    if (tipo === 'sucesso') {
        box.classList.add('tipo-sucesso');
        icon.innerText = 'check_circle';
        icon.style.color = 'var(--verde-sucesso)';
    } else if (tipo === 'erro') {
        box.classList.add('tipo-erro');
        icon.innerText = 'error';
        icon.style.color = 'var(--vermelho-erro)';
    } else {
        icon.innerText = 'info';
        icon.style.color = 'var(--azul-principal)';
    }

    tit.innerText = titulo;
    msg.innerText = mensagem;

    if (protocolo) {
        protContainer.style.display = 'block';
        protContainer.innerHTML = `<div class="protocolo-box">PROTOCOLO: ${protocolo}</div><small>Salve este número!</small>`;
    } else {
        protContainer.style.display = 'none';
    }
    modal.style.display = 'flex';
};

window.fecharModal = function() { document.getElementById('modal-global').style.display = 'none'; };

window.abrirImagem = function(url, legenda) {
    const modalImg = document.getElementById('modal-imagem-overlay');
    const img = document.getElementById('img-ampliada');
    const caption = document.getElementById('caption-ampliada');
    img.src = url;
    caption.innerText = legenda || '';
    modalImg.style.display = 'flex';
};

window.fecharModalImagem = function(e) {
    if (e.target.id === 'modal-imagem-overlay' || e.target.classList.contains('btn-fechar-img')) {
        document.getElementById('modal-imagem-overlay').style.display = 'none';
        document.getElementById('img-ampliada').src = '';
    }
};

window.mudarPlaceholder = function() {
    const radio = document.querySelector('input[name="tipo-busca"]:checked');
    if (!radio) return;
    const tipo = radio.value;
    const input = document.getElementById('cert-input');
    if(tipo === 'cpf') {
        input.placeholder = "000.000.000-00";
    } else {
        input.placeholder = "Digite seu Nome Completo";
    }
};

// --- CALENDÁRIO ---
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let date = new Date(), currYear = 2026, currMonth = 0; 
window.eventosCache = [];

window.renderCalendar = function() {
    const daysTag = document.querySelector(".days");
    const currentDate = document.querySelector(".current-date");
    if (!daysTag || !currentDate) return;

    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), 
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), 
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), 
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); 
    
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) { liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`; }
    
    for (let i = 1; i <= lastDateofMonth; i++) { 
        let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        
        let eventoDia = window.eventosCache.find(e => {
            const thisDateStr = `${currYear}-${String(currMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            return e.data === thisDateStr;
        });
        
        let extraClass = "";
        if(eventoDia) {
            const dataEvento = new Date(eventoDia.data + "T23:59:59"); 
            const hoje = new Date();
            const hojeZerado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const eventoZerado = new Date(dataEvento.getFullYear(), dataEvento.getMonth(), dataEvento.getDate());

            if(eventoZerado < hojeZerado) {
                extraClass = "event-past";
            } else {
                extraClass = "event-future";
            }
        }
        
        let titleAttr = eventoDia ? `title="${eventoDia.descricao}"` : "";
        liTag += `<li class="${isToday} ${extraClass}" ${titleAttr} style="position:relative; display:flex; justify-content:center; align-items:center; flex-direction:column;">${i}</li>`; 
    }
    
    for (let i = lastDayofMonth; i < 6; i++) { liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>` }
    
    currentDate.innerText = `${months[currMonth]} ${currYear}`; 
    daysTag.innerHTML = liTag;

    const listaDiv = document.getElementById('lista-eventos-mes');
    if(listaDiv) {
        listaDiv.innerHTML = "";
        const eventosMes = window.eventosCache.filter(e => {
            const parts = e.data.split('-'); 
            return parseInt(parts[0]) === currYear && (parseInt(parts[1]) - 1) === currMonth;
        });
        
        if(eventosMes.length === 0) {
             listaDiv.innerHTML = '<p style="color: #999; font-size: 0.85rem; font-style: italic;">Nenhum evento programado para este mês.</p>';
        } else {
            eventosMes.sort((a,b) => a.data.localeCompare(b.data));
            eventosMes.forEach(e => {
                const parts = e.data.split('-');
                const dataEvento = new Date(e.data + "T23:59:59");
                const hoje = new Date();
                const hojeZerado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                const eventoZerado = new Date(dataEvento.getFullYear(), dataEvento.getMonth(), dataEvento.getDate());
                let corTexto = (eventoZerado < hojeZerado) ? "#ef4444" : "#22c55e";
                listaDiv.innerHTML += `<div class="event-item-list"><span style="color:${corTexto}; font-weight:bold;">Dia ${parts[2]}:</span> ${e.descricao}</div>`;
            });
        }
    }
};

window.initCalendar = function() {
    const prevNextIcon = document.querySelectorAll(".icons span");
    prevNextIcon.forEach(icon => { 
        icon.addEventListener("click", () => { 
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1; 
            if(currMonth < 0 || currMonth > 11) { 
                let d = new Date(currYear, currMonth, new Date().getDate()); 
                currYear = d.getFullYear(); 
                currMonth = d.getMonth(); 
            } 
            window.renderCalendar(); 
        }); 
    });
    window.renderCalendar();
};

// --- FIREBASE FETCH FUNCTIONS ---
window.fetchEventos = async () => {
    try {
        const q = query(collection(db, "inscricoes"), where("tipo", "==", "evento"));
        const snap = await getDocs(q);
        window.eventosCache = [];
        snap.forEach(d => { window.eventosCache.push(d.data()); });
        window.renderCalendar(); 
    } catch(e) { console.log("Erro calendar:", e); }
};

window.carregarGaleria = async function() {
    const container = document.getElementById('galeria-container');
    if (!container) return;
    try {
        let q;
        try { q = query(collection(db, "galeria"), orderBy("data_upload", "desc")); } 
        catch(e) { q = collection(db, "galeria"); }
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">Nenhuma foto publicada na galeria ainda.</p>`;
            return;
        }
        container.innerHTML = ''; 
        querySnapshot.forEach((doc) => {
            const dados = doc.data();
            if(dados.url) {
                container.innerHTML += `
                    <div class="galeria-card" onclick="abrirImagem('${dados.url}', '${dados.titulo || ''}')">
                        <img src="${dados.url}" alt="${dados.titulo || 'Foto'}" class="galeria-img">
                        <div class="galeria-legenda">${dados.titulo || 'Sem legenda'}</div>
                    </div>
                `;
            }
        });
    } catch (erro) {
        console.error("Erro na galeria:", erro);
        container.innerHTML = '<p style="color: var(--vermelho-erro); text-align:center; grid-column: 1/-1;">Erro ao carregar imagens.</p>';
    }
};

window.carregarResultados = async function() {
    const container = document.getElementById('grid-vencedores');
    const loader = document.getElementById('loading-vencedores');
    if(!container) return;
    container.innerHTML = "";
    if(loader) loader.style.display = "block";
    try {
        const q = query(collection(db, "vencedores"), orderBy("ano", "desc"));
        const snap = await getDocs(q);
        if(loader) loader.style.display = "none";
        if (snap.empty) {
            container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color: #666;">A galeria de campeões está sendo atualizada.</p>`;
            return;
        }
        snap.forEach(doc => {
            const d = doc.data();
            container.innerHTML += `
                <div class="card-projeto" style="text-align: left; padding: 0; overflow: hidden; border-radius: 12px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.08); transition: transform 0.3s ease;">
                    <div style="position: relative; height: 220px; overflow: hidden;">
                        <div style="background-image: url('${d.fotoUrl}'); background-size: cover; background-position: center; height: 100%; width: 100%; transition: transform 0.5s;"></div>
                        <div style="position: absolute; top: 15px; right: 15px; background: var(--amarelo-alerta); color: #333; font-weight: 800; padding: 5px 15px; border-radius: 20px; font-size: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                            ${d.ano}
                        </div>
                    </div>
                    <div style="padding: 30px 25px;">
                        <h4 style="margin-bottom: 10px; color: var(--azul-principal); font-size: 1.25rem; font-weight: 700;">${d.nome}</h4>
                        <div style="width: 50px; height: 4px; background: var(--azul-claro); margin-bottom: 15px; border-radius: 2px;"></div>
                        <p style="font-size: 0.95rem; color: #555; line-height: 1.6;">${d.texto}</p>
                    </div>
                </div>
            `;
        });
    } catch(e) {
        console.error(e);
        if(loader) loader.style.display = "none";
        container.innerHTML = `<p style="color:red; text-align:center;">Não foi possível carregar a galeria.</p>`;
    }
};

window.gerarCertificado = async function() {
    const tipoBusca = document.querySelector('input[name="tipo-busca"]:checked').value;
    const valorInput = document.getElementById('cert-input').value.trim();
    const btn = document.getElementById('btn-emitir-cert');

    if(!valorInput) {
        exibirModal('erro', 'Campo Obrigatório', 'Digite o CPF ou o Nome para buscar.');
        return;
    }

    btn.innerText = "Verificando...";
    btn.disabled = true;

    try {
        let q;
        if (tipoBusca === 'cpf') {
            q = query(collection(db, "inscricoes"), where("cpf", "==", valorInput));
        } else {
            q = query(collection(db, "inscricoes"), where("nome_busca", "==", valorInput.toLowerCase()));
        }
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error(tipoBusca === 'cpf' ? "CPF não encontrado." : "Nome não encontrado. Digite exatamente igual à inscrição.");
        }

        const dados = querySnapshot.docs[0].data();

        if (dados.tipo_participacao === "Ouvinte") {
            throw new Error("Certificados disponíveis apenas para Monitores e Apresentadores de Projetos.");
        }

        if (!dados.certificado_liberado) {
            throw new Error("O certificado ainda não foi liberado pela organização. Aguarde o encerramento do evento.");
        }

        btn.innerText = "Gerando PDF...";
        await criarPDF(dados.nome, dados.tipo_participacao);
        exibirModal('sucesso', 'Sucesso!', 'O download do seu certificado iniciará em instantes.');

    } catch (erro) {
        console.error(erro);
        exibirModal('erro', 'Atenção', erro.message);
    } finally {
        btn.innerText = "BAIXAR CERTIFICADO PDF";
        btn.disabled = false;
    }
};

async function criarPDF(nomeParticipante, tipoParticipacao) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const imgUrl = "assets/modelo_certificado.png"; 
    const img = new Image();
    img.src = imgUrl;

    return new Promise((resolve, reject) => {
        img.onload = function() {
            doc.addImage(img, 'PNG', 0, 0, width, height);
            doc.setFont("times", "italic");
            doc.setFontSize(22);
            doc.setTextColor(30, 64, 175);
            doc.text(nomeParticipante.toUpperCase(), width / 2 + 55, 120, { align: 'center' });
            doc.setFont("helvetica", "italic");
            doc.setFontSize(14);
            doc.setTextColor(50, 50, 50);
            doc.text(`Participação registrada como: ${tipoParticipacao}`, width / 2 + 70, 127, { align: 'center' });
            doc.save(`Certificado_${nomeParticipante}.pdf`);
            resolve();
        };
        img.onerror = () => reject(new Error("Erro ao carregar o modelo de imagem do certificado."));
    });
}

let idUsuarioAtual = null;

window.salvarInscricaoNoFirebase = async function() {
    const nome = document.getElementById('inp-nome').value;
    const cpf = document.getElementById('inp-cpf').value;
    const fone = document.getElementById('inp-fone').value; 
    const email = document.getElementById('inp-email').value;
    const inst = document.getElementById('inp-inst').value;
    const tipo = document.getElementById('inp-tipo').value;
    const btn = document.getElementById('btn-confirmar-inscricao');
    const blocoSubmissao = document.getElementById('bloco-submissao');
    const msgAviso = document.getElementById('msg-aviso');

    btn.innerText = "Salvando...";
    btn.disabled = true;

    const agora = new Date();
    const idProtocolo = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;

    try {
        await setDoc(doc(db, "inscricoes", idProtocolo), {
            nome: nome,
            nome_busca: nome.toLowerCase(),
            cpf: cpf,
            telefone: fone, 
            email: email, 
            onde_estuda: inst,
            tipo_participacao: tipo,
            data: new Date().toLocaleString(),
            protocolo: idProtocolo,
            confirmado: (tipo === "Ouvinte")
        });
        idUsuarioAtual = idProtocolo;

        idUsuarioAtual = idProtocolo;

        if (tipo === "Supervisor") {
            // Supervisor: Salva dados do trabalho imediatamente
            const titulo = document.getElementById('inp-titulo-trab').value;
            const tema = document.getElementById('inp-tema-trab').value;
            const resumo = document.getElementById('inp-resumo-trab').value;

            await updateDoc(doc(db, "inscricoes", idProtocolo), {
                titulo_trabalho: titulo,
                tema_trabalho: tema,
                resumo_trabalho: resumo,
                data_submissao: new Date().toLocaleString()
            });

            exibirModal('sucesso', 'Inscrição Completa!', 'Supervisor, sua inscrição e dados do projeto foram salvos com sucesso.', idProtocolo);
            // Limpa tudo
            document.getElementById('form-trabalho').reset();
            document.getElementById('form-inscricao').reset();
            // Bloqueia novamente para próximo uso
            blocoSubmissao.classList.add('bloqueado');
            msgAviso.style.display = "block";
        } 
        else if (tipo === "Apresentador") {
            exibirModal('sucesso', '1ª Etapa Realizada!', 'Sua inscrição inicial foi salva. AGORA É NECESSÁRIO ENVIAR OS DADOS DO TRABALHO logo abaixo para garantir sua participação.', idProtocolo);
            blocoSubmissao.classList.remove('bloqueado');
            msgAviso.style.display = "none";
            
            setTimeout(() => {
                blocoSubmissao.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            exibirModal('sucesso', 'Inscrição Realizada!', 'Sua inscrição foi confirmada com sucesso.', idProtocolo);
            document.getElementById('form-inscricao').reset();
        }
        document.getElementById('form-inscricao').reset();
        verificarFormulario();
    } catch (e) {
        console.error("Erro ao salvar: ", e);
        exibirModal('erro', 'Erro ao Salvar', 'Não foi possível realizar a inscrição.');
    } finally {
        btn.innerText = "CONFIRMAR INSCRIÇÃO";
        btn.disabled = false;
    }
};

window.salvarDadosTrabalho = async function() {
    const titulo = document.getElementById('inp-titulo-trab').value;
    const tema = document.getElementById('inp-tema-trab').value;
    const resumo = document.getElementById('inp-resumo-trab').value;
    const btnUpload = document.querySelector('.bloco-submissao .btn-acao');

    if (!idUsuarioAtual) {
        exibirModal('erro', 'Atenção', 'Você precisa confirmar sua inscrição primeiro!');
        return;
    }
    btnUpload.innerText = "Enviando...";
    btnUpload.disabled = true;
    try {
        await updateDoc(doc(db, "inscricoes", idUsuarioAtual), {
            titulo_trabalho: titulo,
            tema_trabalho: tema,
            resumo_trabalho: resumo,
            data_submissao: new Date().toLocaleString()
        });
        exibirModal('sucesso', 'Trabalho Enviado!', 'Os dados do seu trabalho foram salvos com sucesso.');
        document.getElementById('form-trabalho').reset();
        document.getElementById('bloco-submissao').classList.add('bloqueado');
        document.getElementById('msg-aviso').innerText = "Trabalho enviado com sucesso!";
        document.getElementById('msg-aviso').style.display = "block";
    } catch (error) {
        console.error("Erro no envio:", error);
        exibirModal('erro', 'Erro no Envio', 'Não foi possível enviar o trabalho.');
    } finally {
        btnUpload.innerText = "ENVIAR TRABALHO";
    }
};

window.carregarMomentosSidebar = async function() {
    const container = document.getElementById('sidebar-momentos-container');
    if (!container) return;
    try {
        const querySnapshot = await getDocs(collection(db, "galeria"));
        if (querySnapshot.empty) {
            container.innerHTML = '<div style="background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; border-radius: 8px;">Nenhuma foto na galeria.</div>';
            return;
        }
        let fotos = [];
        querySnapshot.forEach(doc => { if(doc.data().url) fotos.push(doc.data()); });
        for (let i = fotos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fotos[i], fotos[j]] = [fotos[j], fotos[i]];
        }
        const selecionadas = fotos.slice(0, 3);
        container.innerHTML = '';
        selecionadas.forEach(foto => {
            container.innerHTML += `
                <div style="position: relative; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s; margin-bottom: 10px;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'" onclick="navegar('galeria')">
                    <img src="${foto.url}" alt="${foto.titulo || ''}" style="width: 100%; height: 160px; object-fit: cover; display: block; background: #eee;">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 12px 10px; color: white;">
                        <div style="font-size: 0.8rem; font-weight: 600;">${foto.titulo || "Momento da Feira"}</div>
                    </div>
                </div>
            `;
        });
    } catch (e) { container.innerHTML = '<div style="padding: 20px; text-align: center;">Indisponível.</div>'; }
};

window.carregarEstatisticasSidebar = async function() {
    const elInscritos = document.getElementById('stat-total-inscritos');
    const elProjetos = document.getElementById('stat-total-projetos');
    if (!elInscritos || !elProjetos) return;
    try {
        const snap = await getDocs(collection(db, "inscricoes"));
        let totalInscritos = snap.size;
        let totalProjetos = 0;
        snap.forEach(doc => { if (doc.data().titulo_trabalho) totalProjetos++; });
        
        const animar = (el, val) => {
            let start = 0;
            const timer = setInterval(() => {
                start += Math.ceil(val/20);
                if (start >= val) { el.innerText = val; clearInterval(timer); }
                else el.innerText = start;
            }, 30);
        };
        animar(elInscritos, totalInscritos);
        animar(elProjetos, totalProjetos);
    } catch (e) { 
        elInscritos.innerText = "0"; elProjetos.innerText = "0";
    }
};

window.carregarMomentosHome = async function() {
    const container = document.getElementById('grid-momentos-home');
    if (!container) return;
    try {
        const snap = await getDocs(query(collection(db, "galeria"), limit(30)));
        let fotos = [];
        snap.forEach(doc => { if(doc.data().url) fotos.push(doc.data()); });
        for (let i = fotos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fotos[i], fotos[j]] = [fotos[j], fotos[i]];
        }
        const selecionadas = fotos.slice(0, 4);
        container.innerHTML = '';
        selecionadas.forEach(foto => {
            container.innerHTML += `
                <div style="height: 250px; background: white; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navegar('galeria')">
                     <img src="${foto.url}" style="width: 100%; height: 100%; object-fit: cover;" alt="">
                     <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 15px; color: white;">
                        <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">${foto.titulo || ""}</p>
                     </div>
                </div>
            `;
        });
    } catch (e) {}
};

window.carregarNoticias = async function() {
    const container = document.getElementById('news-grid');
    if (!container) return;
    try {
        const q = query(collection(db, "noticias"), orderBy("data", "desc"), limit(3));
        const snap = await getDocs(q);
        container.innerHTML = '';
        if (snap.empty) {
            container.innerHTML = '<p>Nenhuma notícia publicada.</p>';
            return;
        }
        snap.forEach(doc => {
            const n = doc.data();
            const dataFormatada = n.data ? new Date(n.data).toLocaleDateString('pt-BR') : 'Sem data';
            container.innerHTML += `
                <article class="news-card" onclick="window.location.href='noticias/detalhe.html?id=${doc.id}'" style="cursor: pointer;">
                    <div class="news-img"><img src="${n.imagem_url || 'assets/ev-2025.jpg'}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                    <div class="news-content">
                        <span class="news-date">${dataFormatada}</span>
                        <h4>${n.titulo}</h4>
                        <p>${n.descricao ? n.descricao.substring(0, 100) + '...' : ''}</p>
                        <span style="color: var(--azul-claro); font-weight: bold; margin-top: 10px;">Ler mais →</span>
                    </div>
                </article>
            `;
        });
    } catch (e) { console.error(e); }
};

// --- INITIALIZATION ---
async function loadSections() {
    const sections = ['inicio', 'a-feira', 'resultados', 'galeria', 'inscricoes', 'contato'];
    for (const section of sections) {
        try {
            const response = await fetch(`pages/${section}.html`);
            if (response.ok) {
                const html = await response.text();
                const el = document.getElementById(section);
                if (el) el.innerHTML = html;
            }
        } catch (e) {
            console.error(`Erro ao carregar seção ${section}:`, e);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSections();
    
    // Initial loads from Firebase
    window.fetchEventos();
    window.initCalendar();
    
    setTimeout(window.carregarMomentosSidebar, 1500);
    setTimeout(window.carregarMomentosHome, 1000);
    setTimeout(window.carregarEstatisticasSidebar, 2000); 
    setTimeout(window.carregarNoticias, 3000);

    // Lógica do botão Voltar ao Topo e Menu Inteligente
    const btnToTop = document.getElementById("backToTop");
    const navBar = document.querySelector(".nav-floating-container");
    let lastScrollPos = window.scrollY;

    // Instagram Float Logic
    setTimeout(() => {
        const instaCard = document.getElementById('insta-float');
        if(instaCard) {
            instaCard.classList.add('visible');
            // Remove after 5 seconds visible
            setTimeout(() => {
                instaCard.classList.remove('visible');
            }, 7000); // 7s total (stays visible for roughly 5-6s)
        }
    }, 1500); // Delay start

    window.addEventListener("scroll", () => {
        const currentScrollPos = window.scrollY;

        // Mostrar/Ocultar botão Topo
        if (btnToTop) {
            if (currentScrollPos > 400) {
                btnToTop.classList.add("visible");
            } else {
                btnToTop.classList.remove("visible");
            }
        }

        // Mostrar/Ocultar Menu Inteligente
        if (navBar) {
            if (currentScrollPos > lastScrollPos && currentScrollPos > 100) {
                // Scroll para baixo: Esconder
                navBar.classList.add("nav-hidden");
            } else {
                // Scroll para cima ou no topo: Mostrar
                navBar.classList.remove("nav-hidden");
            }
        }

        lastScrollPos = currentScrollPos;
    });

    if (btnToTop) {
        btnToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

// --- CONTACT FORM ---
window.enviarMensagemContato = async function(e) {
    if (e) e.preventDefault();
    
    const nome = document.getElementById('contato-nome');
    const metodo = document.getElementById('contato-metodo');
    const mensagem = document.getElementById('contato-mensagem');
    const btn = document.getElementById('btn-enviar-contato');

    if (!nome.value || !metodo.value || !mensagem.value) {
        window.exibirModal('erro', 'Campos Vazios', 'Por favor, preencha todos os campos.');
        return;
    }

    const textoOriginal = btn.innerHTML;
    btn.innerHTML = "<span>ENVIANDO...</span>";
    btn.disabled = true;

    try {
        // Enviamos tanto 'contato' quanto 'email' para garantir compatibilidade com regras do Firestore
        await addDoc(collection(db, "mensagens"), {
            nome: nome.value,
            email: metodo.value, 
            contato: metodo.value,
            mensagem: mensagem.value,
            data: new Date().toISOString(),
            lida: false
        });

        window.exibirModal('sucesso', 'Mensagem Enviada', 'Sua mensagem foi enviada ao WhatsApp do monitor administrador!');
        nome.value = "";
        metodo.value = "";
        mensagem.value = "";
    } catch (error) {
        console.error("Erro completo no envio:", error);
        window.exibirModal('erro', 'Erro no Envio', 'Não foi possível enviar sua mensagem. Verifique sua conexão ou tente mais tarde.');
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
};

// --- MOBILE MENU ---
window.toggleMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.querySelector('.menu-toggle span');
    
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
        if (menuIcon) {
            menuIcon.innerText = navLinks.classList.contains('mobile-active') ? 'close' : 'menu';
        }
    }
};

window.closeMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.querySelector('.menu-toggle span');
    
    if (navLinks) {
        navLinks.classList.remove('mobile-active');
        if (menuIcon) {
            menuIcon.innerText = 'menu';
        }
    }
};

// --- MANUAL INTERATIVO ---
const manualContent = {
    ouvinte: `
        <h4 style="color: var(--azul-escuro); margin-bottom: 20px; font-size: 1.2rem;">Guia para Ouvintes</h4>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 1: Dados Obrigatórios</div>
            <p style="color: #666; font-size: 0.95rem;">Preencha <strong>Nome Completo</strong>, <strong>Telefone</strong> e <strong>Instituição/Escola</strong>. Esses campos são indispensáveis.</p>
        </div>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 2: Tipo de Inscrição</div>
            <p style="color: #666; font-size: 0.95rem;">Selecione a opção <strong>"Ouvinte"</strong>.</p>
        </div>
        <div class="step">
            <div style="font-weight: bold; color: var(--verde-sucesso); margin-bottom: 5px;">Finalização</div>
            <p style="color: #666; font-size: 0.95rem;">Clique em "Confirmar Inscrição". Um número de protocolo será gerado. Salve-o!</p>
        </div>
    `,
    apresentador: `
        <h4 style="color: var(--azul-escuro); margin-bottom: 20px; font-size: 1.2rem;">Guia para Apresentadores</h4>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 1: Dados Pessoais</div>
            <p style="color: #666; font-size: 0.95rem;">Preencha os campos obrigatórios (Nome, Telefone, Instituição) e selecione <strong>"Apresentador de Trabalho"</strong>.</p>
        </div>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 2: Submissão em Duas Etapas</div>
            <p style="color: #666; font-size: 0.95rem;">Confirme a inscrição inicial. O sistema liberará o formulário de trabalho abaixo. Preencha Título, Tema e Resumo e envie.</p>
        </div>
        <div class="step manual-alert" style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fcd34d;">
            <small style="display: block; font-weight: bold; color: #b45309; margin-bottom: 5px;">Atenção:</small>
            <p style="color: #b45309; font-size: 0.9rem; margin: 0;">Você deve realizar os dois envios para sua submissão ser válida.</p>
        </div>
    `,
    supervisor: `
        <h4 style="color: var(--azul-escuro); margin-bottom: 20px; font-size: 1.2rem;">Guia para Supervisores</h4>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 1: Seleção do Perfil</div>
            <p style="color: #666; font-size: 0.95rem;">Ao selecionar <strong>"Supervisor de Projeto"</strong>, todos os campos do formulário serão liberados, incluindo os dados do trabalho.</p>
        </div>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 2: Preenchimento Completo</div>
            <p style="color: #666; font-size: 0.95rem;">Você deve preencher <strong>TODOS</strong> os campos pessoais (incluindo CPF e E-mail) e os dados do projeto (Título, Tema, Resumo) de uma só vez.</p>
        </div>
        <div class="step">
            <div style="font-weight: bold; color: var(--verde-sucesso); margin-bottom: 5px;">Envio Único</div>
            <p style="color: #666; font-size: 0.95rem;">Clique em "Confirmar Inscrição" para salvar tudo. Não há etapa separada de envio de trabalho para supervisores.</p>
        </div>
    `,
    monitor: `
        <h4 style="color: var(--azul-escuro); margin-bottom: 20px; font-size: 1.2rem;">Guia para Monitores</h4>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Requisito Especial</div>
            <p style="color: #666; font-size: 0.95rem;">O campo <strong>E-mail</strong> é obrigatório para monitores, além dos demais dados padrão.</p>
        </div>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 1: Cadastro</div>
            <p style="color: #666; font-size: 0.95rem;">Selecione <strong>"Monitor Voluntário"</strong>, preencha tudo e confirme.</p>
        </div>
        <div class="step" style="margin-bottom: 20px;">
            <div style="font-weight: bold; color: var(--azul-principal); margin-bottom: 5px;">Passo 2: Aguarde o Contato</div>
            <p style="color: #666; font-size: 0.95rem;">A coordenação entrará em contato para o treinamento.</p>
        </div>
    `
};

window.abrirManual = function(tabInicial = 'ouvinte') {
    const modal = document.getElementById('modal-manual');
    if(modal) {
        modal.style.display = 'flex';
        mostrarPassoManual(tabInicial);
    }
};

window.fecharModalManual = function() {
    const modal = document.getElementById('modal-manual');
    if(modal) modal.style.display = 'none';
};

window.mostrarPassoManual = function(tab) {
    const container = document.getElementById('conteudo-manual');
    const tabs = document.querySelectorAll('.manual-tab');
    
    // Atualiza HTML
    if(container && manualContent[tab]) {
        container.innerHTML = manualContent[tab];
        // Animação de entrada
        container.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
    }

    // Atualiza Menu
    tabs.forEach(t => {
        if(t.dataset.tab === tab) {
            t.classList.add('active');
            t.style.background = '#e2e8f0';
            t.style.color = 'var(--azul-principal)';
        } else {
            t.classList.remove('active');
            t.style.background = 'transparent';
            t.style.color = '#64748b';
        }
    });
};

// Fechar ao clicar fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-manual');
    if (event.target == modal) {
        fecharModalManual();
    }
});

