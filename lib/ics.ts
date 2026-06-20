/**
 * Parser de ICS (iCalendar) enxuto — sem dependências externas.
 *
 * Usado pela rota /api/calendario/[chave] para transformar o feed ".ics"
 * publicado do Outlook em uma lista simples de eventos que o calendário
 * do site consegue desenhar.
 *
 * Cobre o que os calendários do LAB.COM usam:
 *  - VEVENT com SUMMARY, LOCATION, DTSTART, DTEND
 *  - Datas com fuso (TZID=E. South America Standard Time → Brasília, UTC-3)
 *  - Datas em UTC (sufixo "Z")
 *  - Eventos de dia inteiro (VALUE=DATE)
 *  - "Linhas dobradas" (continuação iniciada por espaço)
 *
 * Observação: os eventos das reservas não são recorrentes, então não é
 * necessário expandir RRULE (as únicas RRULE do arquivo estão no VTIMEZONE,
 * que é ignorado por lermos apenas blocos VEVENT).
 */

export type IcsEvent = {
  title: string;
  location: string;
  /** Descrição completa do evento (pode ter várias linhas) */
  description: string;
  /** ISO 8601 com fuso (ex.: "2026-03-17T14:00:00-03:00") */
  start: string;
  /** ISO 8601 com fuso */
  end: string;
  allDay: boolean;
};

/** Desfaz "line folding": linhas seguintes que começam com espaço/tab. */
function unfold(raw: string): string[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

/** Remove escapes do texto ICS (\\, \, \; \n) — quebras viram espaço. */
function unescapeText(v: string): string {
  return v
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

/**
 * SEGURANÇA: remove o bloco de reunião do Microsoft Teams da descrição
 * (link de ingresso, ID da reunião e SENHA). Esses dados nunca devem
 * aparecer publicamente no site.
 *
 * O Outlook anexa esse bloco ao final da descrição, normalmente após uma
 * linha de sublinhados ("____") e/ou o título "Reunião do Microsoft Teams".
 * Cortamos a descrição no primeiro desses marcadores.
 */
function stripMeetingBlock(text: string): string {
  const markers = [
    /_{5,}/,                          // linha de sublinhados que delimita o bloco
    /-{10,}/,                         // alguns clientes usam hifens
    /Reuni[aã]o do Microsoft Teams/i,
    /Microsoft Teams meeting/i,
    /teams\.microsoft\.com/i,
    /aka\.ms\/JoinTeamsMeeting/i,
    /Ingressar pelo computador/i,
    /Ingressar na reuni[aã]o/i,
    /Join the meeting now/i,
    /ID da reuni[aã]o/i,              // se vier sem cabeçalho, corta aqui
    /Meeting ID/i,
  ];
  let cut = text.length;
  for (const re of markers) {
    const m = text.match(re);
    if (m && m.index !== undefined && m.index < cut) cut = m.index;
  }
  let out = text.slice(0, cut);

  // Rede de segurança: remove qualquer linha sensível que tenha sobrado
  // (links de reunião, IDs, senhas), agora ou em eventos futuros.
  out = out
    .split("\n")
    .filter(
      (l) =>
        !/(teams\.microsoft\.com|aka\.ms|ID da reuni|Meeting ID|C[oó]digo secreto|Senha\s*:|Passcode|Ingressar|Op[cç][õo]es de reuni|Saiba mais sobre|Baixar o Teams)/i.test(l)
    )
    .join("\n");

  return out;
}

/**
 * Limpa a DESCRIPTION para exibição:
 *  - mantém as quebras de linha reais (\n)
 *  - REMOVE o bloco de reunião do Teams (segurança)
 *  - remove a marcação "<mailto:...>" que o Outlook insere após menções
 *  - colapsa 3+ linhas em branco em no máximo 2
 */
function cleanDescription(v: string): string {
  let s = v
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
  s = stripMeetingBlock(s);
  s = s.replace(/<mailto:[^>]*>/gi, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Converte um valor de data ICS em ISO 8601.
 * - "YYYYMMDDTHHMMSSZ"  → UTC
 * - "YYYYMMDDTHHMMSS" + TZID Brasília → offset -03:00 (Brasil não usa horário
 *   de verão desde 2019)
 * - "YYYYMMDD" (dia inteiro) → meia-noite em -03:00
 */
function toISO(value: string, hasTzid: boolean): { iso: string; allDay: boolean } {
  const v = value.trim();

  // Dia inteiro (VALUE=DATE): YYYYMMDD
  if (/^\d{8}$/.test(v)) {
    const y = v.slice(0, 4);
    const mo = v.slice(4, 6);
    const d = v.slice(6, 8);
    return { iso: `${y}-${mo}-${d}T00:00:00-03:00`, allDay: true };
  }

  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) {
    // Formato inesperado — devolve agora para não quebrar a renderização.
    return { iso: new Date().toISOString(), allDay: false };
  }
  const [, y, mo, d, h, mi, s, z] = m;
  const offset = z === "Z" ? "Z" : "-03:00"; // Z = UTC; senão Brasília
  return { iso: `${y}-${mo}-${d}T${h}:${mi}:${s}${offset}`, allDay: false };
}

/** Lê uma propriedade tipo "DTSTART;TZID=...:VALOR" → { params, value }. */
function splitProp(line: string): { name: string; params: string; value: string } {
  const colon = line.indexOf(":");
  if (colon === -1) return { name: line, params: "", value: "" };
  const left = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const semi = left.indexOf(";");
  if (semi === -1) return { name: left, params: "", value };
  return { name: left.slice(0, semi), params: left.slice(semi + 1), value };
}

/** Faz o parse de um texto ICS completo em uma lista de eventos. */
export function parseIcs(text: string): IcsEvent[] {
  const lines = unfold(text);
  const events: IcsEvent[] = [];

  let inEvent = false;
  let cur: Partial<IcsEvent> & { _startAllDay?: boolean } = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur.title && cur.start && cur.end) {
        events.push({
          title: cur.title,
          location: cur.location || "",
          description: cur.description || "",
          start: cur.start,
          end: cur.end,
          allDay: !!cur._startAllDay,
        });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    const { name, params, value } = splitProp(line);
    const hasTzid = /TZID=/i.test(params);

    if (name === "SUMMARY") cur.title = unescapeText(value);
    else if (name === "LOCATION") cur.location = unescapeText(value);
    else if (name === "DESCRIPTION") cur.description = cleanDescription(value);
    else if (name === "DTSTART") {
      const { iso, allDay } = toISO(value, hasTzid);
      cur.start = iso;
      cur._startAllDay = allDay || /VALUE=DATE/i.test(params);
    } else if (name === "DTEND") {
      const { iso } = toISO(value, hasTzid);
      cur.end = iso;
    }
  }

  // Ordena por início
  events.sort((a, b) => a.start.localeCompare(b.start));
  return events;
}
