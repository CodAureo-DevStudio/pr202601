# 📐 GUIA DE AJUSTE DE TAMANHOS - LETREIRO DIGITAL

Este documento mostra onde você pode ajustar os tamanhos da interface do Letreiro Digital.

## 🖥️ 1. TAMANHO DA JANELA PRINCIPAL DO PAINEL DE CONTROLE

**Arquivo:** `main.py`  
**Linha:** Aproximadamente 872-876 (procure por "AJUSTE DE TAMANHO DA JANELA PRINCIPAL")

```python
# ===== AJUSTE DE TAMANHO DA JANELA PRINCIPAL =====
# Para alterar o tamanho da janela do painel de controle, modifique os valores abaixo:
# Formato: "LARGURAxALTURA" (exemplo: "1600x1000")
self.root.geometry("1600x1000")
# ==================================================
```

### Como ajustar:

- Altere `"1600x1000"` para o tamanho desejado
- O primeiro número é a **LARGURA** (1600 pixels)
- O segundo número é a **ALTURA** (1000 pixels)

**Exemplos:**

- Pequeno: `"1280x900"`
- Médio: `"1600x1000"` ← **ATUAL**
- Grande: `"1920x1080"`

---

## 📺 2. TAMANHO DO PREVIEW (DEMONSTRAÇÃO EM TEMPO REAL)

**Arquivo:** `main.py`  
**Linha:** Aproximadamente 1591-1602 (procure por "AJUSTE DE TAMANHO DO PREVIEW")

```python
# ===== AJUSTE DE TAMANHO DO PREVIEW (DEMONSTRAÇÃO EM TEMPO REAL) =====
# Para alterar o tamanho da área de preview, modifique os valores abaixo:
# max_preview_w = LARGURA (exemplo: 1200)
# max_preview_h = ALTURA (exemplo: 700)
max_preview_w = 1200
max_preview_h = 700
# ======================================================================
```

### Como ajustar:

- Altere o valor de `max_preview_w` para a **LARGURA** desejada
- Altere o valor de `max_preview_h` para a **ALTURA** desejada

**Exemplos:**

- Pequeno: `max_preview_w = 800` e `max_preview_h = 550`
- Médio: `max_preview_w = 1200` e `max_preview_h = 700` ← **ATUAL**
- Grande: `max_preview_w = 1600` e `max_preview_h = 900`

---

## ⚠️ DICAS IMPORTANTES:

1. **Sempre mantenha as proporções adequadas** - não faça o preview maior que a janela principal
2. **Reinicie a aplicação** após fazer alterações para ver o efeito
3. **Considere o tamanho da sua tela** - não configure valores maiores que sua resolução
4. **Proporção recomendada** - O preview deve ocupar cerca de 70-80% da largura da janela principal

---

## 📊 CONFIGURAÇÕES ATUAIS:

✅ **Janela Principal:** 1600 x 1000 pixels  
✅ **Preview:** 1200 x 700 pixels  
✅ **Cursor do mouse:** Visível na demonstração ✨

---

## 🔍 Como encontrar rapidamente no código:

Use a função de busca do seu editor (Ctrl+F) e procure por:

- `"AJUSTE DE TAMANHO DA JANELA PRINCIPAL"` - para a janela
- `"AJUSTE DE TAMANHO DO PREVIEW"` - para o preview

---

**Última atualização:** 01/02/2026

---

## 🚀 3. VELOCIDADE DE ATUALIZAÇÃO DO PREVIEW EM TEMPO REAL

**Arquivo:** `main.py`  
**Linhas:** Aproximadamente 1565-1571 e 1582-1587

### Captura de Tela (FPS):

```python
# ===== VELOCIDADE DE ATUALIZAÇÃO DA CAPTURA =====
# Aumentado para ~30 FPS (0.033s) para preview mais fluido
time.sleep(0.033)
```

### Atualização do Preview:

```python
# ===== VELOCIDADE DE ATUALIZAÇÃO DO PREVIEW =====
# Sincronizado com captura: 33ms = ~30 FPS
self.root.after(33, self.check_bg_queue)
```

**Como ajustar:**

- **Para mais rápido (60 FPS):** `time.sleep(0.016)` e `self.root.after(16, ...)`
- **Para economizar CPU (15 FPS):** `time.sleep(0.066)` e `self.root.after(66, ...)`
- **Atual (30 FPS):** `time.sleep(0.033)` e `self.root.after(33, ...)` ← **RECOMENDADO**

⚠️ **Nota:** FPS muito alto pode usar mais processador. 30 FPS é um bom equilíbrio.

---

**Última atualização:** 01/02/2026
