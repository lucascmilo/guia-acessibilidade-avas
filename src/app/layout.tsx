import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { PainelAjustesGlobal } from "@/components/AjustesLeitura/PainelAjustesGlobal";
import { ProvedorAjustesLeitura } from "@/components/AjustesLeitura/ProvedorAjustesLeitura";
import { SCRIPT_SEM_PISCAR } from "@/components/AjustesLeitura/opcoesAjustesLeitura";
import { Rodape } from "@/components/Rodape/Rodape";
import { Cabecalho } from "@/components/Cabecalho/Cabecalho";
import { LinkPularConteudo } from "@/components/LinkPularConteudo/LinkPularConteudo";
import { FocoNovaPagina } from "@/components/FocoNovaPagina/FocoNovaPagina";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Guia de Acessibilidade para AVAs",
    template: "%s – Guia de Acessibilidade para AVAs",
  },
  description:
    "Guia de práticas de acessibilidade para Ambientes Virtuais de Aprendizagem voltado a estudantes com TEA e TDAH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={atkinson.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_SEM_PISCAR }} />
      </head>
      <body>
        <ProvedorAjustesLeitura>
          <FocoNovaPagina />
          <LinkPularConteudo />
          <Cabecalho />
          <PainelAjustesGlobal />
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <Rodape />
        </ProvedorAjustesLeitura>
      </body>
    </html>
  );
}
