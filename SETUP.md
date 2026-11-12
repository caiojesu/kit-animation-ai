# Setup do estúdio

> **Para quem vai usar o kit:** se você ainda não baixou o kit, use o prompt de `PROMPT.md`, que faz o agente baixar tudo sozinho. Se já baixou, abra o seu agente (Claude Code, Cursor, Codex, OpenBot ou outro) nesta pasta e diga: **"Leia o SETUP.md e siga as instruções."**
>
> O restante deste arquivo é escrito para o agente.

---

Você vai instalar um estúdio de animação nesta pasta. O repositório já tem a estrutura: as instruções dos papéis, os formatos, os modelos e a base de render. O seu trabalho é entender a intenção do dono, registrar as decisões dele e criar os agentes neste runtime.

O dono é a pessoa que está conversando com você. Ele decide o formato, a estratégia e o que o estúdio grava. Você pergunta, recomenda e registra.

## Regras deste setup

1. **Uma pergunta por vez.** Espere a resposta antes da próxima.
2. **Toda pergunta vem com a sua recomendação** e o motivo, em uma ou duas frases. O dono pode aceitar com um "ok".
3. **Não pergunte o que você pode descobrir.** Se a resposta está em um arquivo, em um link que o dono mandou ou em uma resposta anterior, use.
4. **Não peça chaves de API, senhas nem tokens.** Serviços são conectados pelo dono, na configuração do runtime. Veja `docs/conectar-mcp.md`.
5. **Não ligue nenhuma chave de operação.** `piloto_aprovado`, `rotina_autorizada`, `publicacao.ativa` e a autorização de publicação ficam como estão, a menos que o dono peça de forma explícita para ativar a Publicação na fase 2.
6. **Não produza, não publique e não crie rotina.** O setup termina com o estúdio pronto para o primeiro piloto.
7. **Escreva o que o dono disse, não o que você imagina.** Se ele não respondeu algo, o campo fica marcado como pendente.

## Fase 0: reconhecimento (sem perguntar nada)

1. Leia `ESTUDIO.md`, `config/projeto.json`, `adaptadores/README.md` e `docs/esteira.md`.
2. Se `estudio.configurado` já é `true`, pare e pergunte ao dono se ele quer refazer o setup, revisar uma parte ou só criar os agentes de novo. Não sobrescreva um estúdio configurado sem confirmação.
3. Identifique o runtime em que você está rodando e escolha o adaptador pela tabela de `adaptadores/README.md`. Leia o adaptador escolhido.
4. Confira o ambiente de render:

```bash
node -v
```

   Se o Node.js não existe ou é mais antigo que a versão 18, anote. O setup continua, e você avisa no resumo final que o render não vai funcionar até o Node ser instalado.

5. Diga ao dono, em três linhas: qual runtime você detectou e como os agentes vão ser criados nele; se o Node está pronto; e que agora vêm oito blocos de perguntas.

## Fase 1: entrevista essencial

São oito blocos, nesta ordem. Cada bloco pode levar mais de uma pergunta, mas só pergunte o que falta para preencher o que está listado em "Registra". Depois de cada bloco, confirme em uma linha o que você entendeu.

Se o dono já contou o projeto na primeira mensagem, extraia o que der e pergunte só o que faltou.

### Bloco 1: intenção

Descubra o que o estúdio promove e qual ação o vídeo pede.

- O que é o produto, serviço ou perfil? Para que serve?
- Qual é a única ação pedida no fecho de todo vídeo? Baixar um aplicativo, seguir o perfil, visitar um site, comprar?
- O que conta como sucesso: instalações, seguidores, vendas, visualizações?

Recomende uma ação só. Um fecho com duas chamadas enfraquece as duas. Se o objetivo é levar a pessoa para fora da rede (baixar, comprar), recomende medir por essa ação, e não por seguidores.

Registra: seção 1 do `ESTUDIO.md` (o que promove, ação do fecho, sucesso) e `estudio.nome`.

### Bloco 2: público

