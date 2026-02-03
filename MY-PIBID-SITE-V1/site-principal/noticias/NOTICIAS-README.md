# 📰 Sistema de Notícias Estático

Sistema completo de notícias usando apenas HTML, CSS e JavaScript Puro (Vanilla JS) com arquivo JSON como banco de dados.

## 📁 Estrutura de Arquivos

```
projeto/
├── noticias.json           # "Banco de dados" com array de notícias
├── noticias-index.html     # Página de listagem (vitrine)
├── noticias-detalhe.html   # Página de detalhes individual
├── noticias-script.js      # Lógica JavaScript
└── noticias-style.css      # Estilos responsivos
```

## 🚀 Como Rodar Localmente

### ⚠️ Problema de CORS

Devido às políticas de segurança dos navegadores, você **NÃO PODE** simplesmente abrir o arquivo `noticias-index.html` clicando duas vezes nele. Isso causará um erro CORS ao tentar fazer `fetch()` do arquivo JSON.

### ✅ Solução: Use um Servidor Local

**Opção 1: Live Server (VSCode) - RECOMENDADO**

1. Instale a extensão **Live Server** no VSCode
2. Clique com botão direito em `noticias-index.html`
3. Selecione "Open with Live Server"
4. O site abrirá automaticamente em `http://127.0.0.1:5500`

**Opção 2: Python (se tiver instalado)**

```bash
# Se tiver Python 3
python -m http.server 8000

# Depois acesse: http://localhost:8000/noticias-index.html
```

**Opção 3: Node.js (se tiver instalado)**

```bash
# Instale o http-server globalmente (uma vez)
npm install -g http-server

# Execute na pasta do projeto
http-server

# Acesse: http://localhost:8080/noticias-index.html
```

## 🎯 Funcionalidades

### Página de Listagem (noticias-index.html)

- ✅ Grid responsivo de cards de notícias
- ✅ Preview do conteúdo (primeiros 150 caracteres)
- ✅ Meta informações (autor e data formatada)
- ✅ Link para página de detalhes
- ✅ Loader durante carregamento
- ✅ Tratamento de erro

### Página de Detalhes (noticias-detalhe.html)

- ✅ Captura ID da URL usando URLSearchParams
- ✅ Busca notícia específica no JSON
- ✅ Exibe conteúdo completo com parágrafos
- ✅ Imagem em tamanho grande
- ✅ Botão voltar para listagem
- ✅ Tratamento de erro se ID não existir

### JavaScript (noticias-script.js)

- ✅ Fetch assíncrono com async/await
- ✅ Lógica separada (listagem vs detalhes)
- ✅ Formatação de data para português
- ✅ Criação dinâmica de elementos DOM
- ✅ Tratamento robusto de erros
- ✅ Código limpo e comentado

### CSS (noticias-style.css)

- ✅ Design moderno e minimalista
- ✅ Grid responsivo (mobile-first)
- ✅ Animações suaves
- ✅ Variáveis CSS para fácil customização
- ✅ Otimizado para leitura

## 📝 Como Adicionar Novas Notícias

Edite o arquivo `noticias.json` e adicione um novo objeto:

```json
{
  "id": 4,
  "titulo": "Título da Nova Notícia",
  "data": "2026-02-03",
  "autor": "Nome do Autor",
  "imagem_url": "https://picsum.photos/800/400?random=4",
  "conteudo": "Primeiro parágrafo.\n\nSegundo parágrafo.\n\nTerceiro parágrafo."
}
```

**IMPORTANTE:** Use `\n\n` para separar parágrafos no conteúdo.

## 🎨 Personalização

### Cores

Edite as variáveis CSS no início do arquivo `noticias-style.css`:

```css
:root {
  --cor-primaria: #2563eb; /* Cor principal */
  --cor-primaria-escura: #1e40af; /* Hover/Active */
  --cor-texto: #1f2937; /* Texto principal */
  /* ... */
}
```

## 🔗 Fluxo de Navegação

```
noticias-index.html
    ↓ (clique em "Ler mais")
noticias-detalhe.html?id=1
    ↓ (JavaScript captura o id=1)
Busca no noticias.json
    ↓ (encontra notícia com id: 1)
Renderiza conteúdo completo
```

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Desktop:** Grid de 3 colunas
- **Tablet:** Grid de 2 colunas
- **Mobile:** 1 coluna (stack vertical)

## ⚡ Performance

- Lazy loading de imagens
- CSS otimizado
- JavaScript modular
- Sem dependências externas

## 🛠️ Tecnologias

- HTML5 Semântico
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Fetch API
- URLSearchParams

---

**Desenvolvido como exemplo de Front-End Sênior - Sistema Estático Puro**
