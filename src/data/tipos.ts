export type TipoOrientacao = "normativa" | "tecnica" | "dua" | "juridico" | "proposta";

export type Categoria = { code: string; label: string; description: string };

export type TarefaAva = "desenvolver" | "configurar" | "adequar";

export type Fonte = { document: string; locator: string; strength: string };

export type Pratica = {
  id: string;
  title: string;
  type: TipoOrientacao;
  challenges: string[];
  strategies: string[];
  tasks: TarefaAva[];
  what: string;
  why: string;
  verify: string[];
  sources: Fonte[];
};

export type GrupoPraticas = {
  slug: string;
  title: string;
  goal: string;
  summary: string[];
  practices: Pratica[];
};

export type ResumoPratica = Pratica & { href: string; groupTitle: string };

export type TermoGlossario = {
  term: string;
  definition: string;
  source: string;
};

export type GrupoGlossario = { letter: string; terms: TermoGlossario[] };

export type LinhaDocumento = { code: string; name: string; year: string };
