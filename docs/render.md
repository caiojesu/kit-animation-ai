# A base de render

A pasta `render/` é um projeto [Remotion](https://www.remotion.dev) mínimo e sem estilo. Ela lê um `storyboard.json` e gera o vídeo: toca as cenas em ordem, posiciona personagens, imagens e textos, toca as falas, mexe as bocas e escreve a legenda. O estilo vem das peças que a Arte cria, não do código.

## Requisitos

- Node.js 18 ou mais novo.
- Cerca de 800 MB em `render/node_modules/`, contando o navegador que o Remotion baixa no primeiro render.

O Remotion tem licença própria: é gratuito para uso individual e para empresas pequenas, e pago acima de certo tamanho de empresa. Confira os termos atuais em remotion.dev/license antes de usar comercialmente.

## Instalar e testar

```bash
cd render
```

```bash
npm install
```

```bash
npm run exemplo
```

O último comando gera áudios de teste, renderiza `render/exemplo/` e grava o resultado em `render/exemplo/corte/`. Se sair um `v1.mp4` com um boneco falando, a base funciona nesta máquina.

## Renderizar um episódio

```bash
node scripts/render.mjs ep-0001 --quadros
```

| Opção | O que faz |
|---|---|
| `--quadros` | Extrai um quadro por segundo, em meia resolução, para a Revisão |
| `--so-validar` | Só valida o storyboard, sem renderizar |
| `--sem-master` | Pula a normalização do áudio |

O argumento é o id do episódio (`ep-0001` vira `episodios/ep-0001/`) ou um caminho de pasta relativo à raiz do repositório.

## O que sai

Em `episodios/<id>/corte/`:

- `v<N>.mp4`: o corte. A versão soma 1 a cada render, e as anteriores não são apagadas.
- `v<N>-quadros/q-001.jpg...`: os quadros de conferência.
- `v<N>.relatorio.json`: duração, tamanho, número de cenas e falas, falas sem tempos, estado do master de áudio e tempo de render.

## O que o script faz, em ordem

1. Valida o storyboard e lista todos os problemas.
2. Lê vídeo, legenda e áudio de `config/projeto.json`.
3. Copia para uma pasta temporária só os arquivos que o episódio usa.
4. Renderiza.
5. Normaliza o áudio para o alvo de `audio.lufs_alvo` e `audio.pico_maximo_dbtp`.
6. Extrai os quadros e escreve o relatório.

## Configuração

Em `config/projeto.json`:

- `video`: largura, altura, quadros por segundo e poses por segundo (o passo do movimento).
- `legenda`: fonte, tamanho, cores, posição vertical e quantos caracteres cabem em cada bloco.
- `audio`: o alvo de volume.

A fonte da legenda precisa estar instalada na máquina que renderiza. O padrão é Arial, que existe em quase todo sistema.

## Limites da base

- Os movimentos prontos são entrada, saída, boca, piscada e balanço de quem fala. Não há movimento de braço ou caminhada.
- Não há trilha musical nem efeitos sonoros. Só as falas.
- Não há transição entre cenas. O corte é seco.
- A medida de volume é a normalização do ffmpeg embutido no Remotion. O relatório diz se ela foi aplicada, mas não mede o resultado.

Para ir além, a Produção propõe a mudança à Coordenação e edita `render/src/`. Depois de qualquer mudança, rode `npm run exemplo` para confirmar que a base continua funcionando.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/tipos.ts` | Os tipos do storyboard e da ficha de personagem |
| `src/Raiz.tsx` | Registra a composição e calcula a duração a partir dos áudios |
| `src/Episodio.tsx` | Toca as cenas e as falas |
| `src/Elemento.tsx` | Posiciona e anima a entrada de cada elemento |
| `src/Personagem.tsx` | Monta as peças, a boca e a piscada |
| `src/Legenda.tsx` | Escreve a legenda |
| `scripts/render.mjs` | Valida, renderiza, normaliza e relata |
| `scripts/alinhamento-para-tempos.mjs` | Converte alinhamento por caractere em tempos por palavra |
| `scripts/gerar-audio-teste.mjs` | Gera os áudios do episódio de exemplo |
