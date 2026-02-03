# 🖥️ DETECÇÃO AUTOMÁTICA DE RESOLUÇÃO - Letreiro Digital

## ✨ Novidade: Adaptação Automática de Layout

O Letreiro Digital agora **detecta automaticamente** a resolução da sua tela e ajusta os tamanhos para a melhor experiência!

---

## 📊 Layouts Automáticos por Resolução

### 🖥️ **Full HD (1920x1080 ou menor)**

- **Janela Principal:** 1280 x 900 pixels
- **Área de Preview:** 900 x 550 pixels
- Ideal para notebooks e monitores padrão

### 🖥️ **QHD/2K (2560x1440)**

- **Janela Principal:** 1600 x 1000 pixels
- **Área de Preview:** 1200 x 700 pixels
- Otimizado para monitores intermediários

### 🖥️ **4K/UHD (3840x2160 ou maior)**

- **Janela Principal:** 2000 x 1200 pixels
- **Área de Preview:** 1600 x 900 pixels
- Máxima qualidade para telas de alta resolução

---

## 🔧 Como Funciona

O aplicativo detecta a resolução na inicialização e escolhe automaticamente os melhores tamanhos. Você não precisa fazer nada!

### Código (para desenvolvedores):

```python
# No arquivo main.py, linha ~880
screen_width = self.root.winfo_screenwidth()
screen_height = self.root.winfo_screenheight()

if screen_width <= 1920:
    # Layout Full HD
elif screen_width <= 2560:
    # Layout QHD
else:
    # Layout 4K
```

---

## 🎯 Benefícios

✅ **Funciona em qualquer computador** - Não importa a resolução  
✅ **Sem configuração manual** - Ajuste automático  
✅ **Melhor aproveitamento da tela** - Usa o espaço disponível de forma inteligente  
✅ **Interface sempre proporcional** - Textos e botões sempre legíveis

---

## 💡 Observação

Se você transportar o aplicativo para outro computador com resolução diferente, ele se adaptará automaticamente na próxima vez que for aberto!

---

**Atualizado em:** 01/02/2026