- Quem assiste? Seja específico: "pessoas que acabaram de adotar o primeiro cachorro" serve, "donos de pets" não serve.
- Em que situação essa pessoa se reconhece no vídeo? Qual problema ela tem hoje?

Registra: seção 1 do `ESTUDIO.md` (público e situação).

### Bloco 3: fontes

Explique em duas frases que todo fato dito no vídeo precisa de uma fonte cadastrada, e que há quatro funções de fonte (`oficial`, `manual`, `opiniao`, `proprio`).

- De onde vem a informação: sites oficiais, material próprio, ou os dois?
- Quais são? Peça os endereços ou os arquivos.
- O tema toca em saúde, segurança, lei ou dinheiro?

Se o tema toca em saúde, segurança, lei ou dinheiro, exija pelo menos uma fonte `oficial`, atual e do país do público, e diga por quê. Se o dono tem material próprio, peça para ele colocar em `fontes/` e cadastre. Se ele quer montar um repositório a partir de reviews, aponte `docs/montar-repositorio.md` e siga sem isso: é um trabalho separado.

Se o dono não tem nenhuma fonte, registre isso e avise: o estúdio só pode produzir conteúdo de opinião ou entretenimento, sem alegações factuais, até uma fonte ser cadastrada.

Registra: tabela de fontes da seção 2 do `ESTUDIO.md`, com id, função e onde fica. `fontes/INDICE.md`, se houver material próprio.

### Bloco 4: formato do piloto

Mostre os três formatos do kit em uma linha cada (V, L, H) e recomende um para o piloto, com base nos blocos 1 a 3:

- produto ou item a avaliar: V;
- vários itens a comparar: L;
- situação de vida com um problema a resolver: H.

Pergunte também se o dono quer manter os outros dois ativos ou desativar.

Se o dono trouxer um link de um vídeo de referência, não crie o formato agora. Registre o link em "Decisões vigentes" como pedido de formato novo, e explique que a Coordenação cria o formato e faz um piloto dele depois do setup.

Registra: seção 3 do `ESTUDIO.md`, `formatos_ativos` e `formato_do_piloto`.

### Bloco 5: estilo visual

- Qual estilo? Recomende papel recortado em 2D como padrão: é o mais barato, gasta menos tokens e mantém os personagens idênticos entre episódios. As alternativas são ilustração plana, motion graphics com texto e formas, ou apresentador.
- A arte vai ser escrita em vetor pela Arte, fornecida pelo dono, ou os dois?
- O dono já tem identidade visual? Cores, logotipo, fonte?

Se o dono quer um estilo que vetor simples não entrega (realista, pintura, 3D), diga isso com clareza, aponte `docs/arte-gerada.md` como extensão não testada e pergunte se ele quer começar pelo vetor.

Registra: seção 4 do `ESTUDIO.md` (estilo, origem, paleta se houver) e `arte.estilo`, `arte.origem`.

### Bloco 6: personagens e vozes

- Quantos personagens e quem são? Recomende um ou dois para começar: quem explica e, no formato H, quem vive o problema.
- Para cada um: nome, papel na história, tom de fala e uma descrição física curta.
- Qual serviço de voz? Recomende o ElevenLabs, que é o caminho documentado do kit. Qualquer outro serviço serve, e o kit também funciona sem tempos de palavra.
- Que tipo de voz para cada personagem? Registre a descrição. O id da voz é escolhido no piloto.

Não desenhe os personagens agora. Eles são criados pela Arte no piloto e aprovados pelo dono.

Registra: tabela de personagens da seção 4 do `ESTUDIO.md`, `voz.provedor` e `voz.vozes` (com a descrição e `voz_id` vazio).

### Bloco 7: limites duros

- O que nunca pode ser dito ou mostrado? Peça exemplos concretos: concorrentes pelo nome, promessas, temas, palavras, comparações.
- Há alguma regra do setor ou da plataforma que o dono precisa seguir?

Com base no tema, proponha de dois a quatro limites que o dono talvez não tenha pensado. Por exemplo, em saúde: não dar diagnóstico nem dose de remédio. Em finanças: não prometer retorno.

