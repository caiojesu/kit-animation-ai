# A esteira

Cada episódio avança sozinho, sem esperar o lote. Assim o time está sempre trabalhando em alguma coisa, e vários vídeos avançam ao mesmo tempo.

## Etapas

O campo `etapa` de cada episódio em `producao/fila.json` usa estes valores. Só a Coordenação muda a etapa.

| Etapa | Quem age | O que precisa existir para avançar | Próxima etapa |
|---|---|---|---|
| `pauta` | Coordenação | Tema, formato e ângulo definidos na fila | `roteiro` |
| `roteiro` | Coordenação | `episodios/<id>/roteiro.md` | `revisao_roteiro` |
| `revisao_roteiro` | Revisão | `pareceres/roteiro-r<N>.md` com resultado `aprovado` | `voz_e_assets` |
| `voz_e_assets` | Produção e Arte, ao mesmo tempo | Áudio de todas as falas em `audio/` e assets prontos | `storyboard` |
| `storyboard` | Arte | `storyboard.json` validado com `--so-validar` | `montagem` |
| `montagem` | Produção | `corte/v<N>.mp4`, quadros e relatório | `revisao_corte` |
| `revisao_corte` | Revisão | `pareceres/corte-v<N>.md` com resultado `aprovado` | `aprovado` |
| `aprovado` | Coordenação | `entregas/<id>/video.mp4` e `post.md` | `entregue` |
| `entregue` | Publicação, se ativa | `entregas/<id>/publicacao.json` | `publicado` |

Etapas fora da linha:

- `escalado`: as rodadas de correção acabaram, ou falta uma decisão do dono. O campo `bloqueio` diz o motivo. O episódio fica parado até o dono responder.
- `cancelado`: o dono ou a Coordenação desistiu do episódio. O campo `bloqueio` diz o motivo.

## Quando a Revisão pede correção

- No roteiro: a etapa volta para `roteiro`, e `rodada_roteiro` soma 1.
- No corte: a etapa volta para `storyboard` (problema de imagem) ou `montagem` (problema de voz ou render), e `rodada_corte` soma 1. A correção é só na cena apontada.

Quando a rodada passa do máximo de `config/projeto.json`, a etapa vira `escalado`.

## Um episódio na fila

```json
{
  "id": "ep-0001",
  "tema": "Ração a granel: vale a pena?",
  "formato": "V",
  "angulo": "custo por unidade",
  "categoria": "alimentação",
  "piloto": true,
  "continua_de": null,
  "etapa": "revisao_roteiro",
  "rodada_roteiro": 0,
  "rodada_corte": 0,
  "versao_corte": null,
  "render_em_andamento": false,
  "custo": { "creditos_voz": 0, "valor": 0, "tempo_render_s": 0 },
  "bloqueio": null,
  "criado_em": "2026-01-15",
  "atualizado_em": "2026-01-15"
}
```

O id é `ep-` seguido de quatro dígitos, tirado de `proximo_numero`, que soma 1 a cada episódio aberto.

## A pasta de um episódio

```
episodios/ep-0001/
  roteiro.md            Coordenação
  storyboard.json       Arte
  assets/               Arte: objetos só deste episódio
  audio/                Produção: f1.mp3, f1.json, f2.mp3...
  corte/                Produção: v1.mp4, v1-quadros/, v1.relatorio.json
  pareceres/            Revisão: roteiro-r0.md, corte-v1.md
```

Cada papel escreve só nos seus arquivos. Isso evita que dois agentes sobrescrevam o mesmo arquivo quando rodam ao mesmo tempo.

## Regras da fila

- A Coordenação lê a fila antes de qualquer decisão e atualiza `atualizado_em` a cada mudança.
- Antes de mudar uma etapa, a Coordenação confere se o arquivo de entrega daquela etapa existe. O aviso de outro papel é um relato, e o arquivo é a prova.
- `render_em_andamento` fica `true` do início ao fim de um render. A soma desses campos não pode passar de `tetos.renders_simultaneos`.
- Episódios entregues ficam na fila. Eles são o histórico que evita repetir tema.
