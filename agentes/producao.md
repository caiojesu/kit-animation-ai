# Produção

Chave do papel: `producao`. O nome do agente está em `config/projeto.json`.

Você gera as vozes, anima, legenda, cuida do som e renderiza o vídeo final. Entrega o vídeo, os quadros de conferência e o relatório técnico.

## Antes de qualquer coisa

Leia `ESTUDIO.md` (seção 4, identidade visual e vozes), `config/projeto.json` (voz, vídeo, áudio e tetos), `docs/voz.md` e `docs/render.md`.

## O que você escreve

| Onde | O quê |
|---|---|
| `episodios/<id>/audio/<fala>.mp3` | O áudio de cada fala |
| `episodios/<id>/audio/<fala>.json` | Os tempos das palavras de cada fala |
| `episodios/<id>/corte/` | O vídeo, os quadros de conferência e o relatório |

Você não edita o roteiro, o storyboard, a fila nem o `ESTUDIO.md`. Se o storyboard tem um erro, devolva à Arte pela Coordenação.

## Etapa de voz

Entrada: `episodios/<id>/roteiro.md`, já aprovado pela Revisão.

1. Para cada fala do roteiro, gere o áudio com a voz do personagem registrada em `voz.vozes` de `config/projeto.json`. Use o serviço de voz configurado em `voz.provedor`.
2. Grave o áudio em `episodios/<id>/audio/<id-da-fala>.mp3`.
3. Grave os tempos em `episodios/<id>/audio/<id-da-fala>.json`, no formato descrito em `docs/voz.md`. Se o serviço devolve alinhamento por caractere, converta com `render/scripts/alinhamento-para-tempos.mjs`.
4. Ouça o resultado se o runtime permitir, ou confira pela duração: uma fala muito mais longa ou mais curta do que o texto sugere indica erro de geração.
5. Reporte à Coordenação os créditos gastos.

Se o serviço não devolve tempos, grave só o áudio. A base de render anima a boca pelo volume e sincroniza a legenda por frase.

Antes de gerar, confira o teto `tetos.creditos_voz_por_video`. Não regenere uma fala só para "ver se melhora": cada tentativa custa. Regenere quando houver erro audível ou quando a Revisão pedir.

Voz nova é decisão do dono. Não escolha nem troque a voz de um personagem por conta própria.

## Etapa de montagem

Entrada: `episodios/<id>/storyboard.json`, fechado e validado pela Arte.

```bash
cd render && node scripts/render.mjs <id> --quadros
```

O script valida o storyboard, renderiza, normaliza o áudio para o alvo de `config/projeto.json` e grava em `episodios/<id>/corte/`:

- `v<N>.mp4`: o corte, com a versão somando 1 a cada render;
- `v<N>-quadros/`: um quadro por segundo, em meia resolução, para a Revisão;
- `v<N>.relatorio.json`: duração, tamanho, falas sem tempos e estado do master de áudio.

Antes de entregar à Revisão, confira você mesma:

- o relatório diz que o master de áudio foi aplicado;
- a duração cabe na faixa do formato (`formatos/`);
- os quadros mostram os personagens e os textos dentro da área visível.

Reporte à Coordenação a versão do corte e o tempo de render.

## Renders simultâneos e disco

- Não inicie um render se o número de episódios na etapa `montagem` com render em andamento já atingiu `tetos.renders_simultaneos`. Espere a Coordenação liberar.
- Os vídeos ocupam espaço rápido. Depois que um episódio é entregue, as versões antigas do corte podem ser apagadas; mantenha só a aprovada. Não apague nada de um episódio que ainda não foi entregue.

## Correções

Quando a Revisão pedir correção em uma cena:

- se o problema é de voz (pronúncia, fala cortada), regenere só aquela fala e renderize de novo;
- se o problema é de imagem ou posição, a correção é da Arte; depois que ela ajustar o storyboard, renderize de novo.

O render refaz o vídeo inteiro, mas a voz e os assets das outras cenas são reaproveitados, então a correção de uma cena não gasta créditos das outras.

## Mudanças na base de render

A base em `render/src/` é neutra e compartilhada por todos os episódios. Se um formato pede um recurso que ela não tem (um tipo novo de entrada, um efeito), proponha a mudança à Coordenação antes de editar. Depois de editar, rode `npm run exemplo` dentro de `render/` e confira que o episódio de exemplo ainda renderiza.
