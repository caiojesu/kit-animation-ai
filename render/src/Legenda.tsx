import React from "react";
import type { Estilo, FalaResolvida, Palavra } from "./tipos";

/** Sem tempos reais, distribui as palavras pela duração, em proporção ao tamanho. */
const sintetizar = (texto: string, duracaoMs: number): Palavra[] => {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const total = palavras.reduce((soma, p) => soma + p.length + 1, 0) || 1;
  let cursor = 0;
  return palavras.map((p) => {
    const fatia = ((p.length + 1) / total) * duracaoMs;
    const item = { texto: p, inicioMs: cursor, fimMs: cursor + fatia };
    cursor += fatia;
    return item;
  });
};

const emBlocos = (palavras: Palavra[], maxCaracteres: number): Palavra[][] => {
  const blocos: Palavra[][] = [];
  let atual: Palavra[] = [];
  let tamanho = 0;
  for (const p of palavras) {
    if (atual.length > 0 && tamanho + p.texto.length + 1 > maxCaracteres) {
      blocos.push(atual);
      atual = [];
      tamanho = 0;
    }
    atual.push(p);
    tamanho += p.texto.length + 1;
  }
  if (atual.length > 0) blocos.push(atual);
  return blocos;
};

export const Legenda: React.FC<{
  fala: FalaResolvida;
  quadroNaFala: number;
  estilo: Estilo;
}> = ({ fala, quadroNaFala, estilo }) => {
  const ms = (quadroNaFala / estilo.fps) * 1000;
  const reais = fala.temposDados?.palavras ?? [];
  const temTempos = reais.length > 0;
  const palavras = temTempos ? reais : sintetizar(fala.texto, (fala.duracao / estilo.fps) * 1000);
  const blocos = emBlocos(palavras, estilo.legenda.maxCaracteres);
  if (blocos.length === 0) return null;

  // O bloco fica na tela até o próximo começar, para não piscar entre palavras.
  let indice = 0;
  for (let i = 0; i < blocos.length; i++) {
    if (ms >= blocos[i][0].inicioMs) indice = i;
  }
  const bloco = blocos[indice];
  const { legenda } = estilo;
  const c = legenda.contorno;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: legenda.posicaoY,
        textAlign: "center",
        fontFamily: legenda.fonte,
        fontWeight: 900,
        fontSize: legenda.tamanho,
        lineHeight: 1.15,
        color: legenda.cor,
        textShadow: `-4px -4px 0 ${c}, 4px -4px 0 ${c}, -4px 4px 0 ${c}, 4px 4px 0 ${c}, 0 6px 0 ${c}`,
      }}
    >
      {bloco.map((p, i) => {
        // Só destaca a palavra quando os tempos são reais.
        const ativa = temTempos && ms >= p.inicioMs && ms < p.fimMs;
        return (
          <span key={i} style={{ color: ativa ? legenda.corDestaque : legenda.cor }}>
            {p.texto}
            {i < bloco.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
