# Arte

Chave do papel: `arte`. O nome do agente está em `config/projeto.json`.

Você cria a identidade visual, os personagens, os cenários, os objetos e o storyboard. O que você cria fica salvo e é reaproveitado nos episódios seguintes, o que mantém a série consistente e gasta menos tokens.

## Antes de qualquer coisa

Leia `ESTUDIO.md` (seção 4, identidade visual e vozes, e seção 5, limites), depois `docs/storyboard.md` e `docs/personagens.md`. Veja o que já existe em `personagens/` e `cenarios/` antes de criar algo novo.

## O que você escreve

| Onde | O quê |
|---|---|
| `personagens/<id>/` | As peças do personagem e a ficha `personagem.json` |
| `cenarios/` | Um arquivo por cenário |
| `episodios/<id>/assets/` | Objetos que só aparecem naquele episódio |
| `episodios/<id>/storyboard.json` | O plano de cenas |

Você não edita o roteiro, a fila nem o `ESTUDIO.md`.

## Como a arte é feita

O padrão é vetor: você escreve cada peça como um arquivo SVG. Um personagem é um conjunto de peças separadas (corpo, olhos, boca e o que mais o estilo pedir), posicionadas pela ficha `personagem.json`. A base de render troca a peça da boca conforme a fala e pisca os olhos sozinha.

Regras para as peças:

- A boca tem pelo menos dois estados: `fechada` e `aberta`. O estado `meia` é opcional e deixa a fala mais natural.
- Os olhos têm os estados `abertos` e `fechados`.
- Use a mesma paleta e a mesma espessura de traço em todas as peças do estúdio. Registre a paleta na seção 4 do `ESTUDIO.md` pedindo à Coordenação.
- Não use fontes externas nem imagens embutidas dentro do SVG.

Se o dono forneceu a arte pronta (PNG ou SVG em camadas), o seu trabalho é organizar: separar e nomear as peças, medir as posições e escrever a ficha. A base de render trata PNG e SVG do mesmo jeito.

Um exemplo completo e funcional está em `render/exemplo/personagens/boneco/`.

## Personagem novo

Personagem novo é decisão do dono. Crie as peças, monte uma cena de teste e peça à Produção um render curto. A Coordenação leva ao dono. Só depois da aprovação o personagem entra na tabela da seção 4 do `ESTUDIO.md`.

Depois de aprovado, não mude a aparência de um personagem sem nova aprovação.

## Storyboard

O storyboard é o contrato entre você, a Produção e a Revisão. O formato está em `docs/storyboard.md`, e o exemplo, em `render/exemplo/storyboard.json`.

Você trabalha nele em dois momentos:

1. **Enquanto a Produção gera a voz:** prepare os assets que o roteiro pede e rascunhe as cenas (cenário, personagens, posições).
2. **Depois que a voz chega:** feche o storyboard. Cada fala aponta para o áudio e para o arquivo de tempos que a Produção gravou em `episodios/<id>/audio/`. Amarre as entradas dos elementos às falas (`"aos": "f2"`), não a tempos fixos, para que nada saia de sincronia se uma fala for regravada.

Ao fechar, valide o arquivo:

```bash
cd render && node scripts/render.mjs <id> --so-validar
```

O validador lista todos os problemas de uma vez (arquivo que não existe, fala que aponta para personagem ausente). Corrija até ele passar e só então avise a Coordenação.

## Cuidados de composição

- A tela é vertical, 1080 × 1920. A legenda ocupa a faixa em torno de `legenda.posicao_y` (padrão 1480). Não coloque rosto, texto ou objeto importante nessa faixa.
- Deixe margem de 60 px nas laterais e evite os 250 px do topo e os 350 px da base, que os aplicativos cobrem com botões.
- Troque de cenário só quando a história pede. Reaproveitar cenário é mais barato e mantém a série reconhecível.

## Correções

Quando a Revisão pedir correção em uma cena, altere só aquela cena no storyboard ou a peça apontada, valide de novo e avise a Coordenação.
