#!/usr/bin/env node
// Converte um alinhamento por caractere (o formato que o ElevenLabs devolve
// nas chamadas "with timestamps") no JSON de tempos por palavra do kit.
//
//   node scripts/alinhamento-para-tempos.mjs <entrada.json> <saida.json>
//
// Entrada aceita, em qualquer um destes lugares do JSON:
//   { characters, character_start_times_seconds, character_end_times_seconds }
//   { alignment: { ...os mesmos três campos... } }
// Saída: { duracaoMs, palavras: [{ texto, inicioMs, fimMs }] }

import fs from "node:fs";

const [entrada, saida] = process.argv.slice(2);
if (!entrada || !saida) {
  console.error("Uso: node scripts/alinhamento-para-tempos.mjs <entrada.json> <saida.json>");
  process.exit(2);
}

const bruto = JSON.parse(fs.readFileSync(entrada, "utf8"));
const a = bruto.alignment ?? bruto.normalized_alignment ?? bruto;
const letras = a.characters;
const inicios = a.character_start_times_seconds;
const fins = a.character_end_times_seconds;

if (!Array.isArray(letras) || !Array.isArray(inicios) || !Array.isArray(fins)) {
  console.error("Não encontrei characters, character_start_times_seconds e character_end_times_seconds.");
  process.exit(1);
}

const palavras = [];
let atual = null;
for (let i = 0; i < letras.length; i++) {
  const letra = letras[i];
  if (/\s/.test(letra)) {
    if (atual) palavras.push(atual);
    atual = null;
    continue;
  }
  if (!atual) atual = { texto: "", inicioMs: Math.round(inicios[i] * 1000), fimMs: 0 };
  atual.texto += letra;
  atual.fimMs = Math.round(fins[i] * 1000);
}
if (atual) palavras.push(atual);

// Marcações de emoção entre colchetes (por exemplo [risos]) não são faladas.
const faladas = palavras.filter((p) => !/^\[.*\]$/.test(p.texto));
const duracaoMs = Math.round((fins[fins.length - 1] ?? 0) * 1000);

fs.writeFileSync(saida, JSON.stringify({ duracaoMs, palavras: faladas }, null, 2));
console.log(`${faladas.length} palavra(s), ${duracaoMs} ms -> ${saida}`);
