#!/usr/bin/env node
// Renderiza um episódio a partir do seu storyboard.json.
//
//   node scripts/render.mjs <episodio> [--quadros] [--sem-master] [--so-validar]
//
// <episodio> é um id (vira episodios/<id>) ou um caminho de pasta relativo à
// raiz do repositório (por exemplo render/exemplo).
// Saída: <pasta>/corte/v<N>.mp4, v<N>.relatorio.json e, com --quadros,
// v<N>-quadros/ com um quadro de conferência por segundo, em meia resolução.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const pastaRender = path.resolve(aqui, "..");
const raiz = path.resolve(pastaRender, "..");

const args = process.argv.slice(2);
const opcoes = new Set(args.filter((a) => a.startsWith("--")));
const alvo = args.find((a) => !a.startsWith("--"));

if (!alvo) {
  console.error("Uso: node scripts/render.mjs <episodio> [--quadros] [--sem-master] [--so-validar]");
  process.exit(2);
}

const relEpisodio = /[\\/]/.test(alvo) ? alvo.replace(/\\/g, "/").replace(/\/$/, "") : `episodios/${alvo}`;
const pastaEpisodio = path.resolve(raiz, relEpisodio);
const caminhoStoryboard = path.join(pastaEpisodio, "storyboard.json");

const lerJson = (caminho) => JSON.parse(fs.readFileSync(caminho, "utf8"));
const existe = (rel) => fs.existsSync(path.resolve(raiz, rel));

if (!fs.existsSync(caminhoStoryboard)) {
  console.error(`Não encontrei ${path.relative(raiz, caminhoStoryboard)}.`);
  process.exit(2);
}

// ---------- 1. Ler e validar ----------

const storyboard = lerJson(caminhoStoryboard);
const erros = [];
const arquivos = new Set();
const pastasPersonagem = new Set();
const personagens = {};

const exigir = (rel, onde) => {
  if (typeof rel !== "string" || rel.length === 0) {
    erros.push(`${onde}: caminho vazio.`);
    return false;
  }
  if (path.isAbsolute(rel) || rel.includes("..")) {
    erros.push(`${onde}: "${rel}" precisa ser relativo à raiz do repositório.`);
    return false;
  }
  if (!existe(rel)) {
    erros.push(`${onde}: arquivo não encontrado: ${rel}`);
    return false;
  }
  return true;
};

if (!Array.isArray(storyboard.cenas) || storyboard.cenas.length === 0) {
  erros.push("storyboard.json: a lista 'cenas' está vazia.");
}

