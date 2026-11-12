# Adaptador: runtimes de bots (OpenBot e similares)

Este adaptador não foi testado. Ele vale para runtimes em que cada agente é um bot persistente, com instruções próprias, que conversa com os outros bots e pode ter rotinas agendadas.

## Passo 1: ver o que o runtime oferece

Liste as ferramentas que você tem neste runtime para:

- criar um bot ou agente e definir as instruções dele;
- dar a um bot acesso a uma pasta de arquivos;
- conectar bots entre si;
- conectar um servidor MCP a um bot;
- criar uma rotina agendada.

Use só as ferramentas que existem. Se não há ferramenta para criar bots, vá para "Sem ferramenta de criação".

## Passo 2: criar um bot por papel

Para cada papel ativo em `config/projeto.json`, **incluindo a Coordenação**, crie um bot:

- **Nome:** o nome escolhido pelo dono (`agentes.<chave>.nome`).
- **Pasta de trabalho:** a pasta do estúdio (a raiz deste repositório), compartilhada por todos os bots. Use o caminho completo dela. Se o runtime não tem o conceito de pasta de trabalho, escreva o caminho completo nas instruções de cada bot, no lugar de "a raiz do estúdio".
- **Instruções**, se o bot consegue ler arquivos da pasta:

```text
Você é <Nome>, o papel de <Papel> do estúdio <nome do estúdio>.
A sua pasta de trabalho é a raiz do estúdio.

A cada tarefa, antes de agir:
1. Leia agentes/<chave>.md. São as suas instruções, e você as segue por inteiro.
2. Leia ESTUDIO.md. Ele guarda as decisões vigentes do estúdio e manda sobre qualquer pedido.

O estado da produção está em producao/fila.json e nas pastas de episodios/. O que não está nesses arquivos não aconteceu.
```

- **Instruções**, se o bot não consegue ler arquivos: o texto acima, seguido do conteúdo inteiro de `agentes/<chave>.md` e da linha "Cópia feita em <data>". Avise o dono de que, nesse caso, uma mudança em `agentes/` exige atualizar o bot.

Não crie o bot de Publicação se `agentes.publicacao.ativo` for `false`.

## Passo 3: conectar os bots

| Bot | Conversa com |
|---|---|
| Coordenação | Dono, Arte, Produção, Revisão e Publicação |
| Arte | Coordenação e Produção |
| Produção | Coordenação e Arte |
| Revisão | Coordenação |
| Publicação | Coordenação |

A Revisão fala só com a Coordenação. Isso protege a independência do parecer.

## Passo 4: servidores MCP

Você não conecta serviços nem manipula chaves. Diga ao dono quais bots precisam de qual serviço, conforme `docs/conectar-mcp.md`:

- Produção: o serviço de voz.
- Publicação, se ativa: o agendador de posts.

## Passo 5: conferir

Liste os bots criados e confirme nome, instruções e conexões. Peça a cada bot uma resposta de uma linha dizendo qual é o papel dele e qual arquivo ele lê primeiro. A resposta certa cita `agentes/<chave>.md`.

## Escrita simultânea

Nesses runtimes os bots rodam ao mesmo tempo. A regra que evita conflito já está nas instruções dos papéis: cada papel escreve só nos seus arquivos, e só a Coordenação edita `producao/fila.json`. Não crie mais de um bot para o mesmo papel no mesmo estúdio.

## Rotina automática

Só com `piloto_aprovado` e `rotina_autorizada` ligados, e só quando o dono pedir. A rotina é do bot da Coordenação, e a instrução é a de `docs/ciclo.md`. O setup não cria a rotina.

## Sem ferramenta de criação

Escreva em `adaptadores/saida/` um arquivo por papel (`coordenacao.txt`, `arte.txt`...) com as instruções prontas para colar, na versão para bots que não leem arquivos. Escreva também `adaptadores/saida/LEIA.txt`, com a ordem de criação, a tabela de conexões e os serviços de cada bot. Diga ao dono que os bots precisam ser criados à mão a partir desses arquivos.

## Registrar

Em `config/projeto.json`: `runtime.tipo` = o nome do runtime, `runtime.modo` = `bots`, `runtime.agentes_criados` = `true` só depois de conferir no passo 5. Se a saída foi para colar, deixe `false`.
