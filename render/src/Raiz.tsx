import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { Episodio } from "./Episodio";
import type { CenaResolvida, Estilo, FalaResolvida, PropsEpisodio } from "./tipos";

const estiloPadrao: Estilo = {
  largura: 1080,
  altura: 1920,
  fps: 30,
  posesPorSegundo: 12,
  legenda: {
    ativa: true,
    fonte: "Arial, Helvetica, sans-serif",
    tamanho: 68,
    cor: "#FFFFFF",
    corDestaque: "#FFD84D",
    contorno: "#111111",
    posicaoY: 1480,
    maxCaracteres: 18,
  },
};

// A duração de cada cena vem do áudio real das falas. É aqui que o
// storyboard é "fechado com os tempos reais da voz".
const calcular: CalculateMetadataFunction<PropsEpisodio> = async ({ props }) => {
  const estilo = props.estilo ?? estiloPadrao;
  const fps = estilo.fps;
  const quadros = (ms: number) => Math.round((ms / 1000) * fps);

  const linha: CenaResolvida[] = [];
  let total = 0;

  for (const cena of props.storyboard.cenas) {
    let cursor = quadros(cena.respiroInicialMs ?? 200);
    const falas: FalaResolvida[] = [];

    for (const fala of cena.falas ?? []) {
      let segundos: number;
      if (fala.audio) {
        segundos = await getAudioDurationInSeconds(staticFile(fala.audio));
      } else if (fala.temposDados?.duracaoMs) {
        segundos = fala.temposDados.duracaoMs / 1000;
      } else {
        segundos = (fala.duracaoMs ?? 2000) / 1000;
      }
      const duracao = Math.max(1, Math.ceil(segundos * fps));
      falas.push({ ...fala, inicio: cursor, duracao });
      cursor += duracao + quadros(fala.pausaDepoisMs ?? 150);
    }

    const comFalas = cursor + quadros(cena.respiroFinalMs ?? 300);
    const minima = quadros(cena.duracaoMinMs ?? (falas.length === 0 ? 2000 : 0));
    const duracao = Math.max(comFalas, minima, 1);

    linha.push({ ...cena, falas, inicio: total, duracao });
    total += duracao;
  }

  return {
    durationInFrames: Math.max(total, 1),
    fps,
    width: estilo.largura,
    height: estilo.altura,
    props: { ...props, estilo, linha },
  };
};

export const Raiz: React.FC = () => {
  return (
    <Composition
      id="Episodio"
      component={Episodio}
      width={estiloPadrao.largura}
      height={estiloPadrao.altura}
      fps={estiloPadrao.fps}
      durationInFrames={1}
      defaultProps={{
        storyboard: { episodio: "vazio", cenas: [] },
        personagens: {},
        estilo: estiloPadrao,
      }}
      calculateMetadata={calcular}
    />
  );
};
