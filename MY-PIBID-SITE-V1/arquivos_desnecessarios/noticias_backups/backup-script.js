// ============================================
// SISTEMA DE NOTÍCIAS - VANILLA JAVASCRIPT
// Adaptado para Nova Identidade Visual
// ============================================

import { collection, getDocs, doc, getDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./config.js";

/**
 * Formata data para padrão brasileiro
 */
function formatarData(dataISO) {
    if (!dataISO) return 'Data não informada';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// ============================================
// PÁGINA DE LISTAGEM
// ============================================

async function renderizarListagem() {
    const grid = document.getElementById('lista-noticias');
    if (!grid) return; // Não estamos na página de lista ou erro de ID

    const erroMsg = document.getElementById('mensagem-erro');
    
    // O loader já está dentro do grid inicialmente no HTML
    
    try {
        console.log("🔵 Buscando notícias...");
        
        const q = query(collection(db, "noticias"), orderBy("data", "desc"), limit(20));
        const snap = await getDocs(q);
        
        // Limpar Grid (remove loader)
        grid.innerHTML = '';
        
        if (snap.empty) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                    <span class="material-symbols-rounded" style="font-size: 3rem; margin-bottom: 10px; display: block;">article</span>
                    <h2>Nenhuma notícia encontrada</h2>
                    <p>Fique atento, em breve teremos novidades!</p>
                </div>
            `;
            return;
        }
        
        snap.forEach(docSnap => {
            const n = { id: docSnap.id, ...docSnap.data() };
            const html = `
                <article class="noticia-card">
                    <div class="card-imagem">
                        <img src="${n.imagem_url || '../assets/placeholder-news.jpg'}" 
                             alt="${n.titulo}" 
                             onerror="this.src='https://via.placeholder.com/800x400/e2e8f0/64748b?text=Sem+Imagem'">
                    </div>
                    <div class="card-conteudo">
                        <div class="card-meta">
                            <span style="color: var(--azul-principal);">PIBID UFAL</span>
                            <span class="separador">•</span>
                            <time>${formatarData(n.data)}</time>
                        </div>
                        <h3 class="card-titulo">${n.titulo}</h3>
                        <p class="card-preview">${n.descricao ? n.descricao.substring(0, 120) + '...' : ''}</p>
                        <a href="noticias-detalhe.html?id=${n.id}" class="btn-ler-mais">
                            Ler notícia completa <span class="material-symbols-rounded" style="font-size: 1.2em; vertical-align: bottom;">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
            `;
            grid.innerHTML += html;
        });
        
    } catch (erro) {
        console.error('Erro:', erro);
        grid.innerHTML = ''; // Limpa loader
        if (erroMsg) erroMsg.style.display = 'block';
    }
}

// ============================================
// PÁGINA DE DETALHES
// ============================================

async function renderizarDetalhes() {
    const container = document.getElementById('conteudo-noticia');
    if (!container) return; // Não estamos na página de detalhes

    const loader = document.getElementById('loader-detalhe');
    const erroMsg = document.getElementById('erro-msg-detalhe');
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        if (loader) loader.style.display = 'none';
        if (erroMsg) erroMsg.style.display = 'block';
        return;
    }

    try {
        const docRef = doc(db, "noticias", id);
        const docSnap = await getDoc(docRef);
        
        if (loader) loader.style.display = 'none';
        
        if (!docSnap.exists()) {
            if (erroMsg) erroMsg.style.display = 'block';
            return;
        }
        
        const n = docSnap.data();
        
        // Renderizar HTML interno COM NOVA ESTRUTURA
        container.style.display = 'block';
        container.innerHTML = `
            <!-- 1. Imagem Banner (Topo) -->
            <div class="banner-container">
            ${n.imagem_url 
                ? `<img src="${n.imagem_url}" class="banner-imagem" alt="${n.titulo}">` 
                : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--azul-principal),var(--azul-escuro));display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;"><span class="material-symbols-rounded" style="font-size:1em;">image</span></div>`
            }
            </div>

            <!-- 2. Corpo da Notícia -->
            <div class="corpo-noticia">
                
                <!-- Título -->
                <h1 class="noticia-titulo-novo">${n.titulo}</h1>
                
                ${n.subtitulo ? `<p class="noticia-subtitulo-novo">${n.subtitulo}</p>` : ''}
                
                <!-- Meta Dados (Abaixo do título) -->
                <div class="noticia-meta-novo">
                    <div class="meta-item" style="color: var(--azul-principal); font-weight: 700;">
                        <span class="material-symbols-rounded">schedule</span>
                        ${formatarData(n.data)}
                    </div>
                    <div class="meta-item">
                        <span class="material-symbols-rounded">person</span>
                        Redação PIBID
                    </div>
                    <div class="meta-item">
                        <span class="material-symbols-rounded">folder_open</span>
                        Notícias
                    </div>
                </div>

                <!-- Texto -->
                <div class="noticia-conteudo-texto">
                    ${n.descricao ? n.descricao.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('') : '<p>Sem conteúdo.</p>'}
                </div>

                <!-- Ações -->
                <div class="barra-acoes">
                    <a href="noticias-index.html" class="btn-voltar-home">
                        <span class="material-symbols-rounded">arrow_back</span> Voltar para Lista
                    </a>
                    <button onclick="window.print()" class="btn-voltar-home" style="background: #f8fafc; border-color: #cbd5e1; color: #64748b;">
                        <span class="material-symbols-rounded">print</span> Imprimir
                    </button>
                </div>
            </div>
        `;
        
        document.title = `${n.titulo} - Feira da Matemática`;
        
    } catch (erro) {
        console.error("Erro detalhes:", erro);
        if (loader) loader.style.display = 'none';
        if (erroMsg) erroMsg.style.display = 'block';
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    const path = window.location.pathname;
    // Verifica qual página é baseado no URL ou na presença de elementos chave
    if (document.getElementById('lista-noticias')) {
        renderizarListagem();
    } else if (document.getElementById('conteudo-noticia')) {
        renderizarDetalhes();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
