import { GLOSSARIO } from "./glossario";
import type { TermoGlossario } from "./tipos";

export function idDoTermo(term: string) {
  const base = term
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(.*\)/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `termo-${base}`;
}

const APELIDOS: Record<string, string> = {
  AVA: "AVA (Ambiente Virtual de Aprendizagem)",
  AVAs: "AVA (Ambiente Virtual de Aprendizagem)",
  TEA: "TEA (Transtorno do Espectro Autista)",
  TDAH: "TDAH (Transtorno de Déficit de Atenção/Hiperatividade)",
  DUA: "DUA (Desenho Universal para a Aprendizagem)",
  EaD: "EaD (Educação a Distância)",
  LBI: "LBI (Lei Brasileira de Inclusão)",
  GEM: "GEM (Guiding Empowerment Model)",
  NPDC: "NPDC (National Professional Development Center on ASD)",
  WCAG: "WCAG (Web Content Accessibility Guidelines)",
  "carga extrínseca": "Carga cognitiva (intrínseca e extrínseca)",
  "funções executivas": "Funções executivas",
  "acessibilidade cognitiva": "Acessibilidade cognitiva",
  interrupções: "Interrupção",
  "leitor de tela": "Tecnologia assistiva (na web)",
  "leitores de tela": "Tecnologia assistiva (na web)",
};

const TERMOS = new Map<string, TermoGlossario>(
  GLOSSARIO.flatMap((grupo) => grupo.terms.map((item) => [item.term, item] as const)),
);

const PADRAO = new RegExp(
  `(?<![\\p{L}\\d])(${Object.keys(APELIDOS)
    .sort((a, b) => b.length - a.length)
    .map((apelido) => apelido.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![\\p{L}\\d])`,
  "gu",
);

export type TrechoTexto = { texto: string; termo?: TermoGlossario };

export function separarTermos(texto: string, usados: Set<string>): TrechoTexto[] {
  const trechos: TrechoTexto[] = [];
  let ultimo = 0;
  for (const encontrado of texto.matchAll(PADRAO)) {
    const termo = TERMOS.get(APELIDOS[encontrado[0]]);
    if (!termo || usados.has(termo.term)) continue;
    usados.add(termo.term);
    const inicio = encontrado.index ?? 0;
    if (inicio > ultimo) trechos.push({ texto: texto.slice(ultimo, inicio) });
    trechos.push({ texto: encontrado[0], termo });
    ultimo = inicio + encontrado[0].length;
  }
  if (ultimo < texto.length) trechos.push({ texto: texto.slice(ultimo) });
  return trechos;
}
