# O storyboard

`episodios/<id>/storyboard.json` é o contrato entre a Arte (que escreve), a Produção (que renderiza) e a Revisão (que confere). A base de render lê só esse arquivo e os arquivos que ele aponta.

Exemplo completo e funcional: `render/exemplo/storyboard.json`.

## Regras gerais

- Todos os caminhos são relativos à raiz do repositório: `cenarios/sala.svg`, `episodios/ep-0001/audio/f1.mp3`.
- A tela tem 1080 × 1920. O ponto (0, 0) é o canto superior esquerdo.
- A duração de cada cena não é escrita: ela é calculada a partir do áudio real das falas. É assim que o storyboard é fechado com os tempos reais da voz.

## Estrutura

```json
{
  "episodio": "ep-0001",
  "formato": "V",
  "cenas": [
    {
      "id": "c1",
      "cenario": "cenarios/sala.svg",
      "elementos": [],
      "falas": []
    }
  ]
}
```

## Cena

| Campo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | Único no episódio: `c1`, `c2`... |
| `cenario` | não | Imagem de fundo, que cobre a tela inteira |
| `corDeFundo` | não | Cor usada quando não há cenário |
| `elementos` | não | O que aparece na cena |
| `falas` | não | As falas, na ordem em que são ditas |
| `duracaoMinMs` | não | A cena dura pelo menos isso. Sem falas, o padrão é 2000 |
| `respiroInicialMs` | não | Silêncio antes da primeira fala. Padrão 200 |
| `respiroFinalMs` | não | Silêncio depois da última fala. Padrão 300 |

## Elementos

Todo elemento tem `id` (único na cena), `tipo`, `x`, `y` e, se quiser, `entrada` e `saiAos`.

### `personagem`

```json
{
  "id": "nina",
  "tipo": "personagem",
  "personagem": "personagens/nina",
  "x": 540,
  "y": 1560,
  "escala": 1.2,
  "espelhar": false,
  "entrada": { "tipo": "sobe", "aos": 0 }
}
```

`x` e `y` marcam o centro da base do personagem (os pés). `personagem` é a pasta que contém a ficha `personagem.json` (veja `docs/personagens.md`).

### `imagem`

```json
{ "id": "pacote", "tipo": "imagem", "src": "episodios/ep-0001/assets/pacote.svg", "x": 800, "y": 760, "largura": 320 }
```

`x` e `y` marcam o centro da imagem. A altura acompanha a proporção.

### `texto`

```json
{ "id": "titulo", "tipo": "texto", "texto": "Vale a pena?", "x": 540, "y": 420, "tamanho": 92, "cor": "#1B1B1B", "fundo": "#FFFFFF" }
```

`x` e `y` marcam o centro do texto. `fundo` desenha uma etiqueta atrás dele. `larguraMaxima` controla a quebra de linha.

### Entrada e saída

```json
"entrada": { "tipo": "pop", "aos": "f2" },
"saiAos": "f3"
```

- `tipo`: `nenhuma`, `pop`, `sobe`, `desliza-esquerda`, `desliza-direita` ou `fade`.
- `aos`: quando o elemento aparece. Pode ser um número (milissegundos desde o início da cena) ou o id de uma fala da mesma cena (o elemento entra quando a fala começa).
- `saiAos`: quando o elemento some, no mesmo formato.

Prefira o id da fala. Se a fala for regravada e mudar de duração, o elemento continua entrando na hora certa.

O movimento é em passos, na taxa de `video.poses_por_segundo` (padrão 12), o que dá o aspecto de stop motion.

## Falas

```json
{
  "id": "f1",
  "quem": "nina",
  "texto": "Ração a granel vale a pena?",
  "audio": "episodios/ep-0001/audio/f1.mp3",
  "tempos": "episodios/ep-0001/audio/f1.json",
  "pausaDepoisMs": 150
}
```

| Campo | Obrigatório | O que é |
|---|---|---|
| `id` | sim | Único na cena, igual ao id da fala no roteiro |
| `quem` | não | O `id` do elemento personagem que fala. Sem ele, a fala é narração |
| `texto` | sim | O texto da legenda. Deve ser igual ao do roteiro aprovado |
| `audio` | não | O arquivo de áudio. Sem ele, use `duracaoMs` |
| `tempos` | não | O JSON de tempos das palavras (veja `docs/voz.md`) |
| `pausaDepoisMs` | não | Silêncio depois da fala. Padrão 150 |

O que os tempos mudam:

- **Com tempos:** a legenda destaca a palavra falada, e a boca abre só dentro de cada palavra.
- **Sem tempos:** a legenda é distribuída pela duração da fala, sem destaque, e a boca acompanha o volume do áudio.

## Validar

```bash
cd render && node scripts/render.mjs <id> --so-validar
```

O validador confere que todo arquivo apontado existe, que os ids não se repetem e que cada `quem` e cada `aos` apontam para algo da mesma cena. Ele lista todos os problemas de uma vez.
