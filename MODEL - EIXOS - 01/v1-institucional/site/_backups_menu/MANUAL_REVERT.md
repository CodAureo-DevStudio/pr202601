# Backup para Retorno ao Menu Clássico

Se você desejar voltar para o menu anterior (com a barra de topo e design clássico), use os códigos abaixo.

## 1. HTML (`index.html`)

Substitua todo o bloco do `<header>` e do `nav-overlay` pelo código abaixo:

```html
<!-- Top Bar -->
<div class="top-bar">
  <div class="container">
    <div class="top-bar-content">
      <div class="top-bar-info">
        <span
          ><i class="fas fa-map-marker-alt"></i> Taguatinga, Brasília/DF</span
        >
        <span
          ><i class="fas fa-envelope"></i> contato@institutoeixos.org.br</span
        >
      </div>
      <div class="top-bar-social">
        <a href="https://www.instagram.com/institutoeixos/" target="_blank"
          ><i class="fab fa-instagram"></i
        ></a>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>
  </div>
</div>

<!-- Header -->
<header class="header">
  <div class="container">
    <div class="header-content-wrapper">
      <a
        href="index.html"
        class="logo-lateral"
        aria-label="Instituto Eixos Home"
      >
        <img
          src="assets/img/LOGOTIPO HORIZONTAL EIXOS-01.png"
          alt="Instituto Eixos"
          class="brand-logo"
        />
      </a>

      <div class="nav-and-actions">
        <nav class="nav-menu">
          <a href="index.html" class="nav-link active">Início</a>
          <a href="quem-somos.html" class="nav-link">Quem Somos</a>
          <div class="nav-item-dropdown">
            <a href="projetos.html" class="nav-link">
              Projetos
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <div class="dropdown-menu">
              <a href="todos-projetos.html" class="dropdown-link"
                >Todos os Projetos</a
              >
            </div>
          </div>
          <a href="galeria.html" class="nav-link">Galeria</a>
          <a href="editais.html" class="nav-link">Transparência</a>
          <a href="noticias.html" class="nav-link">Notícias</a>
        </nav>

        <div class="header-actions-group">
          <a href="doe-aqui.html" class="btn btn-doe btn-sm">
            <i class="fas fa-heart"></i> Doe Aqui
          </a>
          <a href="fale-conosco.html" class="btn btn-primary text-white btn-sm"
            >Fale Conosco</a
          >
        </div>

        <button class="menu-toggle" aria-label="Abrir Menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>
  </div>
</header>
```

## 2. CSS (`assets/css/style.css`)

Substitua o bloco da seção `/* Header */` pelo original:

```css
/* === Top Bar & Branding === */
.top-bar {
  background-color: var(--secondary);
  color: white;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-info {
  display: flex;
  gap: 1.5rem;
}

.top-bar-info span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.9;
}

.top-bar-info i {
  color: var(--primary);
}

.top-bar-social {
  display: flex;
  gap: 1rem;
}

.top-bar-social a {
  opacity: 0.8;
  transition: var(--transition-fast);
}

.top-bar-social a:hover {
  opacity: 1;
  color: var(--primary);
  transform: translateY(-1px);
}

/* Header Adjustments */
.header {
  position: fixed;
  top: 35px; /* Height of top bar */
  left: 0;
  width: 100%;
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

body {
  padding-top: calc(var(--header-height) + 35px);
}

.header.scrolled {
  top: 0;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-md);
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.logo-lateral {
  flex-shrink: 0;
}

.brand-logo {
  height: 50px;
  width: auto;
  transition: var(--transition);
}

.nav-and-actions {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  font-weight: 600;
  color: var(--secondary);
  font-size: 0.9rem;
  padding: 0.5rem 0;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: var(--transition);
  border-radius: 2px;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--primary);
}

.header-actions-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-doe {
  background: linear-gradient(135deg, var(--accent-red), #c41e2b);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(228, 40, 54, 0.3);
}

.btn-doe:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(228, 40, 54, 0.4);
  color: white;
}

.btn-doe i {
  margin-right: 6px;
  animation: heartbeat 2s infinite;
}

/* Mobile Menu Toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.menu-toggle .bar {
  width: 100%;
  height: 3px;
  background-color: var(--secondary);
  border-radius: 10px;
  transition: all 0.3s ease;
}
```
