import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ElementoEmCena } from "./Elemento";
import { Legenda } from "./Legenda";
import type { CenaResolvida, Estilo, PropsEpisodio } from "./tipos";

const CenaView: React.FC<{
  cena: CenaResolvida;
  estilo: Estilo;
  personagens: PropsEpisodio["personagens"];
}> = ({ cena, estilo, personagens }) => {
  const quadro = useCurrentFrame();
  const falaAtiva =
    cena.falas.find((f) => quadro >= f.inicio && quadro < f.inicio + f.duracao) ?? null;

  return (
    <AbsoluteFill style={{ backgroundColor: cena.corDeFundo ?? "#F4EFE6" }}>
      {cena.cenario ? (
        <Img
          src={staticFile(cena.cenario)}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {(cena.elementos ?? []).map((el) => (
        <ElementoEmCena
          key={el.id}
          elemento={el}
          cena={cena}
          estilo={estilo}
          personagens={personagens}
          falaAtiva={falaAtiva}
        />
      ))}

      {cena.falas.map((fala) =>
        fala.audio ? (
          <Sequence key={fala.id} from={fala.inicio} durationInFrames={fala.duracao}>
            <Audio src={staticFile(fala.audio)} />
          </Sequence>
        ) : null,
      )}

      {estilo.legenda.ativa && falaAtiva ? (
        <Legenda fala={falaAtiva} quadroNaFala={quadro - falaAtiva.inicio} estilo={estilo} />
      ) : null}
    </AbsoluteFill>
  );
};

export const Episodio: React.FC<PropsEpisodio> = ({ linha, estilo, personagens }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {(linha ?? []).map((cena) => (
        <Sequence key={cena.id} from={cena.inicio} durationInFrames={cena.duracao}>
          <CenaView cena={cena} estilo={estilo} personagens={personagens} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
