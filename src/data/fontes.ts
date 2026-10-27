import type { LinhaDocumento } from "./tipos";

export const DOCUMENTOS_LEGAIS: LinhaDocumento[] = [
  { code: "DOC-01", name: "Constituição Federal", year: "1988" },
  { code: "DOC-02", name: "Lei nº 9.394 (LDB)", year: "1996" },
  {
    code: "DOC-03",
    name: "Política de Educação Especial na Perspectiva Inclusiva (elaborada com base na PNEEPEI de 2008)",
    year: "2025",
  },
  { code: "DOC-04", name: "Decreto nº 6.949 (Convenção sobre os Direitos das Pessoas com Deficiência)", year: "2009" },
  { code: "DOC-05", name: "Leis nº 12.711 e nº 13.409", year: "2012 e 2016" },
  { code: "DOC-06", name: "Lei nº 12.764 (Lei Berenice Piana)", year: "2012" },
  { code: "DOC-07", name: "Lei nº 13.146 (LBI)", year: "2015" },
  { code: "DOC-08", name: "Decreto nº 12.456 (educação a distância na graduação)", year: "2025" },
  { code: "DOC-09", name: "Decreto nº 10.656 (Fundeb)", year: "2021" },
  {
    code: "DOC-10",
    name: "Decreto nº 12.686, alterado pelo Decreto nº 12.773 (Política Nacional de Educação Especial Inclusiva)",
    year: "2025",
  },
];

export const DOCUMENTOS_TECNICOS: LinhaDocumento[] = [
  { code: "DOC-11", name: "WCAG 2.2 (Web Content Accessibility Guidelines), W3C", year: "2023" },
  { code: "DOC-12", name: "eMAG 3.1 (Modelo de Acessibilidade em Governo Eletrônico)", year: "2014" },
  {
    code: "DOC-13",
    name: "ISO 9241-11 e ISO 9241-210 (ergonomia da interação humano-sistema)",
    year: "Vários",
  },
  { code: "DOC-14", name: "ABNT NBR 17225 (acessibilidade em conteúdo e aplicações web)", year: "2025" },
];

export const DOCUMENTOS_PEDAGOGICOS: LinhaDocumento[] = [
  { code: "DOC-15", name: "Desenho Universal para a Aprendizagem (UDL), versão 3.0, CAST", year: "2024" },
  { code: "DOC-16", name: "Modelo NPDC (Waligórska et al., 2019)", year: "2019" },
  { code: "DOC-17", name: "Guiding Empowerment Model – GEM (Beaux et al., 2024)", year: "2024" },
];

export const REFERENCIAS: string[] = [
  "ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. NBR 17225: acessibilidade em conteúdo e aplicações web: requisitos. Rio de Janeiro: ABNT, 2025.",
  "TEIXEIRA, C. D. A.; LIMA, A. C. F. C.; FARIAS JUNIOR, I. H.; TEIXEIRA, M. M. Desafios e estratégias de inclusão de estudantes neurodivergentes na educação a distância: uma revisão sistemática da literatura. In: SIMPÓSIO BRASILEIRO SOBRE FATORES HUMANOS EM SISTEMAS COMPUTACIONAIS (IHC), 25., 2026, Quixadá. Trilha de Pesquisa.",
];