const idsCena = new Set();
for (const cena of storyboard.cenas ?? []) {
  const onde = `cena ${cena.id ?? "(sem id)"}`;
  if (!cena.id) erros.push("Há uma cena sem 'id'.");
  if (idsCena.has(cena.id)) erros.push(`${onde}: id repetido.`);
  idsCena.add(cena.id);

  if (cena.cenario && exigir(cena.cenario, `${onde}, cenario`)) arquivos.add(cena.cenario);

  const idsElemento = new Set();
  const idsFala = new Set((cena.falas ?? []).map((f) => f.id));

  for (const el of cena.elementos ?? []) {
    const ondeEl = `${onde}, elemento ${el.id ?? "(sem id)"}`;
    if (!el.id) erros.push(`${onde}: há um elemento sem 'id'.`);
    if (idsElemento.has(el.id)) erros.push(`${ondeEl}: id repetido na cena.`);
    idsElemento.add(el.id);
    if (typeof el.x !== "number" || typeof el.y !== "number") erros.push(`${ondeEl}: faltam 'x' e 'y'.`);

    for (const [campo, valor] of [["entrada.aos", el.entrada?.aos], ["saiAos", el.saiAos]]) {
      if (typeof valor === "string" && !idsFala.has(valor)) {
        erros.push(`${ondeEl}: ${campo} aponta para a fala "${valor}", que não existe nesta cena.`);
      }
    }

    if (el.tipo === "personagem") {
      const ficha = `${el.personagem}/personagem.json`;
      if (!exigir(ficha, ondeEl)) continue;
      pastasPersonagem.add(el.personagem);
      if (!personagens[el.personagem]) {
        const def = lerJson(path.resolve(raiz, ficha));
        personagens[el.personagem] = def;
        for (const peca of def.pecas ?? []) {
          const fontes = [peca.src, ...Object.values(peca.estados ?? {})].filter(Boolean);
          if (fontes.length === 0) erros.push(`${ficha}: a peça "${peca.id}" não tem 'src' nem 'estados'.`);
          for (const f of fontes) exigir(`${el.personagem}/${f}`, `${ficha}, peça ${peca.id}`);
        }
        if (!def.pecas?.some((p) => p.tipo === "boca")) {
          console.warn(`Aviso: ${ficha} não tem peça do tipo "boca"; o personagem não vai mexer a boca.`);
        }
      }
    } else if (el.tipo === "imagem") {
      if (exigir(el.src, ondeEl)) arquivos.add(el.src);
      if (typeof el.largura !== "number") erros.push(`${ondeEl}: falta 'largura'.`);
    } else if (el.tipo === "texto") {
      if (!el.texto) erros.push(`${ondeEl}: falta 'texto'.`);
    } else {
      erros.push(`${ondeEl}: tipo desconhecido "${el.tipo}". Use personagem, imagem ou texto.`);
    }
  }

  for (const fala of cena.falas ?? []) {
    const ondeFala = `${onde}, fala ${fala.id ?? "(sem id)"}`;
    if (!fala.id) erros.push(`${onde}: há uma fala sem 'id'.`);
    if (!fala.texto) erros.push(`${ondeFala}: falta 'texto' (usado na legenda).`);
    if (fala.quem && !idsElemento.has(fala.quem)) {
      erros.push(`${ondeFala}: 'quem' aponta para "${fala.quem}", que não é um elemento desta cena.`);
    }
    if (fala.audio) {
      if (exigir(fala.audio, ondeFala)) arquivos.add(fala.audio);
    } else if (!fala.duracaoMs && !fala.tempos) {
      console.warn(`Aviso: ${ondeFala} não tem áudio nem duração; vou usar 2 segundos.`);
    }
    if (fala.tempos && exigir(fala.tempos, ondeFala)) {
      const dados = lerJson(path.resolve(raiz, fala.tempos));
      if (!Array.isArray(dados.palavras)) {
        erros.push(`${fala.tempos}: falta a lista 'palavras'. Veja docs/voz.md.`);
      } else {
        fala.temposDados = dados;
      }
    }
  }
}

