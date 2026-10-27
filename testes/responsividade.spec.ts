import { expect, test, type Page } from "@playwright/test";
import { GRUPOS } from "../src/data/praticas";

const TELAS = [
  { nome: "iPhone SE", largura: 320, altura: 568 },
  { nome: "Android comum", largura: 360, altura: 800 },
  { nome: "iPhone", largura: 390, altura: 844 },
  { nome: "Android grande", largura: 412, altura: 915 },
  { nome: "celular deitado", largura: 844, altura: 390 },
  { nome: "tablet em pé", largura: 768, altura: 1024 },
  { nome: "tablet deitado", largura: 1024, altura: 768 },
  { nome: "notebook pequeno", largura: 1100, altura: 700 },
  { nome: "notebook médio", largura: 1180, altura: 760 },
  { nome: "notebook", largura: 1280, altura: 800 },
  { nome: "notebook HD", largura: 1366, altura: 768 },
  { nome: "desktop", largura: 1440, altura: 900 },
  { nome: "Full HD", largura: 1920, altura: 1080 },
  { nome: "2K", largura: 2560, altura: 1440 },
];

const PAGINAS = ["/", "/praticas", "/glossario", "/fontes", "/sobre", "/ajuda", ...GRUPOS.map((grupo) => `/praticas/${grupo.slug}`)];

async function preparar(page: Page, largura: number, altura: number, caminho: string) {
  await page.setViewportSize({ width: largura, height: altura });
  await page.addInitScript(() => {
    localStorage.setItem(
      "guia-ava-ajustes",
      JSON.stringify({ theme: "claro", textSize: 100, spacing: "padrao", lineWidth: "padrao", reduceMotion: true, focusMode: false }),
    );
  });
  await page.goto(caminho, { waitUntil: "networkidle" });
  await expect(page.locator("main h1").first()).toBeVisible();
}

async function problemasDeLayout(page: Page) {
  return page.evaluate(() => {
    const largura = document.documentElement.clientWidth;
    const problemas: string[] = [];
    const nome = (el: Element) =>
      `${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).replace(/[A-Za-z]+-module__\w+__/g, "").split(" ")[0]} "${(el.textContent ?? "").trim().slice(0, 30)}"`;
    const dentroDeRolagem = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (/(auto|scroll)/.test(s.overflowX)) return true;
      }
      return false;
    };
    const visivel = (el: Element) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const escondidoParaLeitor = s.position === "absolute" && r.width <= 1 && r.height <= 1;
      return (
        s.visibility !== "hidden" &&
        s.display !== "none" &&
        r.width > 0 &&
        r.height > 0 &&
        !escondidoParaLeitor &&
        !el.matches("a[href=\"#conteudo\"]:not(:focus)") &&
        !el.closest(".visually-hidden, [inert]")
      );
    };

    const sobra = document.documentElement.scrollWidth - largura;
    if (sobra > 0) problemas.push(`rolagem horizontal de ${sobra}px`);

    for (const el of document.querySelectorAll("body *")) {
      if (!visivel(el) || dentroDeRolagem(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.right > largura + 1 || r.left < -1) problemas.push(`fora da tela (${Math.round(r.left)}–${Math.round(r.right)}px): ${nome(el)}`);
      const s = getComputedStyle(el);
      if (s.overflowX === "hidden" && s.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 2 && el.children.length === 0)
        problemas.push(`texto cortado: ${nome(el)}`);
    }

    for (const el of document.querySelectorAll("a[href], button, input, select, [role=option], [tabindex='0']")) {
      if (!visivel(el)) continue;
      const s = getComputedStyle(el);
      if (s.display === "inline" && el.tagName === "A") continue;
      if (el.closest("p, li > p, dd") && s.display === "inline") continue;
      const alvo = el.matches("input[type=checkbox]") && el.closest("label") ? el.closest("label")! : el;
      const r = alvo.getBoundingClientRect();
      if (r.width < 24 || r.height < 24) problemas.push(`alvo pequeno ${Math.round(r.width)}×${Math.round(r.height)}: ${nome(el)}`);
    }

    const menuAberto = document.querySelector("#botao-menu")?.getAttribute("aria-expanded") === "true";
    const cabecalho = document.querySelector("header")!.getBoundingClientRect().height;
    if (!menuAberto && cabecalho > 100) problemas.push(`cabeçalho alto demais: ${Math.round(cabecalho)}px`);

    return [...new Set(problemas)];
  });
}

