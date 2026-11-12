# O ciclo da Coordenação

O ciclo é a instrução única que faz o estúdio rodar sozinho. Cada runtime agenda o ciclo do seu jeito (veja `adaptadores/`), e o dono também pode disparar à mão, pedindo "rode um ciclo".

Rodar o ciclo duas vezes seguidas não causa dano: ele sempre parte do que está em `producao/fila.json`, então pode ser interrompido e retomado.

## Pré-condições

O ciclo automático só roda se, em `config/projeto.json`:

- `operacao.piloto_aprovado` é `true`, e
- `operacao.rotina_autorizada` é `true`.

As duas chaves nascem desligadas, e só o dono liga. Se uma delas estiver desligada, o ciclo não faz nada e diz qual falta.

Um lote pedido à mão pelo dono ("abra um lote de 5 temas") exige só `piloto_aprovado`.

## Instrução do ciclo

> Você é a Coordenação. Rode um ciclo:
>
> 1. Leia `ESTUDIO.md`, `config/projeto.json` e `producao/fila.json`.
> 2. Confira as pré-condições. Se faltar alguma, pare e diga qual.
> 3. Confira os tetos (lista abaixo). Se algum foi atingido, grave o motivo em `rotina.parada` na fila e pare.
> 4. Para cada episódio que não está `entregue`, `publicado`, `escalado` nem `cancelado`: veja se a entrega da etapa atual existe. Se existe, avance a etapa. Se não existe e ninguém está trabalhando nela, delegue ao papel responsável.
> 5. Se há espaço no lote e nos tetos, abra episódios novos em `pauta`, variando categoria, ângulo e formato e respeitando o intervalo de repetição.
> 6. Grave `rotina.ultimo_ciclo_em` e limpe `rotina.parada` se o ciclo rodou sem parar.
> 7. Termine com um resumo de três linhas: o que avançou, o que está parado e por quê, e o que espera o dono.

## Tetos que param o ciclo

Todos ficam em `config/projeto.json`.

| Teto | Campo | O ciclo para quando |
|---|---|---|
| Custo por vídeo | `tetos.custo_por_video` | Um episódio passaria do valor. Só aquele episódio é escalado |
| Custo por dia | `tetos.custo_por_dia` | A soma de `gastos.custo_no_dia` na fila chega ao valor |
| Volume | `operacao.meta_videos_dia` | O número de episódios abertos no dia chega à meta |
| Lote | `operacao.tamanho_lote` | Há esse número de episódios em andamento |
| Disco | `tetos.disco_gb` | `episodios/` e `entregas/` somados passam do valor |
| Render | `tetos.renders_simultaneos` | Não para o ciclo; só segura novos renders |
| Escalados | `operacao.max_episodios_escalados` | Há esse número de episódios em `escalado` |

Um teto com valor `null` ou `0` ainda não foi definido pelo dono. Trate como "não autorizado": o ciclo automático não abre episódios novos até o dono definir. Os episódios em andamento continuam.

`gastos.dia` guarda a data dos contadores do dia. Se a data mudou, zere `custo_no_dia` e `creditos_voz_no_dia` antes de conferir.

Para medir o disco:

```bash
du -sh episodios entregas
```

## Quando o ciclo para

Ele grava em `rotina.parada` um objeto com `em` (data e hora), `motivo` e `o_que_falta`. Ele não segue produzindo calado, nem contorna o teto. O dono vê o motivo na fila ou no resumo do ciclo.

## Tamanho do ciclo

Um ciclo faz cada episódio avançar no máximo uma etapa. Isso mantém cada rodada curta e previsível, e evita que uma sessão longa perca o fio. Para produzir mais, o runtime roda o ciclo mais vezes.
