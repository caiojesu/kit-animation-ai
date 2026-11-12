# Prompt de instalação

Você não precisa baixar nada à mão nem saber usar git. Cole o texto abaixo no seu agente (Claude Code, Cursor, Codex, OpenBot ou outro que rode comandos).

- **Agentes que abrem em uma pasta** (Claude Code, Cursor, Codex): crie uma pasta vazia para o estúdio e abra o agente nela.
- **Bots sem pasta própria** (OpenBot e similares): cole direto. O bot pergunta onde criar a pasta do estúdio.

```text
Instale o kit de estúdio de animação e faça o setup comigo.

1. Defina a pasta do estúdio:
   - Se você está trabalhando em uma pasta e ela está vazia, use essa pasta.
   - Se a pasta não está vazia, ou se você não tem uma pasta de trabalho
     definida, pare e me pergunte onde criar a pasta do estúdio, sugerindo
     um caminho. Crie a pasta e me diga o caminho completo.
   Daqui em diante, "a pasta do estúdio" é essa, e todos os comandos e
   arquivos usam o caminho completo dela.

2. Baixe o kit de https://github.com/caiojesu/kit-animation-ai para dentro
   da pasta do estúdio, com os arquivos na raiz dela, e não em uma subpasta:
   - Se o git estiver instalado, clone dentro da pasta do estúdio:
     git clone https://github.com/caiojesu/kit-animation-ai.git .
   - Se não estiver, baixe o arquivo
     https://github.com/caiojesu/kit-animation-ai/archive/refs/heads/main.zip
     extraia, mova o conteúdo da pasta "kit-animation-ai-main" para a
     pasta do estúdio e apague o zip e a pasta que ficou vazia.
   Não me peça para instalar o git. Baixe só desse endereço.

3. Confirme que SETUP.md, ESTUDIO.md e a pasta agentes/ existem na pasta
   do estúdio. Se o download falhar, me mostre o erro e pare.

4. Leia o SETUP.md da pasta do estúdio e siga as instruções dele. Todos os
   caminhos citados nele são relativos à pasta do estúdio.
```

## O que acontece depois

O agente baixa o kit, entrevista você sobre a intenção do estúdio (oito blocos, uma pergunta por vez, sempre com uma recomendação), preenche o `ESTUDIO.md` e cria os agentes. No fim, ele entrega o pedido do primeiro piloto.

## Bom saber

- **O agente vai pedir permissão** para rodar os comandos de download. É esperado.
- **Guarde o caminho da pasta do estúdio.** Em agentes que abrem em uma pasta, abra sempre nela. Em runtimes de bots, é essa pasta que todos os bots do estúdio compartilham.
- **Em alguns runtimes, os agentes só passam a valer em uma conversa nova.** O agente avisa no fim do setup se for o caso.
- **O render precisa do Node.js** (versão 18 ou mais nova). O setup confere e avisa se faltar. Ele pede a sua confirmação antes de instalar os pacotes de render, que ocupam cerca de 800 MB.
- **Evite pastas sincronizadas com a nuvem** (OneDrive, Dropbox, iCloud). Os vídeos e os pacotes seriam sincronizados à toa.

## Se você prefere baixar à mão

Clone ou baixe o repositório, abra o agente na pasta e diga:

```text
Leia o SETUP.md e siga as instruções.
```
