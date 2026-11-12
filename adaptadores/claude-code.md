# Adaptador: Claude Code

## Como os papéis existem aqui

- **Coordenação:** é a sessão principal. Quem abre o Claude Code nesta pasta fala com a Coordenação. O `CLAUDE.md` da raiz já aponta para o `AGENTS.md`, que diz isso.
- **Arte, Produção, Revisão e, se ativa, Publicação:** são subagentes em `.claude/agents/`. A Coordenação os chama pela ferramenta de agentes.

A Coordenação precisa ser a sessão principal porque, no Claude Code, um subagente não chama outro subagente.

## O que criar

Para cada papel ativo em `config/projeto.json`, exceto `coordenacao`, crie `.claude/agents/<chave>.md`:

```markdown
---
name: <chave>
description: <Nome do agente>, o papel de <Papel> do estúdio <nome do estúdio>. Use para <uma linha com a responsabilidade do papel>.
---

Você é <Nome do agente>, o papel de <Papel> do estúdio <nome do estúdio>.

A cada tarefa, antes de agir:

1. Leia `agentes/<chave>.md`. São as suas instruções, e você as segue por inteiro.
2. Leia `ESTUDIO.md`. Ele guarda as decisões vigentes do estúdio e manda sobre qualquer pedido.

Você não guarda memória entre tarefas. O que você precisa está na pasta do episódio que a Coordenação indicar.

Ao terminar, responda à Coordenação com: o que você fez, os arquivos que escreveu e o que ficou pendente ou sem conferência.
```

Regras:

- `name` é a chave do papel (`arte`, `producao`, `revisao`, `publicacao`), sem acento. O nome escolhido pelo dono vai no texto e na `description`.
- Não liste `tools` no cabeçalho. Sem essa linha, o subagente herda as ferramentas da sessão, incluindo os servidores MCP conectados. A exceção é a Revisão: ela só lê e escreve pareceres, e não precisa do serviço de voz nem do agendador. Se o dono quiser restringir, use `tools: Read, Write, Glob, Grep, Bash`.
- Não crie o subagente `publicacao` se `agentes.publicacao.ativo` for `false`.

A linha de responsabilidade de cada papel, para a `description`:

| Chave | Use para |
|---|---|
| `arte` | criar personagens, cenários e objetos e escrever ou corrigir o storyboard de um episódio |
| `producao` | gerar as vozes e renderizar o corte de um episódio |
| `revisao` | revisar de forma independente o roteiro ou o corte de um episódio e dar o parecer |
| `publicacao` | agendar e publicar episódios entregues, dentro da autorização registrada |

## Conferir

Depois de criar, confirme que os arquivos existem e que o cabeçalho de cada um é YAML válido:

```bash
ls .claude/agents/
```

Os subagentes novos passam a valer na próxima sessão do Claude Code aberta nesta pasta. Diga isso ao dono.

## Como a Coordenação delega

Ao chamar um subagente, a Coordenação passa o id do episódio e a etapa, por exemplo: "Episódio ep-0003, etapa storyboard. Feche o storyboard com os áudios que já estão em `episodios/ep-0003/audio/`". O subagente começa do zero a cada chamada, então o pedido precisa dizer o episódio e o que se espera de volta.

Arte e Produção podem ser chamadas ao mesmo tempo na etapa `voz_e_assets`, e episódios diferentes podem avançar em paralelo.

## Rotina automática

Só com `piloto_aprovado` e `rotina_autorizada` ligados. O dono escolhe uma das formas:

- **Na sessão aberta:** `/loop` com a instrução de `docs/ciclo.md`. Roda enquanto a sessão estiver aberta.
- **Agendada:** uma tarefa agendada do Claude Code que abre uma sessão nesta pasta e roda um ciclo, no intervalo que o dono definir.
- **À mão:** o dono pede "rode um ciclo" quando quiser.

O setup não cria a rotina. Ela é criada depois do piloto, quando o dono autorizar.

## Registrar

Em `config/projeto.json`: `runtime.tipo` = `claude-code`, `runtime.modo` = `subagentes`, `runtime.agentes_criados` = `true`.
