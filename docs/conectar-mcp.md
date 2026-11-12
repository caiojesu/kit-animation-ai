# Conectar serviços por MCP

Os agentes usam serviços externos (voz, agendador de posts, gerador de imagens) por meio de servidores MCP conectados ao runtime. Quem conecta é você, na configuração do runtime. O agente não conecta sozinho e não manipula as suas chaves.

## Regra das chaves

- A chave de API de um serviço fica na configuração do runtime ou em uma variável de ambiente.
- Não cole a chave na conversa com o agente.
- Não escreva a chave em nenhum arquivo deste repositório. O `.gitignore` já ignora `.env`, mas o lugar certo é fora do repositório.

Se o agente pedir a chave na conversa, recuse e aponte para este arquivo.

## Passo a passo genérico

Os nomes dos menus mudam de runtime para runtime. A sequência é a mesma:

1. Pegue na documentação do serviço o endereço do servidor MCP dele e gere uma chave de API na sua conta.
2. No runtime, abra a configuração de servidores MCP e adicione um servidor personalizado.
3. Escolha o transporte indicado pelo serviço. Para servidores remotos, costuma ser "Streamable HTTP".
4. Informe o nome e o endereço do servidor.
5. Se o serviço pede autenticação por cabeçalho, adicione o cabeçalho `Authorization` com o valor `Bearer` seguido de um espaço e da sua chave.
6. Salve e confira se o runtime lista as ferramentas do servidor.

Em runtimes de linha de comando, o mesmo é feito por um comando ou arquivo de configuração. Consulte a documentação do seu runtime.

## Quais agentes precisam de quê

| Serviço | Quem usa | Obrigatório |
|---|---|---|
| Voz (por exemplo, ElevenLabs) | Produção | Sim, para episódios com fala |
| Agendador de posts (por exemplo, mLabs) | Publicação | Só se a Publicação estiver ativa |
| Gerador de imagens | Arte | Só com a extensão de `docs/arte-gerada.md` |

Em runtimes de bots, conecte cada servidor só ao bot que precisa dele. A Revisão e a Coordenação não precisam de acesso ao serviço de voz nem ao agendador.

## Conferir a conexão

Peça ao agente do papel correspondente:

> Liste as ferramentas de [serviço] que você tem disponíveis, sem chamar nenhuma.

Se a lista vier vazia, a conexão não foi feita para aquele agente.

Para a voz, o primeiro teste real acontece no piloto: a Produção gera uma fala, confere se o serviço devolve os tempos e registra o resultado. Veja `docs/voz.md`.
