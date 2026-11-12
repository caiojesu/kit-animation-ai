# Adaptador: sessão única

Para runtimes sem subagentes e sem bots. Uma sessão só assume os quatro papéis, um de cada vez.

## Como funciona

A sessão é a Coordenação por padrão. Quando a esteira pede outro papel, a sessão troca de papel de forma explícita:

1. Diga em uma linha: "Assumindo o papel de <Papel> para o episódio <id>, etapa <etapa>".
2. Leia `agentes/<chave>.md` e siga só aquelas instruções, escrevendo só nos arquivos daquele papel.
3. Ao terminar, diga: "Voltando à Coordenação".

## A Revisão em sessão única

A independência da Revisão é mais fraca aqui, porque quem revisa é a mesma sessão que escreveu. Para compensar:

- Revise em uma **conversa nova**, sem o histórico da escrita. Peça ao dono para abrir outra conversa nesta pasta e dizer: "Assuma o papel de Revisão e revise o episódio <id>".
- Se isso não for possível, a sessão relê `agentes/revisao.md` e confere item por item contra os arquivos, sem confiar na memória do que escreveu.
- O parecer registra, em "O que ficou sem conferência", que a revisão foi feita pela mesma sessão.

Diga ao dono, no fim do setup, que neste modo ele deve olhar os pilotos com mais atenção.

## O que não existe neste modo

- Trabalho em paralelo: a voz e os assets são feitos um depois do outro.
- Rotina automática, a menos que o runtime tenha agendamento. O dono dispara o ciclo à mão.

## Registrar

Em `config/projeto.json`: `runtime.tipo` = o nome do runtime, `runtime.modo` = `sessao-unica`, `runtime.agentes_criados` = `true`.
