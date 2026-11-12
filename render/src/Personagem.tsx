import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import type { Estilo, FalaResolvida, PersonagemDef, Peca } from "./tipos";

type EstadoBoca = "fechada" | "aberta" | "meia";

const escolher = (peca: Peca, estado: string, reserva: string): string | undefined =>
  peca.estados?.[estado] ?? peca.estados?.[reserva] ?? peca.src;

const Pecas: React.FC<{
  pasta: string;
  def: PersonagemDef;
  boca: EstadoBoca;
  falando: boolean;
  estilo: Estilo;
}> = ({ pasta, def, boca, falando, estilo }) => {
  const quadro = useCurrentFrame();
  const passo = Math.max(1, Math.round(estilo.fps / estilo.posesPorSegundo));
  const pose = Math.floor(quadro / passo);

  // Pisca por cerca de 0,13 s a cada 3 s.
  const ciclo = quadro % Math.round(estilo.fps * 3);
  const piscando = ciclo < Math.round(estilo.fps * 0.13);

  // Quem fala balança de leve, uma pose sim, outra não.
  const balanco = falando && pose % 2 === 0 ? -8 : 0;

  const ordenadas = [...def.pecas].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${balanco}px)` }}>
      {ordenadas.map((peca) => {
        let arquivo: string | undefined;
        if (peca.tipo === "boca") {
          arquivo = escolher(peca, boca, boca === "meia" ? "aberta" : "fechada");
        } else if (peca.tipo === "olhos") {
          arquivo = escolher(peca, piscando ? "fechados" : "abertos", "abertos");
        } else {
          arquivo = peca.src;
        }
        if (!arquivo) return null;
        return (
          <Img
            key={peca.id}
            src={staticFile(`${pasta}/${arquivo}`)}
            style={{ position: "absolute", left: peca.x, top: peca.y, width: peca.largura }}
          />
        );
      })}
    </div>
  );
};

/** Boca guiada pelos tempos das palavras: abre dentro de cada palavra. */
const bocaPorTempos = (fala: FalaResolvida, quadroNaFala: number, estilo: Estilo): EstadoBoca => {
  const ms = (quadroNaFala / estilo.fps) * 1000;
  const palavras = fala.temposDados?.palavras ?? [];
  const dentro = palavras.some((p) => ms >= p.inicioMs && ms < p.fimMs);
  if (!dentro) return "fechada";
  const passo = Math.max(1, Math.round(estilo.fps / estilo.posesPorSegundo));
  return Math.floor(quadroNaFala / passo) % 2 === 0 ? "aberta" : "meia";
};

/** Boca guiada pelo volume do áudio, para quando não há tempos. */
const ComVolume: React.FC<{
  audio: string;
  quadroNaFala: number;
  estilo: Estilo;
  children: (boca: EstadoBoca) => React.ReactElement;
}> = ({ audio, quadroNaFala, estilo, children }) => {
  const dados = useAudioData(staticFile(audio));
  if (!dados) return children("fechada");
  const passo = Math.max(1, Math.round(estilo.fps / estilo.posesPorSegundo));
  const quadro = Math.floor(quadroNaFala / passo) * passo;
  const faixas = visualizeAudio({
    fps: estilo.fps,
    frame: quadro,
    audioData: dados,
    numberOfSamples: 16,
  });
  const volume = faixas.reduce((soma, v) => soma + v, 0) / faixas.length;
  const boca: EstadoBoca = volume > 0.06 ? "aberta" : volume > 0.015 ? "meia" : "fechada";
  return children(boca);
};

export const PersonagemFalante: React.FC<{
  pasta: string;
  def: PersonagemDef;
  fala: FalaResolvida | null;
  quadroNaFala: number;
  estilo: Estilo;
}> = ({ pasta, def, fala, quadroNaFala, estilo }) => {
  const desenhar = (boca: EstadoBoca) => (
    <Pecas pasta={pasta} def={def} boca={boca} falando={fala !== null} estilo={estilo} />
  );

  if (!fala) return desenhar("fechada");

  const temTempos = (fala.temposDados?.palavras?.length ?? 0) > 0;
  if (temTempos) return desenhar(bocaPorTempos(fala, quadroNaFala, estilo));

  if (fala.audio) {
    return (
      <ComVolume audio={fala.audio} quadroNaFala={quadroNaFala} estilo={estilo}>
        {desenhar}
      </ComVolume>
    );
  }

  // Sem áudio e sem tempos: abre e fecha no ritmo das poses.
  const passo = Math.max(1, Math.round(estilo.fps / estilo.posesPorSegundo));
  return desenhar(Math.floor(quadroNaFala / passo) % 2 === 0 ? "aberta" : "fechada");
};
