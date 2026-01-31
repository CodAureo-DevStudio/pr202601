# 🎨 GUIA DE USO - SISTEMA DE ANIMAÇÕES GLOBAIS

## Instituto Eixos - Animações Premium com Identidade Visual

---

## 📦 ARQUIVOS CRIADOS

1. **`global-animations.css`** - Sistema completo de animações CSS
2. **`global-animations.js`** - Controle automático e interativo

---

## 🚀 INSTALAÇÃO EM CADA PÁGINA

### Passo 1: Adicionar CSS no `<head>`

```html
<!-- Adicionar APÓS style.css -->
<link rel="stylesheet" href="assets/css/style.css" />
<link rel="stylesheet" href="assets/css/global-animations.css" />
```

### Passo 2: Adicionar JS antes de `</body>`

```html
<!-- Adicionar ANTES de fechar </body> -->
<script src="assets/js/global-animations.js"></script>
</body>
```

---

## 🎯 FUNCIONALIDADES AUTOMÁTICAS

O sistema **ativa automaticamente** animações em:

✅ Todos os `<h2>` e `<h3>` de seções
✅ Parágrafos importantes
✅ Botões e CTAs
✅ Cards e elementos `.card-*`
✅ Imagens em seções
✅ Ícones Font Awesome

**Não precisa fazer nada** - as animações são aplicadas automaticamente!

---

## 🎨 CORES DOS PILARES

### Cores Disponíveis

```css
--pillar-red: #e42836; /* Saúde */
--pillar-blue: #005b89; /* Cultura */
--pillar-yellow: #f7aa2c; /* Educação */
--pillar-green: #3d6446; /* Sustentabilidade/Esporte */
```

### Aplicação Automática

O sistema detecta automaticamente a cor baseado em palavras-chave:

- "saúde" → Vermelho
- "educação" → Amarelo
- "cultura" → Azul
- "sustentabilidade", "esporte" → Verde

---

## 💫 USO MANUAL - CLASSES DISPONÍVEIS

### 1. ÍCONES ANIMADOS

#### Exemplo Básico

```html
<div class="icon-wrapper md blue">
  <img src="assets/icons/saude.svg" alt="Saúde" />
</div>
```

**⚠️ IMPORTANTE**: Use APENAS os ícones SVG customizados do sistema!

- Não use Font Awesome (`<i class="fas fa-...">`
  )
- Veja todos os ícones disponíveis em: `icons-catalogo.html`

#### Ícones Disponíveis

- **Pilares**: saude.svg, educacao.svg, cultura.svg, sustentabilidade.svg
- **Navegação**: projetos.svg, galeria.svg, transparencia.svg, noticias.svg, doacao.svg, contato.svg
- **Institucional**: missao.svg, visao.svg, valores.svg, alvo.svg, trofeu.svg
- **Pessoas**: usuarios.svg, voluntarios.svg, coracao.svg, ajuda.svg
- **Utilidades**: calendario.svg, relogio.svg, localizacao.svg, telefone.svg, email.svg, busca.svg, check.svg, download.svg, compartilhar.svg
- **Documentos**: documento.svg, imagem.svg, grafico.svg, impacto.svg

#### Tamanhos Disponíveis

- `sm` - 48x48px
- `md` - 64x64px (padrão)
- `lg` - 80x80px
- `xl` - 100x100px

#### Cores Disponíveis

- `red` - Vermelho (Saúde)
- `blue` - Azul (Cultura)
- `yellow` - Amarelo (Educação)
- `green` - Verde (Sustentabilidade)

#### Com Animação de Flutuação

```html
<div class="icon-wrapper lg yellow animate-float">
  <img src="assets/icons/educacao.svg" alt="Educação" />
</div>
```

#### Catálogo Completo

Acesse `icons-catalogo.html` para ver todos os 32 ícones disponíveis!

---

### 2. CARDS ANIMADOS

```html
<div class="animated-card blue" data-animation="animate-fade-in-up">
  <h3>Título do Card</h3>
  <p>Conteúdo do card...</p>
</div>
```

**Efeitos Automáticos:**

- ✨ Hover com elevação
- 🌈 Borda colorida no topo ao passar mouse
- 💫 Sombra com cor do pilar

---

### 3. BADGES/TAGS ANIMADOS

```html
<span class="badge-animated red">
  <i class="fas fa-heart"></i>
  Saúde
</span>
```

**Cores:** `red`, `blue`, `yellow`, `green`

---

### 4. TEXTO COM GRADIENT

```html
<h2 class="text-gradient-full">Título com Gradiente Animado</h2>
```

**Gradientes Disponíveis:**

- `text-gradient-red` - Gradiente vermelho
- `text-gradient-blue` - Gradiente azul
- `text-gradient-yellow` - Gradiente amarelo
- `text-gradient-green` - Gradiente verde
- `text-gradient-full` - Todas as cores (animado)

---

### 5. ANIMAÇÕES DE ENTRADA

#### Usar com data-attribute:

```html
<div data-animation="animate-fade-in-up">Conteúdo que aparece ao scrollar</div>
```

#### Animações Disponíveis:

- `animate-fade-in-up` - Fade subindo
- `animate-fade-in-down` - Fade descendo
- `animate-fade-in-left` - Fade da esquerda
- `animate-fade-in-right` - Fade da direita
- `animate-scale-in` - Escala com bounce
- `animate-float` - Flutuação contínua (loop)
- `animate-bounce` - Bounce contínuo (loop)
- `animate-pulse` - Pulso contínuo (loop)

