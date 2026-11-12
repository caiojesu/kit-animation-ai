# Série em episódios (extensão)

Uma série é uma história contada em dois a quatro vídeos, em que cada um termina com um gancho para o próximo. Se um vídeo vai bem, quem assistiu entra no perfil para procurar a continuação.

Esta extensão não faz parte do caminho testado do kit. Ela usa o que já existe, sem engrenagem nova.

## Como fazer

1. Peça à Coordenação uma série: "Faça uma série de 3 episódios no formato H sobre [situação]".
2. A Coordenação planeja o arco inteiro antes de escrever o primeiro roteiro: o que acontece em cada episódio e qual é o gancho de cada um. O plano fica em `episodios/<id-do-primeiro>/arco.md`.
3. Cada episódio é aberto na fila como um episódio normal. Do segundo em diante, o campo `continua_de` recebe o id do episódio anterior.
4. Cada episódio passa pela esteira completa, com os dois portões de revisão.

## O que muda em cada episódio

- **Gancho:** do segundo em diante, a primeira fala retoma a situação em uma frase ("ontem a [personagem] descobriu que..."), para quem não viu o anterior.
- **Fecho:** os episódios do meio terminam com o gancho para o próximo e a chamada para agir, na mesma cena. O último episódio fecha a história e tem o fecho normal.
- **Consistência:** os mesmos personagens e o mesmo cenário em toda a série.

## O que a Revisão confere a mais

- Cada episódio se entende sozinho.
- O gancho do fim de um episódio é resolvido no seguinte.
- O arco inteiro respeita os limites da seção 5 do `ESTUDIO.md`. Uma história "polêmica" continua sujeita aos limites editoriais e às regras de fonte.

## Publicação

Os episódios de uma série são publicados em ordem, na mesma rede. Se a Publicação estiver ativa, ela usa o campo `continua_de` para respeitar a ordem.

## Como tornar isso um formato próprio

Se a série virar rotina no seu estúdio, peça à Coordenação para escrever um formato a partir de `formatos/_modelo.md`, com as regras acima, e aprove um piloto dele.
