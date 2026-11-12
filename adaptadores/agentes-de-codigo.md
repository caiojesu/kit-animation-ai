# Adaptador: outros agentes de código (Cursor, Codex e similares)

Este adaptador não foi testado. O formato de subagentes muda de runtime para runtime e de versão para versão, então ele manda conferir antes de escrever.

## Passo 1: descobrir o formato

Antes de criar qualquer arquivo, descubra como este runtime define subagentes ou agentes personalizados:

1. Procure na pasta do projeto e na pasta do usuário uma configuração existente de agentes deste runtime.
2. Consulte a documentação atual do runtime, se você tem acesso à web.
3. Se não conseguir confirmar o formato, pergunte ao dono ou use `sessao-unica.md`.

Não escreva arquivos em um formato suposto. Um arquivo de agente no lugar errado é ignorado em silêncio, e o dono só descobre quando a esteira não anda.

## Passo 2: criar um agente por papel

Para cada papel ativo em `config/projeto.json`, exceto `coordenacao`, crie um agente no formato confirmado, com:

- **Identificador:** a chave do papel (`arte`, `producao`, `revisao`, `publicacao`).
- **Descrição:** o nome escolhido pelo dono e a responsabilidade do papel, em uma linha.
- **Instruções:** o mesmo texto curto usado no adaptador do Claude Code (`adaptadores/claude-code.md`, seção "O que criar"), que manda ler `agentes/<chave>.md` e `ESTUDIO.md` a cada tarefa.

A Coordenação é a sessão principal. O `AGENTS.md` da raiz, que a maioria desses runtimes lê sozinha, já diz isso.

## Passo 3: conferir

Liste os agentes pelo comando ou pela tela do runtime e confirme que os papéis aparecem. Se não aparecem, o formato ou o lugar está errado: corrija ou passe para `sessao-unica.md`.

## Se o runtime não tem subagentes

Use `sessao-unica.md`.

## Rotina automática

Use o recurso de agendamento ou de execução em segundo plano do runtime, se houver, com a instrução de `docs/ciclo.md`. Se não houver, o dono dispara o ciclo à mão.

## Registrar

Em `config/projeto.json`: `runtime.tipo` = o nome do runtime, `runtime.modo` = `subagentes`, `runtime.agentes_criados` = `true` só depois de conferir no passo 3.
