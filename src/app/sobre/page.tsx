import type { Metadata } from "next";
import { Trilha } from "@/components/Trilha/Trilha";
import { CaixaDestaque } from "@/components/CaixaDestaque/CaixaDestaque";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Sobre a pesquisa" };

const ETAPAS = [
  { strong: "Identificação das práticas", rest: " nos 38 estudos da revisão de Teixeira et al. (2026a)." },
  { strong: "Constituição da base documental", rest: ", com 17 registros (DOC-01 a DOC-17)." },
  { strong: "Organização pelo DUA 3.0", rest: ", em uma matriz por registro." },
  { strong: "Rastreabilidade:", rest: " cada informação ligada ao artigo, item, diretriz ou critério de origem." },
  {
    strong: "Elaboração do guia,",
    rest: " com as práticas reunidas por finalidade e ligadas aos desafios e às estratégias da revisão.",
  },
];

const FICHA = [
  { label: "Autor", value: "Lucas Emanuel Camilo Bezerra" },
  { label: "Orientador", value: "Prof. Ivaldir Honório de Farias Júnior" },
  { label: "Coorientadora", value: "Profa. Cristiane Domingos de A. Teixeira" },
  { label: "Curso", value: "Bacharelado em Engenharia de Software" },
  { label: "Instituição", value: "Universidade de Pernambuco, Campus Garanhuns" },
  { label: "Ano", value: "2026" },
];

export default function SobrePage() {
  return (
    <div className="container">
      <Trilha items={[{ label: "Início", href: "/" }, { label: "Sobre a pesquisa" }]} />

      <h1 className={styles.titulo}>Sobre a pesquisa</h1>
      <p className={styles.introducao}>Este guia é o produto técnico de um Trabalho de Conclusão de Curso em Engenharia de Software.</p>

      <section aria-labelledby="o-que-e" className={styles.secao}>
        <h2 id="o-que-e" className={styles.tituloSecao}>
          O que é o guia
        </h2>
        <p className={styles.texto}>
          Um conjunto de práticas para desenvolver, configurar e adequar Ambientes Virtuais de Aprendizagem para
          estudantes com TEA e TDAH no ensino superior a distância.
        </p>
        <p className={styles.texto}>
          Cada prática liga a experiência relatada por esses estudantes às normas e aos referenciais que a sustentam, com
          o ponto exato de cada fonte.
        </p>
      </section>

      <div className={styles.linha}>
        <section aria-labelledby="como-foi" className={styles.etapas}>
          <h2 id="como-foi" className={styles.tituloSecao}>
            Como foi construído
          </h2>
          <p className={styles.texto}>
            Pesquisa aplicada, exploratória e qualitativa, com análise secundária de uma revisão sistemática e análise
            documental, em cinco etapas:
          </p>
          <ol className={styles.listaEtapas}>
            {ETAPAS.map((etapa, index) => (
              <li key={etapa.strong} className={styles.etapa}>
                <span aria-hidden="true" className={styles.numeroEtapa}>
                  {index + 1}
                </span>
                <span>
                  <b>{etapa.strong}</b>
                  {etapa.rest}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <aside aria-labelledby="ficha-tecnica" className={styles.cartao}>
          <h2 id="ficha-tecnica" className={styles.tituloCartao}>
            Ficha técnica
          </h2>
          <dl className={styles.fichaTecnica}>
            {FICHA.map((item) => (
              <div key={item.label}>
                <dt className={styles.rotuloFicha}>{item.label}</dt>
                <dd className={styles.valorFicha}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <section aria-labelledby="alcance" className={`${styles.secao} ${styles.ultima}`}>
        <h2 id="alcance" className={styles.tituloSecao}>
          Alcance
        </h2>
        <div className={styles.bloco}>
          <CaixaDestaque variant="atencao">
            O guia não passou por validação empírica: a eficácia das práticas não foi testada com estudantes. As
            orientações indicam o que as fontes estabelecem e propõem, não resultados medidos.
          </CaixaDestaque>
        </div>
      </section>

      {/*
      <section aria-labelledby="como-citar" className={`${styles.secao} ${styles.ultima}`}>
        <h2 id="como-citar" className={styles.tituloSecao}>
          Como citar
        </h2>
        <p className={styles.citacao}>
          BEZERRA, L. E. C. Design inclusivo em plataformas de EAD: um guia prático de acessibilidade para estudantes com
          TEA e TDAH. 2026. Trabalho de Conclusão de Curso (Bacharelado em Engenharia de Software) – Universidade de
          Pernambuco, Campus Garanhuns, Garanhuns, 2026.
        </p>
      </section> */}
    </div>
  );
}
