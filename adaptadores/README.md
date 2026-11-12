# Adaptadores

As instruções de cada papel ficam em `agentes/`, em texto neutro. Elas são a fonte única. Um adaptador diz como transformar essas instruções em agentes de verdade no runtime em que o setup está rodando.

O `SETUP.md` escolhe o adaptador assim:

| Se o runtime... | Adaptador | Resultado |
|---|---|---|
| é o Claude Code | `claude-code.md` | Subagentes em `.claude/agents/` |
| é outro agente de código com subagentes (Cursor, Codex e similares) | `agentes-de-codigo.md` | Subagentes no formato daquele runtime |
| tem bots persistentes que conversam entre si (OpenBot e similares) | `bots.md` | Um bot por papel |
| não tem nenhum dos dois | `sessao-unica.md` | Uma sessão que assume os papéis em sequência |

## Regra para todos os adaptadores

O agente criado não recebe uma cópia das instruções do papel. Ele recebe uma instrução curta que manda ler `agentes/<chave>.md` e `ESTUDIO.md` a cada tarefa. Assim, uma mudança em `agentes/` vale para todos os runtimes, sem recriar agentes.

A exceção são os runtimes de bots em que o bot não consegue ler arquivos do repositório. Nesse caso, o adaptador copia o texto e registra a data da cópia.

## Estado de teste

| Adaptador | Estado |
|---|---|
| `claude-code.md` | Os arquivos de subagente foram gerados e conferidos. Falta confirmar em uma sessão nova que o Claude Code os carrega |
| `agentes-de-codigo.md` | Não testado. Manda conferir o formato na documentação do runtime |
| `bots.md` | Não testado. Depende das ferramentas que o runtime expõe |
| `sessao-unica.md` | Não testado como runtime separado. Usa só leitura e escrita de arquivos |
