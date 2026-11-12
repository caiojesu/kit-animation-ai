# Personagens e cenários

## Um personagem é uma pasta de peças

```
personagens/nina/
  personagem.json     a ficha: tamanho e posição de cada peça
  corpo.svg
  olhos-abertos.svg
  olhos-fechados.svg
  boca-fechada.svg
  boca-meia.svg
  boca-aberta.svg
```

Exemplo completo e funcional: `render/exemplo/personagens/boneco/`.

As peças podem ser SVG (o padrão, escritas pela Arte) ou PNG com fundo transparente (arte fornecida pelo dono). A base de render trata os dois do mesmo jeito.

## A ficha

```json
{
  "nome": "Nina",
  "largura": 500,
  "altura": 800,
  "pecas": [
    { "id": "corpo", "tipo": "fixa", "src": "corpo.svg", "x": 0, "y": 0, "largura": 500, "z": 0 },
    {
      "id": "olhos",
      "tipo": "olhos",
      "estados": { "abertos": "olhos-abertos.svg", "fechados": "olhos-fechados.svg" },
      "x": 150, "y": 200, "largura": 200, "z": 1
    },
    {
      "id": "boca",
      "tipo": "boca",
      "estados": { "fechada": "boca-fechada.svg", "meia": "boca-meia.svg", "aberta": "boca-aberta.svg" },
      "x": 190, "y": 290, "largura": 120, "z": 1
    }
  ]
}
```

- `largura` e `altura`: a caixa do personagem, em pixels, antes da escala da cena.
- Cada peça tem `x` e `y` (canto superior esquerdo dentro da caixa), `largura` e `z` (peças com `z` maior ficam na frente).
- `tipo`:
  - `fixa`: sempre visível. Usa `src`.
  - `boca`: troca de estado conforme a fala. Estados `fechada` e `aberta` são obrigatórios; `meia` é opcional.
  - `olhos`: pisca sozinho a cada 3 segundos. Estados `abertos` e `fechados`.

## O que a base anima sozinha

- A boca de quem fala, pelos tempos das palavras ou pelo volume do áudio.
- A piscada dos olhos.
- Um balanço leve do corpo de quem está falando.
- A entrada e a saída do personagem na cena, definidas no storyboard.

Qualquer outro movimento (braço que levanta, objeto na mão) é feito hoje com elementos separados no storyboard, por exemplo uma imagem do objeto que entra junto com a fala. Um movimento novo que precise de código é uma mudança na base de render, combinada com a Produção.

## Variações do mesmo personagem

Uma pose ou roupa diferente é uma pasta nova, com nome que deixa clara a relação: `personagens/nina-sentada/`. Reaproveite as peças que não mudam, copiando os arquivos.

## Cenários

Um cenário é um arquivo só, em `cenarios/`, com proporção 9:16 (1080 × 1920). Ele cobre a tela inteira. Desenhe pensando no que fica por cima: os personagens ocupam o centro e a base, e a legenda fica em torno de 1480 px de altura.

## Objetos

- Objeto que aparece em vários episódios (o produto do estúdio, o logotipo): `cenarios/objetos/` ou uma pasta própria combinada com a Coordenação.
- Objeto de um episódio só: `episodios/<id>/assets/`.

## Consistência

O que mantém a série reconhecível é reaproveitar os mesmos arquivos. Depois que o dono aprova um personagem, as peças dele não mudam sem nova aprovação. A paleta e a espessura do traço ficam registradas na seção 4 do `ESTUDIO.md`.
