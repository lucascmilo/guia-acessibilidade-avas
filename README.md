# Guia de Acessibilidade para AVAs — interface em Next.js

Recriação das telas do protótipo do Figma (Início, Práticas, Página de prática, Glossário, Fontes, Sobre e Ajuda) com Next.js (App Router), TypeScript e CSS Modules.

## Como rodar

Requisito: Node.js 20.9 ou mais recente (`node -v` para conferir).

```bash
npm install
npm run dev
```

Abra http://localhost:3000 no navegador.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Página inicial |
| `/praticas` | Práticas (filtros + resultados) |
| `/praticas/previsibilidade-e-controle-da-atencao` | Detalhe das práticas (com o painel Ajustes de leitura funcionando) |
| `/glossario` | Glossário |
| `/fontes` | Fontes |
| `/sobre` | Sobre a pesquisa |
| `/ajuda` | Ajuda |

## Onde mudar o conteúdo

Os textos repetitivos ficam em `src/data/`: desafios, práticas, glossário e fontes. Os códigos D20/E20 são os marcadores do design; troque pelos códigos reais quando o guia estiver pronto.
