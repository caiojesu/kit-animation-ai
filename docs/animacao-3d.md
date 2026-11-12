# Animação com assets 3D (extensão)

A base de render do kit desenha peças 2D: imagens SVG ou PNG posicionadas em cena. Ela não carrega modelos 3D. Há dois caminhos para um visual 3D, como low poly. Nenhum dos dois faz parte do caminho testado.

## Caminho 1: 3D pré-renderizado em imagens

Funciona com a base como está, sem mudar código.

1. Modele o personagem em um programa 3D, como o Blender.
2. Com a câmera e a luz fixas, exporte como PNG com fundo transparente, todos no mesmo tamanho e enquadramento:
   - o corpo, sem boca e sem olhos (ou com a boca fechada, se a boca for um recorte por cima);
   - cada estado da boca: fechada, meia e aberta;
   - os olhos abertos e fechados.
3. Monte a pasta do personagem e a ficha `personagem.json`, como em `docs/personagens.md`.
4. Faça o mesmo com os cenários: um PNG de 1080 × 1920 por cenário.

O que você ganha: visual 3D, com o custo de render e a consistência do 2D.

O que você não tem: o personagem não gira, a câmera não se move e a luz não muda dentro da cena. Um ângulo novo é um conjunto novo de imagens, em uma pasta nova (`personagens/nina-perfil/`).

Registre `arte.origem` como `fornecida` em `config/projeto.json`.

## Caminho 2: 3D de verdade no render

O Remotion renderiza cenas 3D com o pacote `@remotion/three`, que integra o React Three Fiber. Para usar, a base precisa ser estendida pela Produção:

1. Instalar `@remotion/three`, `three` e `@react-three/fiber` em `render/`.
2. Criar um tipo novo de elemento no storyboard, por exemplo `modelo3d`, com o caminho de um arquivo `.glb`, a posição, a rotação e a animação a tocar.
3. Escrever o componente que monta a cena 3D (câmera, luzes) e carrega o modelo, e registrar o tipo em `render/src/Elemento.tsx` e `render/src/tipos.ts`.
4. Ensinar o validador de `render/scripts/render.mjs` a aceitar o tipo novo e copiar os arquivos `.glb`.
5. Resolver a fala: ou o modelo tem formas de boca (blend shapes) guiadas pelos tempos das palavras, ou a boca continua sendo uma peça 2D por cima.
6. Documentar o tipo novo em `docs/storyboard.md` e rodar `npm run exemplo` para confirmar que o 2D continua funcionando.

O que pesar antes:

- **Render mais lento.** Cada quadro é uma cena 3D renderizada no navegador. A fila de render enche mais rápido, e o teto de renders simultâneos importa mais.
- **Quem faz os modelos.** A Arte escreve vetor, mas não modela em 3D. Os modelos vêm de você, de um banco de assets com licença adequada ou de uma ferramenta externa.
- **Mais código para manter.** É a maior mudança que a base pode receber.

Confira a documentação atual do Remotion sobre `@remotion/three` antes de começar: os nomes dos pacotes e as versões compatíveis mudam.

## Recomendação

Comece pelo caminho 1. Ele valida se o visual 3D funciona para o seu público com custo baixo. Parta para o caminho 2 só se a história precisar de câmera ou personagem em movimento no espaço.

Em qualquer dos dois, o visual 3D é um formato novo: peça um piloto à Coordenação e aprove antes de produzir em lote.
