import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { EXEMPLOS } from "../src/data/exemplos";
import { GRUPOS, PRATICAS } from "../src/data/praticas";

const PAGINAS = ["/", "/praticas", "/glossario", "/fontes", "/sobre", "/ajuda", ...GRUPOS.map((grupo) => `/praticas/${grupo.slug}`)];
const TEMAS = ["claro", "suave", "escuro"] as const;
const REGRAS_WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function comAjustes(page: Page, ajustes: Record<string, unknown>) {
  await page.addInitScript((valor) => {
    localStorage.setItem(
      "guia-ava-ajustes",
      JSON.stringify({ theme: "claro", textSize: 100, spacing: "padrao", lineWidth: "padrao", reduceMotion: true, focusMode: false, ...valor }),
    );
  }, ajustes);
}

async function abrir(page: Page, caminho: string) {
  await page.goto(caminho, { waitUntil: "networkidle" });
  await expect(page.locator("main h1").first()).toBeVisible();
}

test.describe("WCAG 2.2 A e AA (axe-core)", () => {
  for (const tema of TEMAS) {
    for (const caminho of PAGINAS) {
      test(`${caminho} no tema ${tema}`, async ({ page }) => {
        await comAjustes(page, { theme: tema });
        await abrir(page, caminho);
        const resultado = await new AxeBuilder({ page }).withTags(REGRAS_WCAG).analyze();
        const resumo = resultado.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× – ${v.help}`);
        expect(resumo, resumo.join("\n")).toEqual([]);
      });
    }
  }

  test("ficha aberta com fundamentação e balão do glossário", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    await page.locator("#menus-e-ajuda").getByRole("button", { name: /Mostrar fundamentação/ }).click();
    await page.locator("#menus-e-ajuda p").getByRole("button", { name: /ver definição/ }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const resultado = await new AxeBuilder({ page }).withTags(REGRAS_WCAG).analyze();
    expect(resultado.violations.map((v) => v.id)).toEqual([]);
  });

  test("lista de seleção dos filtros aberta", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas");
    await page.locator("#filtro-estrategia").click();
    await expect(page.getByRole("listbox")).toBeVisible();
    const resultado = await new AxeBuilder({ page }).withTags(REGRAS_WCAG).analyze();
    expect(resultado.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("Teclado", () => {
  test("o primeiro Tab mostra “Ir para o conteúdo” e o Enter pula o menu", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/");
    await page.keyboard.press("Tab");
    const pular = page.getByRole("link", { name: "Ir para o conteúdo" });
    await expect(pular).toBeFocused();
    await expect(pular).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /Ver as práticas/ })).toBeFocused();
  });

  test("depois de trocar de página, o primeiro Tab volta ao “Ir para o conteúdo”", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/");
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Glossário" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/glossario$/);
    await expect(page.getByRole("heading", { level: 1, name: "Glossário" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused();
  });

  test("o foco sempre tem moldura visível", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/navegacao-e-orientacao");
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const estilo = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (el === document.body) return { nome: "body", contorno: "fora da página", largura: 3 };
        const cs = getComputedStyle(el);
        return { nome: el.textContent?.trim().slice(0, 30), contorno: cs.outlineStyle, largura: parseFloat(cs.outlineWidth) };
      });
      expect(estilo.contorno, `sem moldura em "${estilo.nome}"`).not.toBe("none");
      expect(estilo.largura, `moldura fina em "${estilo.nome}"`).toBeGreaterThanOrEqual(2);
    }
  });

  test("balão do glossário: abre com Enter, recebe o foco e fecha com Esc", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    const termo = page.locator("#menus-e-ajuda p").getByRole("button", { name: /ver definição/ }).first();
    await termo.focus();
    await page.keyboard.press("Enter");
    const balao = page.getByRole("dialog");
    await expect(balao).toBeFocused();
    await expect(balao.getByRole("button", { name: "Fechar" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(balao).toBeHidden();
    await expect(termo).toBeFocused();
  });

  test("lista de seleção: setas escolhem, Enter confirma sem enviar o formulário", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas");
    const contador = page.getByRole("status").filter({ hasText: "resultado" });
    const antes = await contador.textContent();
    const campo = page.locator("#filtro-desafio");
    await campo.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(campo).toBeFocused();
    await expect(campo).toContainText("D1");
    await expect(contador).toHaveText(antes ?? "");
  });
});

test.describe("Ajustes de leitura e telas", () => {
  for (const { largura, tamanho } of [
    { largura: 320, tamanho: 100 },
    { largura: 375, tamanho: 200 },
    { largura: 1280, tamanho: 200 },
  ]) {
    for (const caminho of PAGINAS) {
      test(`${caminho} sem rolagem horizontal em ${largura}px com texto a ${tamanho}%`, async ({ page }) => {
        await page.setViewportSize({ width: largura, height: 800 });
        await comAjustes(page, { textSize: tamanho, spacing: "ampliado" });
        await abrir(page, caminho);
        const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(sobra).toBeLessThanOrEqual(0);
      });
    }
  }

  test("os ajustes ficam guardados entre páginas e “Restaurar padrão” volta ao início", async ({ page }) => {
    await abrir(page, "/praticas/navegacao-e-orientacao");
    await page.getByRole("button", { name: "Abrir ajustes de leitura" }).click();
    const painel = page.locator("#ajustes-de-leitura");
    await painel.getByRole("button", { name: "Escuro" }).click();
    await painel.getByRole("button", { name: "150%" }).click();
    await abrir(page, "/glossario");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "escuro");
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "150");
    await page.getByRole("banner").getByRole("button", { name: "Ajustes de leitura" }).click();
    await page.locator("#ajustes-de-leitura").getByRole("button", { name: "Restaurar Padrão" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "claro");
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "100");
  });
});

test.describe("Página de prática", () => {
  test("os ajustes de leitura começam fechados e só abrem por clique", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    await expect(page.locator("#ajustes-de-leitura")).toHaveCount(0);
    await page.getByRole("button", { name: "Abrir ajustes de leitura" }).click();
    await expect(page.locator("#ajustes-de-leitura")).toBeVisible();
  });

  test("“Nessa página” fica fixo ao rolar", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    const sumario = page.getByRole("navigation", { name: "Nessa página" });
    for (const y of [600, 1200, 1800]) {
      await page.evaluate((destino) => window.scrollTo({ top: destino, behavior: "instant" }), y);
      const topo = await sumario.evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.round(topo), `sumário fora do lugar com a página rolada em ${y}px`).toBe(24);
      const botao = await page.evaluate(() => {
        const sumario = document.querySelector("[aria-labelledby=\"toc-titulo\"]")!.getBoundingClientRect();
        const abrir = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Abrir ajustes"))!.getBoundingClientRect();
        return { sobreposicao: sumario.bottom - abrir.top, dentroDaTela: abrir.bottom <= window.innerHeight };
      });
      expect(botao.sobreposicao, `botão de ajustes atrás do sumário com a página rolada em ${y}px`).toBeLessThanOrEqual(0);
      expect(botao.dentroDaTela, "botão de ajustes fora da tela").toBe(true);
    }
  });

  test("com os ajustes abertos, o painel não passa por trás do sumário", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    await page.getByRole("button", { name: "Abrir ajustes de leitura" }).click();
    for (const y of [0, 300, 600, 900, 1200]) {
      await page.evaluate((destino) => window.scrollTo({ top: destino, behavior: "instant" }), y);
      const sobreposicao = await page.evaluate(() => {
        const sumario = document.querySelector("[aria-labelledby=\"toc-titulo\"]")!.getBoundingClientRect();
        const painel = document.getElementById("ajustes-de-leitura")!.getBoundingClientRect();
        return Math.min(sumario.bottom, painel.bottom) - Math.max(sumario.top, painel.top);
      });
      expect(sobreposicao, `painel e sumário sobrepostos com a página rolada em ${y}px`).toBeLessThanOrEqual(0);
    }
  });

  test("o marcador do sumário passa por todas as fichas ao rolar até o fim", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    const sumario = page.getByRole("navigation", { name: "Nessa página" });
    const total = await sumario.getByRole("link").count();
    const vistos = new Set<string>();
    const fim = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    for (let y = 0; y <= fim + 40; y += 40) {
      await page.evaluate((destino) => window.scrollTo({ top: destino, behavior: "instant" }), y);
      await page.waitForTimeout(30);
      const atual = await sumario.locator("[aria-current=location]").textContent();
      if (atual) vistos.add(atual.replace(/lida$/, "").trim());
    }
    expect(vistos.size, `fichas marcadas: ${[...vistos].join(" | ")}`).toBe(total);
  });

  test("controles do painel focados pelo Tab não ficam atrás do sumário fixo", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/previsibilidade-e-controle-da-atencao");
    await page.getByRole("button", { name: "Abrir ajustes de leitura" }).click();
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
    await page.locator("#ajustes-de-leitura").getByRole("button", { name: "Fechar" }).focus();
    for (let i = 0; i < 14; i++) {
      const sobreposicao = await page.evaluate(() => {
        const sumario = document.querySelector("[aria-labelledby=\"toc-titulo\"]")!.getBoundingClientRect();
        const foco = document.activeElement!.getBoundingClientRect();
        return sumario.bottom - foco.top;
      });
      expect(sobreposicao, "controle focado encoberto pelo sumário").toBeLessThanOrEqual(0);
      await page.keyboard.press("Tab");
    }
  });
});

test.describe("Sumário “Nessa página”", () => {
  for (const caminho of ["/ajuda", "/praticas/previsibilidade-e-controle-da-atencao"]) {
    for (const reduzir of [true, false]) {
      test(`em ${caminho}, o marcador fica no item clicado (${reduzir ? "sem" : "com"} rolagem suave)`, async ({ page }) => {
        await comAjustes(page, { reduceMotion: reduzir });
        await abrir(page, caminho);
        const sumario = page.getByRole("navigation", { name: "Nessa página" });
        const links = sumario.getByRole("link");
        const total = await links.count();
        for (let i = 0; i < total; i++) {
          const link = links.nth(i);
          const nome = (await link.locator("span").first().textContent())?.trim() ?? "";
          await link.click();
          await page.waitForTimeout(reduzir ? 200 : 1500);
          await expect(sumario.locator("[aria-current=location]"), `depois de clicar em "${nome}"`).toContainText(nome);
        }
      });
    }
  }
});

test.describe("Filtros da página Práticas", () => {
  for (const altura of [900, 650]) {
    test(`ficam fixos ao rolar (tela de ${altura}px de altura)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: altura });
      await comAjustes(page, {});
      await abrir(page, "/praticas");
      const form = page.getByRole("form", { name: "Filtros das práticas" });
      const posicoes: { topo: number; base: number }[] = [];
      for (const y of [1500, 3000, 4500]) {
        await page.evaluate((destino) => window.scrollTo({ top: destino, behavior: "instant" }), y);
        posicoes.push(await form.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { topo: Math.round(r.top), base: Math.round(r.bottom) };
        }));
      }
      expect(new Set(posicoes.map((p) => p.topo)).size, "o formulário se moveu ao rolar").toBe(1);
      for (const { base } of posicoes) expect(base, "o fim do formulário saiu da tela").toBeLessThanOrEqual(altura);
    });

    test(`listas abertas cabem na tela com a página rolada (tela de ${altura}px)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: altura });
      await comAjustes(page, {});
      await abrir(page, "/praticas");
      await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
      for (const id of ["filtro-tarefa", "filtro-desafio", "filtro-estrategia"]) {
        await page.locator(`#${id}`).click();
        const caixa = await page.getByRole("listbox").evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { topo: r.top, base: r.bottom };
        });
        expect(caixa.topo, `lista de ${id} passa do topo`).toBeGreaterThanOrEqual(0);
        expect(caixa.base, `lista de ${id} passa da base`).toBeLessThanOrEqual(altura);
        await page.keyboard.press("Escape");
      }
    });
  }
});

test.describe("Conteúdo do guia", () => {
  test("toda ficha tem “Exemplo no AVA”, desafio e estratégia", () => {
    for (const pratica of PRATICAS) {
      expect(EXEMPLOS[pratica.id], `${pratica.id} sem exemplo`).toBeTruthy();
      expect(pratica.challenges.length, `${pratica.id} sem desafio`).toBeGreaterThan(0);
      expect(pratica.strategies.length, `${pratica.id} sem estratégia`).toBeGreaterThan(0);
    }
  });

  test("“lida” só aparece depois de rolar até o fim da ficha e some ao recarregar", async ({ page }) => {
    await comAjustes(page, {});
    await abrir(page, "/praticas/navegacao-e-orientacao");
    const sumario = page.getByRole("navigation", { name: "Nessa página" });
    const lida = sumario.getByRole("link", { name: /Mostrar onde o estudante está.*lida/ });
    await expect(sumario.getByText("lida")).toHaveCount(0);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await expect(lida).toBeVisible();
    await page.reload();
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(sumario.getByText("lida")).toHaveCount(0);
  });
});