Registra: seção 5 do `ESTUDIO.md`.

### Bloco 8: ferramentas e tetos

- Quanto o dono aceita gastar por vídeo, e em que moeda?
- Quanto espaço em disco o estúdio pode ocupar? Meça o espaço livre antes de recomendar e sugira um teto que deixe folga. Os vídeos acumulam rápido em modo automático.
- Quantos renders ao mesmo tempo? Recomende 1 para começar.
- O dono quer ativar o papel de Publicação agora? Recomende **não**: a entrega já sai pronta para postar em `entregas/`, e a Publicação pode ser ativada depois do piloto. Se ele quiser ativar agora, registre a ferramenta e pergunte contas, redes e posts por dia. A autorização só é registrada com as contas confirmadas por ele, por escrito, nesta conversa.
- Como os agentes devem se chamar? Ofereça manter os nomes dos papéis ou escolher nomes próprios. A chave do papel não muda.

Registra: `tetos`, `agentes.<chave>.nome` e `publicacao`. Na seção 7 do `ESTUDIO.md`, só a linha de Publicação muda, e só se o dono ativou o papel.

## Fase 2: gravar

1. Mostre ao dono um resumo das decisões, em uma lista curta por bloco, e peça confirmação antes de escrever.
2. Preencha `ESTUDIO.md`:
   - troque cada "_a preencher no setup_" pela decisão do dono;
   - o que ficou sem resposta vira "_pendente: [o que falta]_";
   - mude a linha de estado no topo para "**configurado em [data]**";
   - registre na seção 8 as decisões que tiveram um motivo dito pelo dono.
   Não mexa nas seções 6 e 7 além do que os blocos pedem: elas ficam com os padrões do kit até depois do piloto.
3. Atualize `config/projeto.json`: os campos dos blocos, `estudio.configurado` = `true` e `estudio.configurado_em`. Não altere `padroes_nao_revisados` nem as chaves de operação.
4. Confira que o JSON continua válido.

## Fase 3: criar os agentes

Siga o adaptador escolhido na fase 0, do começo ao fim, incluindo o passo de conferir. Use os nomes escolhidos no bloco 8.

Se a criação falhar, não registre `agentes_criados` como `true`. Diga ao dono o que falhou e qual é a alternativa (`adaptadores/sessao-unica.md` sempre funciona).

## Fase 4: verificar a base de render

Se o Node está disponível, pergunte ao dono se você pode instalar os pacotes do Remotion (cerca de 800 MB dentro de `render/`) e rodar o episódio de exemplo. Com o sim:

```bash
cd render && npm install && npm run exemplo
```

Confira que `render/exemplo/corte/v1.mp4` existe e olhe um dos quadros em `render/exemplo/corte/v1-quadros/`. Se falhar, mostre o erro ao dono e não diga que a base funciona.

Se o dono preferir não instalar agora, registre no resumo que o render ainda não foi verificado nesta máquina.

## Fase 5: entregar

Termine com um resumo curto para o dono:

1. **O que foi criado:** os agentes, com nome e onde ficam.
2. **O que foi decidido:** uma linha por bloco.
3. **O que está pendente:** campos sem resposta, serviços que o dono precisa conectar (com o caminho `docs/conectar-mcp.md`) e, se for o caso, Node ou render não verificado.
4. **O que ainda está com o padrão do kit:** diga que a Coordenação revisa esses itens com ele depois do piloto.
5. **O próximo passo:** o pedido do piloto, pronto para copiar, com os valores dele preenchidos:

> Produza um piloto no formato [V, L ou H] sobre [tema], com teto de [valor e moeda], usando a identidade e as ferramentas configuradas. Coordene roteiro, revisão, arte, voz e vídeo. Entregue o corte aprovado para eu avaliar o piloto, dentro das permissões já registradas.

Se o runtime exige abrir uma sessão nova para os agentes valerem, diga isso junto com o próximo passo.

Lembre o dono de uma coisa: os episódios ficam bons quando os pilotos ficam bons. Vale investir tempo no piloto antes de deixar o time rodar sozinho.
