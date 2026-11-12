# Prompt de instalação

Você não precisa baixar nada à mão nem saber usar git. Crie uma pasta vazia para o seu estúdio, abra o seu agente nessa pasta (Claude Code, Cursor, Codex, OpenBot ou outro que rode comandos) e cole o texto abaixo.

```text
Instale o kit de estúdio de animação nesta pasta e faça o setup comigo.

1. Confira se esta pasta está vazia. Se não estiver, pare e me pergunte se
   pode criar uma subpasta chamada "estudio" e instalar dentro dela.

2. Baixe o kit de https://github.com/caiojesu/kit-animation-ai para dentro
   desta pasta, com os arquivos na raiz dela, e não em uma subpasta:
   - Se o git estiver instalado, clone:
     git clone https://github.com/caiojesu/kit-animation-ai.git .
   - Se não estiver, baixe o arquivo
     https://github.com/caiojesu/kit-animation-ai/archive/refs/heads/main.zip
     extraia, mova o conteúdo da pasta "kit-animation-ai-main" para cá e
     apague o zip e a pasta que ficou vazia.
   Não me peça para instalar o git. Baixe só desse endereço.

3. Confirme que SETUP.md, ESTUDIO.md e a pasta agentes/ existem aqui.
   Se o download falhar, me mostre o erro e pare.

4. Leia o SETUP.md e siga as instruções dele.
```

## O que acontece depois

O agente baixa o kit, entrevista você sobre a intenção do estúdio (oito blocos, uma pergunta por vez, sempre com uma recomendação), preenche o `ESTUDIO.md` e cria os agentes. No fim, ele entrega o pedido do primeiro piloto.

## Bom saber

- **O agente vai pedir permissão** para rodar os comandos de download. É esperado.
- **Se ele instalou em uma subpasta**, abra o agente nessa subpasta das próximas vezes. É lá que o estúdio mora.
- **Em alguns runtimes, os agentes só passam a valer em uma conversa nova.** O agente avisa no fim do setup se for o caso.
- **O render precisa do Node.js** (versão 18 ou mais nova). O setup confere e avisa se faltar. Ele pede a sua confirmação antes de instalar os pacotes de render, que ocupam cerca de 800 MB.
- **Evite pastas sincronizadas com a nuvem** (OneDrive, Dropbox, iCloud). Os vídeos e os pacotes seriam sincronizados à toa.

## Se você prefere baixar à mão

Clone ou baixe o repositório, abra o agente na pasta e diga:

```text
Leia o SETUP.md e siga as instruções.
```