if (erros.length > 0) {
  console.error(`O storyboard tem ${erros.length} problema(s):`);
  for (const e of erros) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Storyboard válido: ${storyboard.cenas.length} cena(s).`);
if (opcoes.has("--so-validar")) process.exit(0);

// ---------- 2. Estilo, a partir de config/projeto.json ----------

const caminhoConfig = path.join(raiz, "config", "projeto.json");
const config = fs.existsSync(caminhoConfig) ? lerJson(caminhoConfig) : {};
const estilo = {
  largura: config.video?.largura ?? 1080,
  altura: config.video?.altura ?? 1920,
  fps: config.video?.fps ?? 30,
  posesPorSegundo: config.video?.poses_por_segundo ?? 12,
  legenda: {
    ativa: config.legenda?.ativa ?? true,
    fonte: config.legenda?.fonte ?? "Arial, Helvetica, sans-serif",
    tamanho: config.legenda?.tamanho ?? 68,
    cor: config.legenda?.cor ?? "#FFFFFF",
    corDestaque: config.legenda?.cor_destaque ?? "#FFD84D",
    contorno: config.legenda?.contorno ?? "#111111",
    posicaoY: config.legenda?.posicao_y ?? 1480,
    maxCaracteres: config.legenda?.max_caracteres ?? 18,
  },
};

// ---------- 3. Pasta pública só com o que o episódio usa ----------

const nome = relEpisodio.replace(/[^a-zA-Z0-9_-]+/g, "_");
const pastaPublica = path.join(pastaRender, ".publico", nome);
fs.rmSync(pastaPublica, { recursive: true, force: true });
fs.mkdirSync(pastaPublica, { recursive: true });

const copiar = (rel) => {
  const destino = path.join(pastaPublica, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.cpSync(path.resolve(raiz, rel), destino, { recursive: true });
};
for (const rel of arquivos) copiar(rel);
for (const rel of pastasPersonagem) copiar(rel);

const caminhoProps = path.join(pastaRender, ".publico", `${nome}.props.json`);
fs.writeFileSync(caminhoProps, JSON.stringify({ storyboard, personagens, estilo }));

// ---------- 4. Render ----------

const pastaCorte = path.join(pastaEpisodio, "corte");
fs.mkdirSync(pastaCorte, { recursive: true });
const versoes = fs
  .readdirSync(pastaCorte)
  .map((f) => /^v(\d+)\.mp4$/.exec(f))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const versao = (versoes.length ? Math.max(...versoes) : 0) + 1;
const saida = path.join(pastaCorte, `v${versao}.mp4`);
const bruto = path.join(pastaCorte, `v${versao}.bruto.mp4`);

const cli = path.join(pastaRender, "node_modules", "@remotion", "cli", "remotion-cli.js");
if (!fs.existsSync(cli)) {
  console.error("Pacotes do Remotion não instalados. Rode `npm install` dentro de render/.");
  process.exit(2);
}

const remotion = (argumentos, { silencioso = false } = {}) =>
  spawnSync(process.execPath, [cli, ...argumentos], {
    cwd: pastaRender,
    stdio: silencioso ? "pipe" : "inherit",
    encoding: "utf8",
  });

const inicio = Date.now();
const r = remotion([
  "render",
  "src/index.ts",
  "Episodio",
  bruto,
  `--props=${caminhoProps}`,
  `--public-dir=${pastaPublica}`,
  "--log=warn",
]);
if (r.status !== 0) {
  console.error("O render falhou.");
  process.exit(r.status ?? 1);
}

// ---------- 5. Master de áudio ----------

const alvoLufs = config.audio?.lufs_alvo ?? -14;
const picoDbtp = config.audio?.pico_maximo_dbtp ?? -1.5;
let master = "nao_aplicado";
if (!opcoes.has("--sem-master")) {
  const m = remotion(
    ["ffmpeg", "-y", "-i", bruto, "-c:v", "copy", "-af", `loudnorm=I=${alvoLufs}:TP=${picoDbtp}:LRA=11`, "-c:a", "aac", "-ar", "48000", "-b:a", "192k", saida],
    { silencioso: true },
  );
  if (m.status === 0 && fs.existsSync(saida)) {
    master = `loudnorm ${alvoLufs} LUFS, pico ${picoDbtp} dBTP`;
    fs.rmSync(bruto, { force: true });
  } else {
    console.warn("Aviso: não consegui normalizar o áudio; mantive o áudio original.");
    master = "falhou";
  }
}
if (!fs.existsSync(saida)) fs.renameSync(bruto, saida);

// ---------- 6. Quadros de conferência e relatório ----------

let quadros = 0;
if (opcoes.has("--quadros")) {
  const pastaQuadros = path.join(pastaCorte, `v${versao}-quadros`);
  fs.mkdirSync(pastaQuadros, { recursive: true });
  const q = remotion(
    ["ffmpeg", "-y", "-i", saida, "-r", "1", "-s", `${Math.round(estilo.largura / 2)}x${Math.round(estilo.altura / 2)}`, path.join(pastaQuadros, "q-%03d.jpg")],
    { silencioso: true },
  );
  if (q.status === 0) quadros = fs.readdirSync(pastaQuadros).length;
  else console.warn("Aviso: não consegui extrair os quadros de conferência.");
}

let duracaoS = null;
const sonda = remotion(
  ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", saida],
  { silencioso: true },
);
if (sonda.status === 0) duracaoS = Number.parseFloat(sonda.stdout.trim()) || null;

const relatorio = {
  episodio: storyboard.episodio ?? nome,
  versao,
  arquivo: path.relative(raiz, saida).replace(/\\/g, "/"),
  duracao_s: duracaoS,
  tamanho_mb: Number((fs.statSync(saida).size / 1024 / 1024).toFixed(2)),
  video: `${estilo.largura}x${estilo.altura} a ${estilo.fps} fps`,
  cenas: storyboard.cenas.length,
  falas: storyboard.cenas.reduce((n, c) => n + (c.falas?.length ?? 0), 0),
  falas_sem_tempos: storyboard.cenas.reduce(
    (n, c) => n + (c.falas ?? []).filter((f) => !f.temposDados).length,
    0,
  ),
  master_audio: master,
  quadros_de_conferencia: quadros,
  tempo_de_render_s: Math.round((Date.now() - inicio) / 1000),
  gerado_em: new Date().toISOString(),
};
fs.writeFileSync(path.join(pastaCorte, `v${versao}.relatorio.json`), JSON.stringify(relatorio, null, 2));
fs.rmSync(pastaPublica, { recursive: true, force: true });
fs.rmSync(caminhoProps, { force: true });

console.log(JSON.stringify(relatorio, null, 2));
