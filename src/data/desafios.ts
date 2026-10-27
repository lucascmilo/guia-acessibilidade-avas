import type { Categoria } from "./tipos";

export const DESAFIOS: Categoria[] = [
  {
    code: "D1",
    label: "Desorientação no AVA",
    description:
      "Desorientação navegacional (não saber onde está no sistema), contextual (não compreender o propósito das atividades) e procedimental (não saber o que fazer a seguir).",
  },
  {
    code: "D2",
    label: "Sobrecarga sensorial e cognitiva",
    description:
      "Excesso de estímulos visuais, notificações simultâneas e layout não estruturado; transcrições com erros e conteúdo mal formatado amplificam a carga.",
  },
  {
    code: "D3",
    label: "Quebra de rotinas e imprevisibilidade",
    description:
      "Mudanças inesperadas de formato, prazo e plataforma são relatadas como gatilhos de estresse, sobretudo por estudantes com TEA.",
  },
  {
    code: "D4",
    label: "Dificuldades de autorregulação e autogestão",
    description:
      "Dificuldades de automonitoramento, autoavaliação e autorreflexão, agravadas pela maior autonomia exigida no ambiente on-line.",
  },
  {
    code: "D5",
    label: "Isolamento social e ausência de vínculo",
    description:
      "Menos interações espontâneas e menor senso de pertencimento; dificuldade de interpretar a comunicação mediada por texto.",
  },
  {
    code: "D6",
    label: "Menor autoeficácia acadêmica na EAD",
    description: "Queda da autoeficácia acadêmica na aprendizagem remota, com impacto direto no engajamento.",
  },
  {
    code: "D7",
    label: "Barreiras de acessibilidade em plataformas",
    description:
      "Falta de legendas precisas, navegação complexa, incompatibilidade com tecnologias assistivas e design não responsivo.",
  },
  {
    code: "D8",
    label: "Viés em sistemas de predição de desempenho",
    description:
      "Modelos de learning analytics subestimam estudantes com TDAH por usarem padrões de comportamento de estudantes neurotípicos.",
  },
  {
    code: "D9",
    label: "Ansiedade social e saúde mental deteriorada",
    description:
      "Aumento de ansiedade e depressão na transição para a EAD; sintomas de TDAH pioram a experiência on-line, mediados pela ansiedade social.",
  },
  {
    code: "D10",
    label: "Dificuldade de atenção sustentada em vídeo",
    description:
      "Dificuldade de manter a atenção em vídeos sem controle de velocidade, marcadores ou resumos.",
  },
];
