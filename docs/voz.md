# Voz

## O contrato

Para cada fala, a Produção entrega em `episodios/<id>/audio/`:

1. **O áudio:** `<id-da-fala>.mp3` (ou `.wav`).
2. **Os tempos, se o serviço fornecer:** `<id-da-fala>.json`.

A base de render só lê esses dois arquivos. Qualquer serviço de voz serve, desde que entregue o áudio. Os tempos são recomendados, mas não obrigatórios.

## O JSON de tempos

```json
{
  "duracaoMs": 2400,
  "palavras": [
    { "texto": "Vale", "inicioMs": 80, "fimMs": 310 },
    { "texto": "a", "inicioMs": 330, "fimMs": 390 },
    { "texto": "pena?", "inicioMs": 410, "fimMs": 820 }
  ]
}
```

Os tempos são em milissegundos, contados do início do áudio daquela fala.

Esse arquivo sustenta três coisas:

- a legenda, que destaca a palavra falada;
- a boca do personagem, que abre dentro de cada palavra;
- o momento em que cada elemento entra em cena, quando amarrado ao id da fala.

Sem o arquivo, a legenda é distribuída pela duração da fala, sem destaque, e a boca acompanha o volume do áudio. Fica menos preciso, mas funciona.

## Caminho recomendado: ElevenLabs

É o caminho documentado do kit, com o modelo v3 conectado ao runtime por MCP. Como referência de ordem de grandeza, conte com cerca de 1.000 créditos por vídeo curto, incluindo as revisões; meça o gasto real no seu piloto.

O que você precisa conferir na sua conta, porque muda conforme o plano e a versão do serviço:

- **Se a sua conexão devolve tempos.** A API do ElevenLabs tem chamadas de texto para fala "com timestamps", que devolvem o alinhamento por caractere junto com o áudio. Nem toda ferramenta de MCP expõe essa chamada, e nem todo modelo a suporta. No primeiro piloto, a Produção testa com uma fala e registra o resultado em `voz.entrega_tempos` de `config/projeto.json`.
- **O formato do alinhamento.** Se vier como três listas (`characters`, `character_start_times_seconds`, `character_end_times_seconds`), converta com:

```bash
cd render && node scripts/alinhamento-para-tempos.mjs <alinhamento.json> ../episodios/<id>/audio/<fala>.json
```

Este kit não foi testado contra a API do ElevenLabs. O conversor foi testado com um alinhamento de exemplo, nesse formato de três listas. Valide a chamada real no seu primeiro piloto.

## Outros serviços

Qualquer serviço de texto para fala, na nuvem ou local, serve. Registre o nome em `voz.provedor`. Se ele devolver tempos por palavra em outro formato, a Produção converte para o JSON acima. Se não devolver, siga sem tempos.

## Vozes dos personagens

A voz de cada personagem fica em `voz.vozes` de `config/projeto.json`, com o id do elemento como chave:

```json
"vozes": {
  "nina": { "voz_id": "...", "descricao": "feminina, acolhedora, ritmo médio" }
}
```

Voz nova é decisão do dono, tomada no piloto. A Produção não troca a voz de um personagem por conta própria. Não use uma voz clonada de pessoa real sem autorização registrada dessa pessoa.

## Chaves de API

A chave do serviço de voz fica na configuração do runtime ou em variável de ambiente. Ela não é escrita em nenhum arquivo deste repositório nem colada na conversa com o agente. Veja `docs/conectar-mcp.md`.

## Testar sem gastar

`npm run exemplo`, dentro de `render/`, gera tons no lugar da voz e renderiza o episódio de exemplo. Serve para validar a instalação antes de conectar uma conta paga.
