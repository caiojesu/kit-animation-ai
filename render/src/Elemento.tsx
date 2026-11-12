import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { PersonagemFalante } from "./Personagem";
import type { CenaResolvida, Elemento, Estilo, FalaResolvida, PropsEpisodio } from "./tipos";

/** Converte "ms desde o início da cena" ou "id de uma fala" em quadro da cena. */
const paraQuadro = (
  aos: number | string | undefined,
  cena: CenaResolvida,
  fps: number,
  padrao: number,
): number => {
  if (aos === undefined) return padrao;
  if (typeof aos === "number") return Math.round((aos / 1000) * fps);
  const fala = cena.falas.find((f) => f.id === aos);
  return fala ? fala.inicio : padrao;
};

const DURACAO_ENTRADA_S = 0.35;

export const ElementoEmCena: React.FC<{
  elemento: Elemento;
  cena: CenaResolvida;
  estilo: Estilo;
  personagens: PropsEpisodio["personagens"];
  falaAtiva: FalaResolvida | null;
}> = ({ elemento, cena, estilo, personagens, falaAtiva }) => {
  const quadro = useCurrentFrame();
  const { fps, posesPorSegundo } = estilo;

  const entra = paraQuadro(elemento.entrada?.aos, cena, fps, 0);
  const sai = paraQuadro(elemento.saiAos, cena, fps, Number.POSITIVE_INFINITY);
  if (quadro < entra || quadro >= sai) return null;

  // Movimento em passos: o progresso só muda a cada pose, como em stop motion.
  const passo = Math.max(1, Math.round(fps / posesPorSegundo));
  const quadroEmPassos = Math.floor((quadro - entra) / passo) * passo;
  const p = Math.min(1, quadroEmPassos / (DURACAO_ENTRADA_S * fps));
  const suave = 1 - Math.pow(1 - p, 3);

  let dx = 0;
  let dy = 0;
  let escala = 1;
  let opacidade = 1;
  switch (elemento.entrada?.tipo ?? "nenhuma") {
    case "pop":
      escala = 0.6 + 0.4 * suave;
      opacidade = p > 0 ? 1 : 0.999;
      break;
    case "sobe":
      dy = (1 - suave) * 500;
      break;
    case "desliza-esquerda":
      dx = -(1 - suave) * estilo.largura;
      break;
    case "desliza-direita":
      dx = (1 - suave) * estilo.largura;
      break;
    case "fade":
      opacidade = suave;
      break;
    default:
      break;
  }

  if (elemento.tipo === "personagem") {
    const def = personagens[elemento.personagem];
    if (!def) return null;
    const escalaP = (elemento.escala ?? 1) * escala;
    const fala = falaAtiva && falaAtiva.quem === elemento.id ? falaAtiva : null;
    // Âncora do personagem: centro da base (os pés).
    return (
      <div
        style={{
          position: "absolute",
          left: elemento.x + dx - (def.largura * escalaP) / 2,
          top: elemento.y + dy - def.altura * escalaP,
          width: def.largura,
          height: def.altura,
          transform: `scale(${escalaP}) scaleX(${elemento.espelhar ? -1 : 1})`,
          transformOrigin: "top left",
          opacity: opacidade,
        }}
      >
        <PersonagemFalante
          pasta={elemento.personagem}
          def={def}
          fala={fala}
          quadroNaFala={fala ? quadro - fala.inicio : 0}
          estilo={estilo}
        />
      </div>
    );
  }

  // Âncora de imagem e texto: o centro.
  const centro: React.CSSProperties = {
    position: "absolute",
    left: elemento.x + dx,
    top: elemento.y + dy,
    transform: `translate(-50%, -50%) scale(${escala})`,
    opacity: opacidade,
  };

  if (elemento.tipo === "imagem") {
    return <Img src={staticFile(elemento.src)} style={{ ...centro, width: elemento.largura }} />;
  }

  return (
    <div
      style={{
        ...centro,
        width: "max-content",
        maxWidth: elemento.larguraMaxima ?? estilo.largura - 160,
        fontFamily: estilo.legenda.fonte,
        fontWeight: 800,
        fontSize: elemento.tamanho ?? 88,
        lineHeight: 1.1,
        textAlign: "center",
        color: elemento.cor ?? "#1B1B1B",
        backgroundColor: elemento.fundo,
        padding: elemento.fundo ? "24px 40px" : 0,
        borderRadius: elemento.fundo ? 28 : 0,
      }}
    >
      {elemento.texto}
    </div>
  );
};
