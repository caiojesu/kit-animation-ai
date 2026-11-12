# Kit de estúdio de animação

Um repositório-modelo para montar um estúdio de animação operado por agentes de IA. O estúdio pesquisa em fontes que você cadastra, escreve roteiros, cria personagens, gera vozes, renderiza vídeos verticais curtos e revisa o próprio trabalho, com você aprovando os pilotos.

## Como começar

1. Clone ou baixe este repositório. Cada cópia é um estúdio: para um segundo perfil, faça outra cópia em outra pasta.
2. Abra o seu agente na pasta do repositório (Claude Code, Cursor, Codex, OpenBot ou outro).
3. Diga:

> Leia o SETUP.md e siga as instruções.

O agente detecta em qual runtime está, faz uma entrevista curta sobre a intenção do estúdio (oito blocos, uma pergunta por vez, sempre com uma recomendação), preenche o `ESTUDIO.md` e cria os agentes. No fim, ele entrega o pedido do primeiro piloto, pronto para copiar.

## O que você precisa

| Item | Para quê | Obrigatório |
|---|---|---|
| Um runtime de agentes | Rodar os papéis | Sim |
| Node.js 18 ou mais novo | Renderizar os vídeos | Sim |
| Um serviço de voz (recomendado: ElevenLabs) | Vozes dos personagens | Sim, para vídeos com fala |
| Um agendador de posts | Publicar automaticamente | Não |

O kit foi construído e testado com o Claude Code.

O Remotion tem licença própria, gratuita para uso individual e empresas pequenas. Confira os termos em remotion.dev/license antes de usar comercialmente.

## Os quatro papéis

| Papel | Responsabilidade | Entrega principal |
|---|---|---|
| Coordenação | Pauta, pesquisa, roteiro, coordenação, custos e entrega | Roteiro com fontes e fila atualizada |
| Arte | Identidade visual, personagens, objetos e storyboard | Plano de cenas e assets consistentes |
| Produção | Vozes, animação, legenda, som, render e master | Vídeo, quadros de conferência e relatório técnico |
| Revisão | Revisão independente do roteiro e do vídeo | Parecer com evidência e correção pedida |

A Publicação é um quinto papel, opcional, que nasce desligado.

Como os papéis viram agentes depende do runtime:

- **Claude Code, Cursor, Codex e similares:** a Coordenação é a sessão principal, e os outros papéis são subagentes.
- **OpenBot e similares:** cada papel é um bot.
- **Outros:** uma sessão assume os papéis em sequência.

## A esteira

1. A Coordenação pesquisa e escreve o roteiro.
2. A Revisão avalia o roteiro.
3. A Produção gera a voz e os tempos, enquanto a Arte prepara os assets.
4. A Arte fecha o storyboard com os tempos reais da voz.
5. A Produção monta e exporta o vídeo.
6. A Revisão avalia o corte.
7. A Coordenação entrega o vídeo aprovado.
8. A publicação acontece conforme a autorização registrada.

Cada episódio avança sozinho, sem esperar o lote. São até duas rodadas de correção em cada portão; depois disso, o episódio é escalado para você, sem aprovação automática.

## Do piloto ao automático

1. **Piloto.** O primeiro vídeo completo de um formato. Você avalia e aprova. Invista tempo aqui: os episódios ficam bons quando os pilotos ficam bons.
2. **Lote.** Com o piloto aprovado, você pede uma quantidade de temas.
3. **Rotina.** Com a rotina autorizada, a Coordenação roda ciclos sozinha, dentro dos tetos de custo, disco e volume que você definiu.

As chaves `piloto_aprovado` e `rotina_autorizada` ficam em `config/projeto.json`, nascem desligadas, e só você liga.

## Estrutura

```
SETUP.md            o prompt de instalação
ESTUDIO.md          as decisões vigentes do estúdio (o arquivo que manda)
AGENTS.md           orientação que os agentes leem ao abrir a pasta
config/projeto.json configuração, tetos e chaves de operação
agentes/            instruções de cada papel
adaptadores/        como criar os agentes em cada runtime
formatos/           V (veredito), L (lista), H (história) e o modelo para formatos novos
modelos/            roteiro, parecer e post
producao/fila.json  em que etapa está cada episódio
episodios/          uma pasta por episódio
entregas/           vídeo aprovado e texto do post
personagens/        peças e fichas dos personagens
cenarios/           cenários reaproveitados
fontes/             repositório próprio de fontes
render/             base de render em Remotion, com um episódio de exemplo
docs/               esteira, ciclo, storyboard, personagens, voz, render e extensões
```

## Testar o render sem gastar

```bash
cd render
```

```bash
npm install
```

```bash
npm run exemplo
```

Isso gera áudios de teste no lugar da voz e renderiza um episódio de exemplo em `render/exemplo/corte/`.

## O que foi testado

| Parte | Estado |
|---|---|
| Base de render: cenas, personagens, boca, legenda, master de áudio, quadros | Testada com o episódio de exemplo, no Windows, com Node 25 e Remotion 4.0 |
| Setup no Claude Code | Os passos foram executados uma vez por quem escreveu o kit, com um estúdio fictício. Falta rodar em uma sessão nova, com entrevista real, e confirmar que os subagentes são carregados |
| Conversor de alinhamento para tempos | Testado com um alinhamento de exemplo |
| Voz pelo ElevenLabs | Não testada. Valide no primeiro piloto |
| Criação de bots no OpenBot e similares | Não testada |
| Subagentes no Cursor e no Codex | Não testados |
| Publicação por agendador | Não testada |
| Um piloto completo, do roteiro ao corte aprovado | Não executado |

## Cuidados

- **Espaço em disco.** Em modo automático, os vídeos chegam rápido a dezenas de GB. Defina `tetos.disco_gb` e apague os cortes antigos dos episódios entregues. Os vídeos ficam fora do git.
- **Pasta sincronizada.** Evite manter o estúdio em uma pasta de nuvem (OneDrive, Dropbox, iCloud): `node_modules` e os vídeos são sincronizados à toa e deixam tudo lento.
- **Fila de render.** Vários renders ao mesmo tempo sobrecarregam a máquina. Comece com 1.
- **Fontes.** Alegações de saúde, segurança, lei e dinheiro exigem fonte oficial. Sem fonte cadastrada, o estúdio só produz opinião e entretenimento.
- **Conteúdo de terceiros.** Um vídeo de referência serve para entender a estrutura de um formato, não para ser copiado.

## Extensões documentadas

- `docs/montar-repositorio.md`: montar um repositório próprio de fontes.
- `docs/serie-em-episodios.md`: histórias em dois a quatro vídeos.
- `docs/arte-gerada.md`: usar um gerador de imagens no lugar do vetor.
- `docs/animacao-3d.md`: usar assets 3D, como low poly.
- `docs/conectar-mcp.md`: conectar voz, agendador e outros serviços.