for (const tela of TELAS) {
  test.describe(`${tela.nome} (${tela.largura}×${tela.altura})`, () => {
    for (const caminho of PAGINAS) {
      test(`layout de ${caminho}`, async ({ page }) => {
        await preparar(page, tela.largura, tela.altura, caminho);
        const problemas = await problemasDeLayout(page);
        expect(problemas, problemas.join("\n")).toEqual([]);
      });
    }

    test("cabeçalho: menu e ações acessíveis", async ({ page }) => {
      await preparar(page, tela.largura, tela.altura, "/");
      const menu = page.locator("#botao-menu");
      if (await menu.isVisible()) {
        await menu.click();
        const lista = page.locator("#menu-principal");
        await expect(lista).toBeVisible();
        for (const item of ["Início", "Práticas", "Glossário", "Fontes", "Sobre", "Buscar", "Ajustes de leitura", "Ajuda"]) {
          await expect(lista.getByText(item, { exact: true }).first()).toBeVisible();
        }
        const problemas = await problemasDeLayout(page);
        expect(problemas, problemas.join("\n")).toEqual([]);
        await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Glossário" }).click();
        await expect(page).toHaveURL(/\/glossario$/);
        await expect(lista).toBeHidden();
      } else {
        for (const item of ["Início", "Práticas", "Glossário", "Fontes", "Sobre"]) {
          await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: item })).toBeVisible();
        }
        await expect(page.getByRole("button", { name: "Ajustes de leitura" })).toBeVisible();
      }
    });

    test("painel de ajustes aberto na página de prática", async ({ page }) => {
      await preparar(page, tela.largura, tela.altura, `/praticas/${GRUPOS[0].slug}`);
      await page.getByRole("button", { name: "Abrir ajustes de leitura" }).click();
      const painel = page.locator("#ajustes-de-leitura");
      await expect(painel).toBeVisible();
      const problemas = await problemasDeLayout(page);
      expect(problemas, problemas.join("\n")).toEqual([]);
      for (const botao of ["Escuro", "200%", "Ampliado", "Estreita", "Restaurar Padrão"]) {
        await painel.getByRole("button", { name: botao }).scrollIntoViewIfNeeded();
        await expect(painel.getByRole("button", { name: botao })).toBeInViewport();
      }
    });

    test("listas dos filtros abertas cabem na tela", async ({ page }) => {
      await preparar(page, tela.largura, tela.altura, "/praticas");
      const mostrar = page.getByRole("button", { name: "Mostrar filtros" });
      if (await mostrar.isVisible()) await mostrar.click();
      for (const id of ["filtro-tarefa", "filtro-desafio", "filtro-estrategia"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.locator(`#${id}`).click();
        const caixa = await page.getByRole("listbox").evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { esquerda: r.left, direita: r.right, topo: r.top, base: r.bottom };
        });
        expect(caixa.esquerda, `${id} passa da esquerda`).toBeGreaterThanOrEqual(0);
        expect(caixa.direita, `${id} passa da direita`).toBeLessThanOrEqual(tela.largura);
        expect(caixa.topo, `${id} passa do topo`).toBeGreaterThanOrEqual(0);
        expect(caixa.base, `${id} passa da base`).toBeLessThanOrEqual(tela.altura);
        await page.keyboard.press("Escape");
      }
    });

    test("filtros: em tela estreita, recolhidos atrás de “Mostrar filtros”", async ({ page }) => {
      await preparar(page, tela.largura, tela.altura, "/praticas");
      const mostrar = page.getByRole("button", { name: "Mostrar filtros" });
      const tipos = page.getByRole("group", { name: "Tipos de orientação" });
      if (tela.largura > 960) {
        await expect(mostrar).toBeHidden();
        await expect(tipos).toBeVisible();
        return;
      }
      await expect(page.getByRole("searchbox", { name: "Buscar no guia" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Aplicar filtros" })).toBeVisible();
      await expect(tipos).toBeHidden();
      await mostrar.click();
      await expect(tipos).toBeVisible();
      await tipos.getByText("Diretriz do DUA").click();
      await expect(page.getByRole("button", { name: /Ocultar filtros.*1 ativo/ })).toBeVisible();
    });

    test("balão do glossário cabe na tela", async ({ page }) => {
      await preparar(page, tela.largura, tela.altura, `/praticas/${GRUPOS[0].slug}`);
      const termo = page.locator(`#${GRUPOS[0].practices[0].id} p`).getByRole("button", { name: /ver definição/ }).first();
      await termo.scrollIntoViewIfNeeded();
      await termo.click();
      const caixa = await page.getByRole("dialog").evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { esquerda: r.left, direita: r.right };
      });
      expect(caixa.esquerda).toBeGreaterThanOrEqual(0);
      expect(caixa.direita).toBeLessThanOrEqual(tela.largura);
    });
  });
}
