# 📦 Seu App Letreiro Digital está Pronto!

Para evitar problemas com antivírus (que frequentemente bloqueiam executáveis desconhecidos de arquivo único), criamos o aplicativo no formato **Portable Folder (Pasta Portátil)**.

## 🚀 Como Executar

1. Vá até a pasta: `LETREIRO-DIGITAL\dist\LetreiroDigital`
2. Encontre o arquivo: **`LetreiroDigital.exe`** (tem um ícone azul "LD")
3. Dê um duplo clique para abrir.
4. **Dica:** Clique com o botão direito no arquivo `.exe` e escolha "Enviar para" > "Área de Trabalho (criar atalho)" para ter acesso fácil.

## 🛡️ Sobre Avisos de Vírus/Segurança

- **Por que não é um único arquivo?** Arquivos `.exe` únicos criados em Python são frequentemente confundidos com vírus porque eles se "descompactam sozinhos" na memória. O formato de pasta que usamos é o padrão da indústria e evita isso.
- **Tela Azul do Windows (SmartScreen):** Na primeira vez que você abrir, o Windows pode dizer "O Windows protegeu o PC". Isso acontece porque o aplicativo **não tem uma assinatura digital certificada** (que custa caro anualmente).
  - **Solução:** Clique em **"Mais informações"** e depois no botão **"Executar assim mesmo"**. Isso só aparecerá na primeira vez.

## 📂 Arquivos Importantes

Dentro da pasta do aplicativo, você verá alguns arquivos `.json`:

- `schedule_data.json`: Seus horários salvos.
- `presets.json`: Suas configurações salvas.

Se você quiser fazer backup ou levar o programa para outro computador, **copie a pasta `LetreiroDigital` inteira**.
