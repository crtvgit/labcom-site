/* ════════════════════════════════════════════════════════════════════════
 *  ⚙️  CONFIGURAÇÃO DO SITE — LAB.COM
 * ════════════════════════════════════════════════════════════════════════
 *
 *  👉 ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA MEXER para alterar os
 *     TEXTOS, LINKS, CONTATOS e o AVISO de reservas do site.
 *
 *  Regras simples para editar sem quebrar nada:
 *
 *    1. Só altere o texto que está ENTRE ASPAS  ("assim").
 *    2. NÃO apague as vírgulas, aspas, chaves { } ou colchetes [ ].
 *    3. true  = ligado / sim   |   false = desligado / não
 *       (escreva sempre em minúsculo e SEM aspas)
 *    4. Depois de salvar, o site atualiza sozinho.
 *
 *  Exemplo:  título: "Olá"   →   título: "Bem-vindo"   ✅
 *
 * ════════════════════════════════════════════════════════════════════════ */

export const siteConfig = {
  /* ──────────────────────────────────────────────────────────────────────
   *  🔴  AVISO DE RESERVAS BLOQUEADAS  (a tarja vermelha no topo do site)
   * ──────────────────────────────────────────────────────────────────────
   *
   *  Para LIGAR o aviso vermelho:  ativo: true
   *  Para DESLIGAR o aviso:        ativo: false
   *
   *  Quando o aviso está LIGADO, o botão do formulário de reserva também
   *  fica bloqueado automaticamente — você não precisa mexer em mais nada.
   */
  avisoReservas: {
    ativo: true, // <-- mude para false quando as reservas voltarem

    // Texto curto e forte (aparece em DESTAQUE na tarja):
    titulo: "RESERVAS BLOQUEADAS",

    // Explicação (aparece logo ao lado / abaixo do título):
    mensagem:
      "No momento, as reservas estão bloqueadas até o próximo semestre.",
  },

  /* ──────────────────────────────────────────────────────────────────────
   *  ✨  SEÇÃO DE DESTAQUE  (logo abaixo do cabeçalho — substitui o vídeo)
   * ──────────────────────────────────────────────────────────────────────
   */
  destaque: {
    etiqueta: "bem-vindo ao lab.com",

    // A frase grande de destaque. As palavras entre os campos abaixo
    // recebem a cor azul — útil para destacar o que importa.
    fraseInicio: "Equipamentos e estúdios profissionais para você",
    frasePalavraAzul: "criar, gravar e produzir",
    fraseFim: "durante toda a graduação.",

    // Os três atalhos rápidos (cartões clicáveis):
    atalhos: [
      {
        titulo: "Faça sua reserva",
        descricao: "Reserve um espaço ou equipamento pelo formulário",
        href: "/#reserva",
      },
      {
        titulo: "Conheça os espaços",
        descricao: "Estúdios de rádio, TV, fotografia e edição",
        href: "/#espacos",
      },
      {
        titulo: "Veja o calendário",
        descricao: "Consulte a disponibilidade dos espaços",
        href: "/#calendario",
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────────
   *  🔗  LINKS PRINCIPAIS  (documentos)
   * ──────────────────────────────────────────────────────────────────────
   */
  links: {
    // Link do documento "Regras Vigentes":
    regrasVigentes:
      "https://ubecedu.sharepoint.com/:b:/s/Klabs2/IQBfHHLa250JSJVns4hVXKl7Acq7FjYIcHjn8TOl3fGep6U?e=w2OPt0",
  },

  /* ──────────────────────────────────────────────────────────────────────
   *  📝  FORMULÁRIOS DE RESERVA  (seção "preencha o formulário")
   * ──────────────────────────────────────────────────────────────────────
   *
   *  Existem DOIS tipos de reserva, cada um com seu próprio formulário:
   *
   *   1) SALAS DE AULA (ex.: Sala K212 e outras salas)
   *      → Continua DISPONÍVEL mesmo quando o aviso de bloqueio está LIGADO.
   *
   *   2) EQUIPAMENTOS E LABORATÓRIOS
   *      → Fica BLOQUEADA automaticamente quando o aviso de reservas
   *        (avisoReservas.ativo) está LIGADO.
   */
  reservas: {
    salas: {
      titulo: "Salas de aula",
      descricao:
        "Reserve salas de aula, como a Sala K212 e outras salas. Disponível normalmente.",
      formulario: "https://forms.office.com/r/f5XwYnwRy0",
    },
    equipamentos: {
      titulo: "Equipamentos e laboratórios",
      descricao:
        "Reserve equipamentos e laboratórios do LAB.COM pelo formulário.",
      formulario: "https://forms.cloud.microsoft/r/iAjrCMt6KQ",
    },
  },

  /* ──────────────────────────────────────────────────────────────────────
   *  📞  CONTATOS  (aparecem na seção "contatos")
   * ──────────────────────────────────────────────────────────────────────
   */
  contato: {
    email: "crtv@ucb.br",
    telefone: "3356-9226",

    // Horários de atendimento (pode adicionar ou remover linhas):
    horarios: [
      { dias: "seg. – ter.", horario: "08:30 – 17:30" },
      { dias: "sexta-feira", horario: "08:30 – 16:30" },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────────
   *  📊  NÚMEROS  (os 4 contadores da seção "sobre")
   * ──────────────────────────────────────────────────────────────────────
   *  valor: aceita números com "+" no final (ex.: "200+")
   */
  numeros: [
    { valor: "7+", descricao: "espaços disponíveis" },
    { valor: "200+", descricao: "reservas por semestre" },
    { valor: "6+", descricao: "cursos atendidos" },
    { valor: "4+", descricao: "estúdios de gravação" },
  ],

  /* ──────────────────────────────────────────────────────────────────────
   *  🏫  ESPAÇOS  (os cartões da seção "nossos espaços")
   * ──────────────────────────────────────────────────────────────────────
   *  Para trocar a foto, coloque a imagem na pasta  public/espacos/
   *  e escreva o caminho em "imagem" (ex.: "/espacos/radio.jpg").
   */
  espacos: [
    {
      nome: "Estúdio de Fotografia",
      descricao:
        "Espaço equipado com iluminação profissional, cicloramas e câmeras DSLR",
      capacidade: "25",
      imagem: "/espacos/fotografia.jpg",
    },
    {
      nome: "Estúdio de Rádio",
      descricao:
        "Espaço perfeito para gravações de podcast e mesacasts, contando com microfones profissionais, mesa de áudio e televisões.",
      capacidade: "10",
      imagem: "/espacos/radio.jpg",
    },
    {
      nome: "CRTV",
      descricao:
        "Espaço equipado com ilhas de edição, dois estúdios com chroma key, câmeras e teleprompter",
      capacidade: "35",
      imagem: "/espacos/crtv.jpg",
    },
    {
      nome: "Laboratório de Com.",
      descricao:
        "Espaço equipado com computadores de informática preparados e com equipamentos para edição de foto e de vídeo.",
      capacidade: "40",
      imagem: "/espacos/lab_com.jpg",
    },
  ],

  /* ──────────────────────────────────────────────────────────────────────
   *  📄  DOCUMENTOS & RECURSOS  (cartões da seção de documentos)
   * ──────────────────────────────────────────────────────────────────────
   *  tipo: use "pdf" para mostrar o ícone de PDF, ou "lista" para o ícone
   *  de lista/planilha.
   */
  documentos: [
    {
      titulo: "Catálogo de Equipamentos",
      descricao:
        "Lista completa dos equipamentos disponíveis para reserva no LAB.COM",
      href: "https://ubecedu.sharepoint.com/:l:/s/Klabs2/JAAOJ-dLd2KBRotuVNM0OyLsAdf4mzK6f3JoMac7wJS_fGI?e=v3b0Ns",
      tipo: "lista",
    },
    {
      titulo: "Kits de Equipamentos",
      descricao: "Conjuntos de equipamentos organizados por tipo de produção",
      href: "https://ubecedu.sharepoint.com/:l:/s/Klabs2/JABb3_5cQw-RTroMk6XURzHoAYDyVhc5eKFqPtqq88OsycY?e=K9hg4X",
      tipo: "lista",
    },
    {
      titulo: "Regras Vigentes",
      descricao:
        "Normas regulamentares para uso dos espaços e equipamentos do LAB.COM",
      href: "https://ubecedu.sharepoint.com/:b:/s/Klabs2/IQBfHHLa250JSJVns4hVXKl7Acq7FjYIcHjn8TOl3fGep6U?e=w2OPt0",
      tipo: "pdf",
    },
  ],

  /* ──────────────────────────────────────────────────────────────────────
   *  📅  CALENDÁRIOS  (seção "calendário de reservas")
   * ──────────────────────────────────────────────────────────────────────
   *
   *  O calendário é exibido DENTRO do site (sem abrir aba). Para isso usamos
   *  o link de PUBLICAÇÃO que termina em "calendar.ics".
   *
   *  Como obter o link ".ics":
   *    Outlook → Calendário → botão direito no calendário → "Compartilhar e
   *    permissões" → "Publicar calendário" → copie o link **ICS**
   *    (termina em "calendar.ics").
   *
   *  Campos:
   *    chave     → identificador curto, sem espaços (usado internamente)
   *    nome      → nome exibido na aba
   *    descricao → texto curto de apoio
   *    ics       → link de publicação que termina em "calendar.ics"
   */
  calendarios: [
    {
      chave: "crtv",
      nome: "CRTV",
      descricao:
        "Estúdio de TV com chroma key, ilhas de edição e teleprompter.",
      ics: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/c0b7f0e5d28f4128bcec9f53b09845d38669094876541354230/calendar.ics",
    },
    {
      chave: "radio",
      nome: "Rádio",
      descricao:
        "Estúdio de rádio e podcast com microfones e mesa de áudio.",
      ics: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/3eb6c8664aad41338cfcf874e11a56ef2062506675193543890/calendar.ics",
    },
    {
      chave: "nfoto",
      nome: "N.FOTO",
      descricao:
        "Núcleo de fotografia com cicloramas e iluminação profissional.",
      ics: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/284732e24f574089b47433db68a2cb0710490216399718100738/calendar.ics",
    },
  ],
} as const;

/* Atalho de tipo — usado internamente pelos componentes. Não precisa mexer. */
export type SiteConfig = typeof siteConfig;
