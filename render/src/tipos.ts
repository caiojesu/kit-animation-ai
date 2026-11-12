// Contrato entre Arte, Produção e Revisão.
// A descrição em prosa de cada campo está em docs/storyboard.md.
// Todos os caminhos de arquivo são relativos à raiz do repositório.

export type Entrada = {
  tipo?: "nenhuma" | "pop" | "sobe" | "desliza-esquerda" | "desliza-direita" | "fade";
  /** Milissegundos desde o início da cena, ou o id de uma fala da cena. */
  aos?: number | string;
};

export type ElementoBase = {
  id: string;
  x: number;
  y: number;
  entrada?: Entrada;
  /** Some neste momento (ms desde o início da cena, ou id de uma fala). */
  saiAos?: number | string;
};

export type ElementoPersonagem = ElementoBase & {
  tipo: "personagem";
  /** Pasta do personagem, por exemplo "personagens/nina". */
  personagem: string;
  escala?: number;
  espelhar?: boolean;
};

export type ElementoImagem = ElementoBase & {
  tipo: "imagem";
  src: string;
  largura: number;
};

export type ElementoTexto = ElementoBase & {
  tipo: "texto";
  texto: string;
  tamanho?: number;
  cor?: string;
  fundo?: string;
  larguraMaxima?: number;
};

export type Elemento = ElementoPersonagem | ElementoImagem | ElementoTexto;

export type Palavra = { texto: string; inicioMs: number; fimMs: number };
export type Tempos = { duracaoMs?: number; palavras: Palavra[] };

export type Fala = {
  id: string;
  /** id do elemento do tipo "personagem" que fala. Ausente = narração. */
  quem?: string;
  texto: string;
  audio?: string;
  /** Caminho do JSON de tempos. O script de render embute o conteúdo em temposDados. */
  tempos?: string;
  temposDados?: Tempos;
  /** Usado só quando não há áudio. */
  duracaoMs?: number;
  pausaDepoisMs?: number;
};

export type Cena = {
  id: string;
  cenario?: string;
  corDeFundo?: string;
  elementos?: Elemento[];
  falas?: Fala[];
  /** A cena dura pelo menos isto, mesmo que as falas acabem antes. */
  duracaoMinMs?: number;
  respiroInicialMs?: number;
  respiroFinalMs?: number;
};

export type Storyboard = {
  episodio: string;
  formato?: string;
  cenas: Cena[];
};

export type Peca = {
  id: string;
  tipo?: "fixa" | "boca" | "olhos";
  /** Para peças fixas. */
  src?: string;
  /** Para boca: fechada, aberta e (opcional) meia. Para olhos: abertos e fechados. */
  estados?: Record<string, string>;
  x: number;
  y: number;
  largura: number;
  z?: number;
};

export type PersonagemDef = {
  nome: string;
  largura: number;
  altura: number;
  pecas: Peca[];
};

export type Estilo = {
  largura: number;
  altura: number;
  fps: number;
  posesPorSegundo: number;
  legenda: {
    ativa: boolean;
    fonte: string;
    tamanho: number;
    cor: string;
    corDestaque: string;
    contorno: string;
    posicaoY: number;
    maxCaracteres: number;
  };
};

export type FalaResolvida = Fala & { inicio: number; duracao: number };
export type CenaResolvida = Omit<Cena, "falas"> & {
  falas: FalaResolvida[];
  inicio: number;
  duracao: number;
};

export type PropsEpisodio = {
  storyboard: Storyboard;
  /** Chave = pasta do personagem. Preenchido pelo script de render. */
  personagens: Record<string, PersonagemDef>;
  estilo: Estilo;
  /** Preenchido pelo calculateMetadata. */
  linha?: CenaResolvida[];
};
