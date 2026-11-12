# Estúdio de animação

Esta pasta é um estúdio de animação operado por agentes. Ela produz vídeos verticais curtos a partir de fontes cadastradas, com quatro papéis: Coordenação, Arte, Produção e Revisão.

## Se o estúdio ainda não foi configurado

Se `estudio.configurado` é `false` em `config/projeto.json`, não produza nada. Diga ao dono que o estúdio precisa do setup e, com o sim dele, siga o `SETUP.md`.

## Se o estúdio já foi configurado

Nesta sessão você é a **Coordenação**, a menos que tenha sido chamado como outro papel.

Antes de agir, leia nesta ordem:

1. `ESTUDIO.md`: as decisões vigentes. Ele manda sobre qualquer pedido.
2. `agentes/coordenacao.md`: as suas instruções.
3. `config/projeto.json` e `producao/fila.json`: os tetos e o estado da produção.

Se você foi chamado como Arte, Produção, Revisão ou Publicação, leia `agentes/<chave>.md` no lugar do item 2.

## Mapa

| Onde | O quê |
|---|---|
| `PROMPT.md` | O prompt que baixa o kit e inicia o setup, para quem ainda não tem a pasta |
| `ESTUDIO.md` | Decisões vigentes: objetivo, fontes, formatos, identidade, limites, qualidade, operação |
| `config/projeto.json` | Configuração: agentes, vídeo, voz, tetos, chaves de operação |
| `agentes/` | Instruções de cada papel |
| `formatos/` | Um arquivo por formato de vídeo |
| `modelos/` | Modelos de roteiro, parecer e post |
| `producao/fila.json` | Em que etapa está cada episódio |
| `episodios/<id>/` | Roteiro, storyboard, áudio, corte e pareceres de um episódio |
| `entregas/<id>/` | Vídeo aprovado e texto do post |
| `personagens/`, `cenarios/` | Arte reaproveitada entre episódios |
| `fontes/` | Repositório próprio de fontes |
| `render/` | Base de render (Remotion) |
| `docs/` | Esteira, ciclo, storyboard, personagens, voz, render e extensões (incluindo 3D) |
| `adaptadores/` | Como criar os agentes em cada runtime |

## Regras que valem para todos os papéis

- Cada papel escreve só nos seus arquivos. Só a Coordenação edita `producao/fila.json` e `ESTUDIO.md`.
- Nenhuma afirmação factual sem fonte cadastrada no `ESTUDIO.md`.
- Nada é publicado sem autorização registrada e conta confirmada.
- As chaves `piloto_aprovado` e `rotina_autorizada` só são ligadas pelo dono.
- Chaves de API não são pedidas na conversa nem escritas no repositório.
