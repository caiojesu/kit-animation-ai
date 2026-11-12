#!/usr/bin/env node
// Gera áudios de teste (tons em "sílabas") para o episódio de exemplo, no
// lugar da voz. Serve para validar a instalação sem gastar créditos de voz.
// Também escreve o JSON de tempos da primeira fala, para testar a legenda
// palavra por palavra. A segunda fala fica sem tempos de propósito, para
// testar a boca guiada pelo volume.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const pasta = path.resolve(aqui, "..", "exemplo", "audio");
fs.mkdirSync(pasta, { recursive: true });

const TAXA = 22050;

/** palavras: [{texto, inicioMs, fimMs}] -> WAV mono 16 bits com um tom por palavra. */
const gerarWav = (palavras, duracaoMs, tomBase) => {
  const total = Math.round((duracaoMs / 1000) * TAXA);
  const amostras = new Int16Array(total);
  palavras.forEach((p, i) => {
    const ini = Math.round((p.inicioMs / 1000) * TAXA);
    const fim = Math.min(total, Math.round((p.fimMs / 1000) * TAXA));
    const freq = tomBase + (i % 4) * 35;
    for (let n = ini; n < fim; n++) {
      const t = (n - ini) / TAXA;
      const pos = (n - ini) / Math.max(1, fim - ini);
      const envelope = Math.sin(Math.PI * pos);
      amostras[n] = Math.round(Math.sin(2 * Math.PI * freq * t) * envelope * 0.5 * 32767);
    }
  });

  const dados = Buffer.from(amostras.buffer);
  const cabecalho = Buffer.alloc(44);
  cabecalho.write("RIFF", 0);
  cabecalho.writeUInt32LE(36 + dados.length, 4);
  cabecalho.write("WAVE", 8);
  cabecalho.write("fmt ", 12);
  cabecalho.writeUInt32LE(16, 16);
  cabecalho.writeUInt16LE(1, 20);
  cabecalho.writeUInt16LE(1, 22);
  cabecalho.writeUInt32LE(TAXA, 24);
  cabecalho.writeUInt32LE(TAXA * 2, 28);
  cabecalho.writeUInt16LE(2, 32);
  cabecalho.writeUInt16LE(16, 34);
  cabecalho.write("data", 36);
  cabecalho.writeUInt32LE(dados.length, 40);
  return Buffer.concat([cabecalho, dados]);
};

const distribuir = (texto, msPorPalavra, pausaMs) => {
  let cursor = 100;
  return texto.split(/\s+/).map((t) => {
    const item = { texto: t, inicioMs: cursor, fimMs: cursor + msPorPalavra };
    cursor += msPorPalavra + pausaMs;
    return item;
  });
};

const falas = [
  { id: "f1", texto: "Este é o episódio de exemplo do kit.", tom: 220, comTempos: true },
  { id: "f2", texto: "Se você está vendo isso, o render funciona.", tom: 300, comTempos: false },
];

for (const fala of falas) {
  const palavras = distribuir(fala.texto, 260, 90);
  const duracaoMs = palavras[palavras.length - 1].fimMs + 150;
  fs.writeFileSync(path.join(pasta, `${fala.id}.wav`), gerarWav(palavras, duracaoMs, fala.tom));
  if (fala.comTempos) {
    fs.writeFileSync(path.join(pasta, `${fala.id}.json`), JSON.stringify({ duracaoMs, palavras }, null, 2));
  }
  console.log(`Áudio de teste: ${fala.id}.wav (${duracaoMs} ms)`);
}
