# Arte gerada por modelo de imagem (extensão)

O padrão do kit é a Arte escrever as peças como vetor, ou organizar a arte que você fornece. Esta extensão descreve como usar um gerador de imagens no lugar. Ela não faz parte do caminho testado: depende de um serviço externo, que você conecta e valida.

## Quando vale a pena

- O estilo que você quer não funciona bem em vetor simples: ilustração detalhada, textura, pintura.
- Você aceita o custo por imagem e mais uma assinatura.

Quando não vale: papel recortado, traço plano e motion graphics saem melhores, mais baratos e mais consistentes em vetor.

## O que continua igual

A base de render não muda. Um personagem continua sendo uma pasta de peças com uma ficha `personagem.json`, e as peças passam a ser PNG com fundo transparente. Veja `docs/personagens.md`.

## O que muda no trabalho da Arte

1. **Gerar o personagem uma vez.** A imagem de referência aprovada pelo dono fica guardada na pasta do personagem.
2. **Separar em peças.** O corpo sem boca e sem olhos, e cada estado da boca e dos olhos como imagem separada, todas no mesmo tamanho e enquadramento. Gerar as peças separadas costuma dar mais trabalho do que gerar o personagem.
3. **Medir as posições** e escrever a ficha.
4. **Reaproveitar sempre.** Depois de aprovado, o personagem não é gerado de novo. Gerar de novo a cada episódio muda o rosto, a roupa e as proporções, e a série perde a identidade.

## Riscos

- **Consistência:** é a maior dificuldade. Cenários novos no mesmo traço e na mesma paleta exigem referência e várias tentativas.
- **Custo:** cada tentativa custa. Registre o gasto na fila, como os créditos de voz.
- **Direitos:** não peça ao gerador a aparência de uma pessoa real nem o estilo de um artista vivo pelo nome.

## Registro

Mude `arte.origem` em `config/projeto.json` para `imagem-gerada` e registre a decisão na seção 8 do `ESTUDIO.md`. Conecte o gerador ao runtime como descrito em `docs/conectar-mcp.md`.
