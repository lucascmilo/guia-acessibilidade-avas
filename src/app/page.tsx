import Link from "next/link";
import { Selo, EtiquetaCodigo } from "@/components/Selo/Selo";
import { LinkBotao } from "@/components/LinkBotao/LinkBotao";
import { IconeSetaDireita } from "@/components/Icones/Icones";
import { DESAFIOS } from "@/data/desafios";
import styles from "./page.module.css";

const CAMINHOS = [
  {
    task: "desenvolver",
    title: "Desenvolver",
    text: "Para equipes que constroem ou modificam a plataforma.",
    link: "Práticas para desenvolver",
  },
  {
    task: "configurar",
    title: "Configurar",
    text: "Para quem administra o AVA e ajusta temas, menus e recursos.",
    link: "Práticas para configurar",
  },
  {
    task: "adequar",
    title: "Adequar",
    text: "Para docentes e equipes que organizam cursos e materiais.",
    link: "Práticas para adequar",
  },
];

export default function HomePage() {
  return (
    <div className="container">
      <section aria-labelledby="titulo" className={styles.abertura}>
        <h1 id="titulo" className={styles.tituloAbertura}>
          Guia de práticas de acessibilidade para Ambientes Virtuais de Aprendizagem
        </h1>
        <p className={styles.textoAbertura}>
          Orientações para desenvolver, configurar e adequar AVAs para estudantes com TEA e TDAH. Cada
          orientação mostra de onde vem: lei, norma técnica, diretriz pedagógica ou literatura.
        </p>
        <div className={styles.acoesAbertura}>
          <LinkBotao href="/praticas">
            Ver as práticas
            <IconeSetaDireita />
          </LinkBotao>
          <LinkBotao href="#como-ler" variant="secundario">
            Como usar o guia
          </LinkBotao>
        </div>
      </section>

      <section aria-labelledby="comecar" className={styles.secao}>
        <h2 id="comecar" className={styles.tituloSecao}>
          Por onde começar
        </h2>
        <p className={styles.introducaoSecao}>
          Escolha o que você vai fazer no AVA. Você pode trocar de caminho a qualquer momento.
        </p>
        <ul className={styles.caminhos}>
          {CAMINHOS.map((item) => (
            <li key={item.title} className={styles.cartaoCaminho}>
              <h3 className={styles.tituloCaminho}>{item.title}</h3>
              <p className={styles.textoCaminho}>{item.text}</p>
              <Link href={`/praticas?tarefa=${item.task}`} className={styles.linkCaminho}>
                {item.link}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="desafios" className={styles.secao}>
        <h2 id="desafios" className={styles.tituloSecao}>
          Encontre pelo desafio
        </h2>
        <p className={styles.introducaoSecao}>
          Os desafios seguem a síntese da revisão sistemática de Teixeira <i>et al.</i> (2026a).
        </p>
        <ul className={styles.desafios}>
          {DESAFIOS.map((item) => (
            <li key={item.code}>
              <Link href={`/praticas?desafio=${item.code}`} className={styles.desafio}>
                <span className={styles.codigoDesafio}>{item.code}</span>
                <span className={styles.nomeDesafio}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="como-ler" aria-labelledby="como-ler-titulo" className={styles.secaoFinal}>
        <h2 id="como-ler-titulo" className={styles.tituloSecao}>
          Como ler uma ficha
        </h2>
        <p className={styles.introducaoSecao}>Toda prática do guia segue a mesma estrutura, na mesma ordem.</p>
        <div className={styles.linhaLeitura}>
          <article aria-labelledby="ficha-exemplo" className={styles.cartaoExemplo}>
            <h3 id="ficha-exemplo" className={styles.tituloExemplo}>
              Menus e ajuda sempre no mesmo lugar
            </h3>
            <div className={styles.etiquetasExemplo}>
              <Selo type="normativa" />
              <EtiquetaCodigo code="D1" />
              <EtiquetaCodigo code="D3" />
            </div>
            <p className={styles.textoExemplo}>
              <b>O que fazer:</b> manter menus e mecanismos de ajuda na mesma ordem em todas as páginas do AVA.
            </p>
            <p className={styles.textoExemplo}>
              <b>Fundamentação:</b> ABNT NBR 17225, itens 5.7.15 e 5.7.16.
            </p>
          </article>
          <ol className={styles.listaLeitura}>
            <li>
              <b>Selo de tipo:</b> diz se a orientação é exigência normativa, recomendação técnica, diretriz do DUA,
              fundamento jurídico ou proposta para AVAs.
            </li>
            <li>
              <b>Códigos D e E:</b> o desafio a que a prática responde e a estratégia a que corresponde.
            </li>
            <li>
              <b>O que fazer, por quê e como verificar:</b> a ação, a barreira que ela reduz e como conferir.
            </li>
            <li>
              <b>Fundamentação:</b> o documento e o ponto exato de onde a orientação foi extraída.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
