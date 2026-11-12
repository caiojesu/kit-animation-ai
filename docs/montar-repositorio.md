# Montar um repositório próprio de fontes

O conteúdo é melhor quando parte de uma fonte validada. Um caminho é cadastrar sites oficiais. O outro é montar um repositório próprio em `fontes/`: uma pasta com o resumo de reviews, manuais e dados que já existem sobre o seu assunto. Assim o conteúdo parte de quem já tem autoridade no tema.

Um exemplo: partir de canais de review do seu nicho, com o agente transcrevendo os vídeos e listando cada review com os seus pontos principais. É um trabalho de várias horas de agente, que pode render milhares de informações sobre produtos.

Este guia não faz parte do setup. É um trabalho longo, feito uma vez, quando você decidir.

## Antes de começar

Três decisões são suas, e o agente não as toma por você:

- **De quais fontes partir.** Escolha canais, sites ou documentos de quem tem autoridade real no assunto.
- **Se você pode usar aquele material.** Baixar e processar em massa o conteúdo de terceiros pode contrariar os termos de uso da plataforma e os direitos do autor. Confira os termos e, na dúvida, peça permissão ou use só material próprio, oficial ou de uso livre.
- **Como o material vai ser usado.** O repositório guarda fatos e avaliações resumidos, com a origem. Ele sustenta o que o roteiro afirma. Ele não serve para reproduzir o roteiro, as falas ou as imagens de ninguém.

## O que fica em `fontes/`

```
fontes/
  INDICE.md              a lista do que existe, consultada pela Coordenação
  <assunto>/<item>.md    um arquivo por item (um produto, um tema)
  bruto/                 material baixado; fora do git
```

Cada arquivo de item segue o mesmo molde:

```markdown
# [Nome do item]

- **Categoria:** [...]
- **Origem:** [quem avaliou, link, data]
- **Função da fonte:** [opiniao, manual, oficial ou proprio]

## Pontos principais
- [fato ou avaliação, um por linha]

## A favor
- [...]

## Contra
- [...]

## Para quem serve
- [...]
```

A origem e a data em cada arquivo permitem que a Revisão confira de onde veio cada afirmação.

## O pedido ao agente

Faça em uma sessão dedicada, com esforço alto, e acompanhe as primeiras entregas antes de deixar rodar.

> Monte um repositório de fontes em `fontes/` sobre [assunto], a partir de: [lista de fontes que você escolheu e pode usar].
>
> Para cada [vídeo, artigo ou página]: extraia cada item avaliado e escreva um arquivo em `fontes/<assunto>/<item>.md`, seguindo o molde de `docs/montar-repositorio.md`. Registre a origem e a data em cada arquivo. Resuma com as suas palavras, sem copiar trechos longos. Se o mesmo item aparece em mais de uma fonte, junte no mesmo arquivo e mantenha as duas origens.
>
> Comece por [3 fontes], me mostre o resultado e espere a minha confirmação antes de continuar. No fim, atualize `fontes/INDICE.md` com uma linha por item.

Começar por uma amostra pequena evita descobrir depois de cinco horas que o molde estava errado.

## Depois de montar

Peça à Coordenação para cadastrar o repositório na seção 2 do `ESTUDIO.md`, com a função certa. Um repositório feito de reviews é fonte `opiniao`: sustenta recomendações editoriais, mas não sustenta alegações de saúde ou segurança, que exigem fonte `oficial`.

Revise o repositório de tempos em tempos. Preço, disponibilidade e especificação de produto envelhecem rápido.
