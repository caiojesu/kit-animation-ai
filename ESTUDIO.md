# ESTUDIO.md

> **Este arquivo manda.** Ele guarda as decisões vigentes do estúdio. Todo agente lê este arquivo antes de decidir qualquer coisa e segue o que está escrito aqui, mesmo quando um pedido avulso disser o contrário. Se um pedido contradiz este arquivo, o agente para e pergunta ao dono do estúdio.
>
> Só a Coordenação edita este arquivo, e só depois de uma decisão do dono. Cada mudança entra também em "Decisões vigentes", com data.
>
> Estado: **não configurado**. Rode o `SETUP.md` para preencher.

## 1. Projeto e objetivo

- **Nome do estúdio:** _a preencher no setup_
- **O que o estúdio promove:** _a preencher no setup_
- **Ação pedida no fecho de cada vídeo:** _a preencher no setup_
- **Público:** _a preencher no setup_
- **Situação em que o público se reconhece:** _a preencher no setup_
- **O que conta como sucesso:** _a preencher no setup_

## 2. Fontes e evidências

Toda afirmação factual de um roteiro precisa apontar para uma fonte desta lista. A Revisão reprova o roteiro que tiver afirmação sem fonte cadastrada.

Cada fonte tem uma função, e só sustenta afirmações daquela função:

| Função | O que sustenta | Exemplo |
|---|---|---|
| `oficial` | Alegações de saúde, segurança, lei e dinheiro. Precisa ser atual e adequada ao país. | Ministério, agência reguladora, sociedade médica |
| `manual` | Especificações e instruções de uso | Manual ou página do fabricante |
| `opiniao` | Recomendações editoriais ("vale a pena", "prefiro") | Review de quem tem autoridade no assunto |
| `proprio` | Dados do próprio produto ou do repositório em `fontes/` | Planilha de produtos, resumos de reviews |

**Fontes cadastradas:**

| Id | Fonte | Função | Onde fica | Observações |
|---|---|---|---|---|
| _nenhuma_ | | | | |

> Sem nenhuma fonte cadastrada, o estúdio só pode produzir conteúdo de opinião ou entretenimento, sem alegações factuais.

## 3. Formatos

Cada formato é um arquivo em `formatos/`. Só os formatos listados aqui como ativos podem ser usados em episódios.

| Formato | Arquivo | Estado |
|---|---|---|
| V: veredito sobre um item | `formatos/v-veredito.md` | ativo |
| L: lista curta | `formatos/l-lista.md` | ativo |
| H: história com problema e solução | `formatos/h-historia.md` | ativo |

- **Formato do piloto:** _a preencher no setup_
- **Regra do fecho:** todo vídeo termina com um único fecho, que reúne a oferta e a chamada para agir.

Um formato novo entra aqui como "rascunho" e só passa a "ativo" depois que o dono aprovar o piloto dele.

## 4. Identidade visual e vozes

- **Estilo visual:** _a preencher no setup_
- **Origem da arte:** _a preencher no setup_ (vetor escrito pela Arte, arte fornecida pelo dono, ou os dois)
- **Paleta e traço:** _a preencher no piloto_
- **Vídeo:** vertical, 1080 × 1920, 30 fps, movimento em passos de cerca de 12 poses por segundo.
- **Áudio:** cerca de −14 LUFS, com pico máximo de −1,5 dBTP.

**Personagens:**

| Id | Nome | Papel na história | Tom | Pasta | Voz |
|---|---|---|---|---|---|
| _nenhum_ | | | | | |

**Cenários aprovados:** _nenhum ainda; ficam em `cenarios/`._

## 5. Limites editoriais

O que nunca pode ser dito ou mostrado, definido pelo dono:

- _a preencher no setup_

Limites do kit, que valem para qualquer estúdio:

- Não afirmar nada factual sem fonte cadastrada na função certa.
- Não prometer resultado que a fonte não sustenta.
- Não usar nome, voz ou imagem de pessoa real sem autorização registrada.
- Não copiar roteiro, arte ou áudio de terceiros. Um vídeo de referência serve para entender a estrutura do formato, não para ser reproduzido.

## 6. Qualidade

> Padrões do kit, ainda não revisados pelo dono. A Coordenação revisa esta seção com o dono depois do piloto.

Um roteiro passa quando:

- o gancho aparece nos dois primeiros segundos e diz de que o vídeo trata;
- cada afirmação factual tem fonte cadastrada;
- o fecho é único e pede a ação definida na seção 1;
- a duração estimada cabe na faixa do formato.

Um corte passa quando:

- as falas, as legendas e as bocas estão em sincronia;
- nenhum texto ou personagem sai da área visível nem fica coberto pela legenda;
- os personagens estão iguais às fichas em `personagens/`;
- o áudio está inteligível do começo ao fim;
- a duração final cabe na faixa do formato.

## 7. Operação e aprovação

- **Portões de revisão:** roteiro e corte. A correção do corte é por cena.
- **Rodadas de correção:** até 2 no roteiro e até 2 no corte. Depois disso, o episódio é escalado para o dono. A Revisão nunca aprova por cansaço.
- **O que o dono aprova pessoalmente:** todo piloto; todo formato novo; todo personagem e toda voz novos; qualquer mudança neste arquivo.
- **Rotina automática:** desligada. Só roda com `piloto_aprovado` e `rotina_autorizada` ligados em `config/projeto.json`, e só o dono liga.
- **Publicação:** desligada. Só acontece com autorização registrada e conta confirmada.
- **Tetos:** definidos em `config/projeto.json`. Quando um teto é atingido, a rotina para e registra o motivo na fila.

## 8. Decisões vigentes

Registro das decisões do dono, da mais nova para a mais antiga. Uma decisão nova substitui a antiga sobre o mesmo assunto.

| Data | Decisão | Motivo |
|---|---|---|
| _nenhuma ainda_ | | |