---

### 6. STAGGER EFFECT (Efeito Cascata)

```html
<div data-stagger>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

**Resultado:** Cada item aparece com atraso de 0.1s

---

### 7. CONTADORES ANIMADOS

```html
<div data-count="2500" data-duration="2000">0</div>
```

**Atributos:**

- `data-count` - Valor final
- `data-duration` - Duração em ms (opcional, padrão: 2000)

---

### 8. LOADING SPINNER

```html
<div class="spinner blue"></div>
```

**Cores:** `red`, `blue`, `yellow`, `green`

---

### 9. TIMELINE ANIMADA

```html
<div class="timeline-animated">
  <div class="timeline-item-animated">
    <h3>2024</h3>
    <p>Fundação do instituto</p>
  </div>
  <div class="timeline-item-animated">
    <h3>2025</h3>
    <p>Expansão nacional</p>
  </div>
</div>
```

---

### 10. PARALLAX SUTIL

```html
<img src="image.jpg" data-parallax="0.5" alt="Imagem" />
```

**Valores:**

- `0.5` - Movimento sutil (recomendado)
- `1.0` - Movimento médio
- `2.0` - Movimento forte

---

## EXEMPLOS PRÁTICOS

### Seção de Pilares

```html
<section>
  <div class="container">
    <h2 data-animation="animate-fade-in-down" data-gradient="full">
      Nossos Pilares
    </h2>

    <div class="grid" data-stagger>
      <div class="animated-card red">
        <div class="icon-wrapper lg red animate-float">
          <img src="assets/img/saude.png" alt="Saúde" />
        </div>
        <h3>Saúde</h3>
        <p>Promovendo bem-estar...</p>
        <span class="badge-animated red">Ativo</span>
      </div>

      <div class="animated-card yellow">
        <div class="icon-wrapper lg yellow animate-float">
          <img src="assets/img/educacao.png" alt="Educação" />
        </div>
        <h3>Educação</h3>
        <p>Transformando através do conhecimento...</p>
        <span class="badge-animated yellow">Ativo</span>
      </div>
    </div>
  </div>
</section>
```

### Estatísticas

```html
<section class="stats-section">
  <div class="container">
    <div class="stats-grid" data-stagger>
      <div class="animated-card blue">
        <div class="icon-wrapper xl blue">
          <i class="fas fa-users"></i>
        </div>
        <div class="text-gradient-blue" data-count="2500">0</div>
        <p>Famílias Atendidas</p>
      </div>
    </div>
  </div>
</section>
```

---

## 🔧 PERSONALIZAÇÃO AVANÇADA

### Desabilitar Animação Específica

```html
<div class="no-animation">Sem animação</div>
```

### Repetir Animação ao Entrar/Sair

```html
<div data-animation="animate-fade-in-up" data-repeat="true">
  Anima toda vez que entrar na viewport
</div>
```

### Ajustar Velocidade

```html
<div class="animate-fade-in-up animation-fast">Rápido</div>
<div class="animate-fade-in-up animation-slow">Lento</div>
```

---

## 📱 RESPONSIVIDADE

As animações são otimizadas automaticamente para mobile:

- Durações reduzidas (melhor performance)
- Efeitos mais sutis
- Menos animações contínuas (economia de bateria)

---

## ✨ FUNCIONALIDADES EXTRAS INCLUÍDAS

### 1. Scroll Progress Bar

Barra de progresso colorida no topo da página (automática)

### 2. Smooth Scroll

Links internos (#) scrollam suavemente (automático)

### 3. Card Tilt 3D

Cards com efeito tilt ao passar mouse (automático em `.animated-card`)

### 4. Icon Pulse

Ícones em badges pulsam automaticamente

### 5. Section Backgrounds Animados

Gradientes sutis que flutuam (use `.section-bg-animated`)

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

Para cada página:

- [ ] Adicionar `global-animations.css` no `<head>`
- [ ] Adicionar `global-animations.js` antes de `</body>`
- [ ] Testar scroll reveal em diferentes seções
- [ ] Verificar cores de ícones
- [ ] Confirmar que badges têm cores
- [ ] Testar em mobile

---

## 🐛 TROUBLESHOOTING

### Animações não aparecem

- ✅ Verificar se CSS e JS estão incluídos
- ✅ Abrir console (F12) e verificar erros
- ✅ Limpar cache do navegador (Ctrl + Shift + Del)

### Ícones sem cor

- ✅ Adicionar classe de cor manual: `red`, `blue`, `yellow`, `green`
- ✅ Verificar se está dentro de `.icon-wrapper`

### Performance lenta

- ✅ Remover `animate-float` e `animate-bounce` de muitos elementos
- ✅ Usar `no-animation` em seções pesadas
- ✅ Desabilitar parallax em mobile

---

## 📊 RESUMO RÁPIDO

| Recurso        | Classe/Atributo          | Cor |
| -------------- | ------------------------ | --- |
| Ícone Animado  | `.icon-wrapper.md.red`   | ✅  |
| Card Hover     | `.animated-card.blue`    | ✅  |
| Badge          | `.badge-animated.yellow` | ✅  |
| Texto Gradient | `.text-gradient-green`   | ✅  |
| Scroll Reveal  | `data-animation="..."`   | ❌  |
| Contador       | `data-count="100"`       | ❌  |
| Stagger        | `data-stagger` no pai    | ❌  |

---

**Pronto para usar! 🚀**

Aplique nas páginas e veja a mágica acontecer!
