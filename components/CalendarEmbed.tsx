"use client";

/**
 * CalendarEmbed — calendário de reservas exibido DENTRO do site (inline).
 *
 *  - Abas para escolher o calendário (CRTV / Rádio / N.FOTO), cada uma com sua
 *    cor; trocar de calendário/mês faz uma transição em "swipe".
 *  - Eventos vêm de /api/calendario/[chave], lido do Outlook NO SERVIDOR e
 *    SEMPRE AO VIVO (sem cache). Reatualiza ao focar a aba e por botão.
 *  - Eventos de VÁRIOS DIAS aparecem como BARRAS CONTÍNUAS que "vazam" de um
 *    dia para o outro até terminarem, sempre no topo de cada dia.
 *  - "AGENDA BLOQUEADA" aparece em vermelho, bem visível.
 *  - Mostra horário, local e descrição (sem o bloco de reunião do Teams).
 *
 * Calendários editáveis em: lib/siteConfig.ts → calendarios
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";
import type { IcsEvent } from "@/lib/ics";

const CALENDARS = siteConfig.calendarios;
const TZ = "America/Sao_Paulo";
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const PALETTE = ["#2f6fd1", "#0f766e", "#b45309", "#7c3aed", "#be185d"];
const MAX_LANES = 3; // faixas de evento visíveis por dia (o resto vira "+N")

const pad = (n: number) => String(n).padStart(2, "0");

function brasilia(iso: string) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { ymd: `${p.year}-${p.month}-${p.day}`, hm: `${p.hour}:${p.minute}` };
}

function todayYmd(): string {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

function addDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + delta * 86400000;
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Primeiro e último dia (yyyy-mm-dd) que o evento ocupa. */
function eventRange(ev: IcsEvent): { first: string; last: string } {
  const first = brasilia(ev.start).ymd;
  const end = brasilia(ev.end);
  let last = end.ymd;
  if (ev.allDay || end.hm === "00:00") last = addDays(end.ymd, -1); // DTEND exclusivo
  if (last < first) last = first;
  return { first, last };
}

function isMultiDay(ev: IcsEvent): boolean {
  const { first, last } = eventRange(ev);
  return first !== last;
}
function isSpanning(ev: IcsEvent): boolean {
  return ev.allDay || isMultiDay(ev);
}
function isBlocked(ev: IcsEvent): boolean {
  return /bloquead/i.test(ev.title);
}

function monthLabel(year: number, month: number): string {
  const d = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}
function longDayLabel(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(date);
}
function timeLabel(ev: IcsEvent): string {
  const s = brasilia(ev.start), e = brasilia(ev.end);
  if (s.ymd === e.ymd) {
    if (ev.allDay) return "Dia todo";
    return s.hm === e.hm ? s.hm : `${s.hm}–${e.hm}`;
  }
  const endYmd = ev.allDay ? addDays(e.ymd, -1) : e.ymd;
  const fmt = (ymd: string, hm: string) => `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}${ev.allDay ? "" : ` ${hm}`}`;
  return `${fmt(s.ymd, s.hm)} → ${fmt(endYmd, e.hm)}`;
}

type Seg = {
  ev: IcsEvent;
  startCol: number;
  endCol: number;
  contLeft: boolean;
  contRight: boolean;
  lane: number;
};

/** Calcula as barras (segmentos) de uma semana e suas faixas (lanes). */
function layoutWeek(weekDays: (string | null)[], events: IcsEvent[]) {
  const segs: Seg[] = [];
  for (const ev of events) {
    const { first, last } = eventRange(ev);
    const cols: number[] = [];
    for (let p = 0; p < 7; p++) {
      const d = weekDays[p];
      if (d && d >= first && d <= last) cols.push(p);
    }
    if (cols.length === 0) continue;
    const startCol = cols[0], endCol = cols[cols.length - 1];
    segs.push({
      ev, startCol, endCol,
      contLeft: first < (weekDays[startCol] as string),
      contRight: last > (weekDays[endCol] as string),
      lane: 0,
    });
  }

  // Ordena: eventos que se estendem (vários dias / dia todo / bloqueio) primeiro
  // (ficam nas faixas de cima), depois por coluna e horário.
  segs.sort((a, b) => {
    const sa = isSpanning(a.ev) ? 0 : 1;
    const sb = isSpanning(b.ev) ? 0 : 1;
    if (sa !== sb) return sa - sb;
    if (a.startCol !== b.startCol) return a.startCol - b.startCol;
    return a.ev.start.localeCompare(b.ev.start);
  });

  // Atribui faixas (greedy): primeira faixa livre sem sobreposição de colunas.
  const lanes: Seg[][] = [];
  for (const seg of segs) {
    let placed = false;
    for (let L = 0; L < lanes.length; L++) {
      if (!lanes[L].some((s) => !(seg.endCol < s.startCol || seg.startCol > s.endCol))) {
        lanes[L].push(seg); seg.lane = L; placed = true; break;
      }
    }
    if (!placed) { seg.lane = lanes.length; lanes.push([seg]); }
  }

  // Conta o excedente por coluna (faixas além do limite viram "+N").
  const overflow = new Array(7).fill(0);
  for (const seg of segs) {
    if (seg.lane >= MAX_LANES) {
      for (let c = seg.startCol; c <= seg.endCol; c++) overflow[c]++;
    }
  }

  return { visible: segs.filter((s) => s.lane < MAX_LANES), overflow };
}

export default function CalendarEmbed() {
  const reduce = useReducedMotion();

  const [activeKey, setActiveKey] = useState<string>(CALENDARS[0].chave);
  const [dir, setDir] = useState(1); // direção do swipe: 1 = →, -1 = ←
  const [events, setEvents] = useState<IcsEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const initialToday = todayYmd();
  const [view, setView] = useState(() => {
    const [y, m] = initialToday.split("-").map(Number);
    return { year: y, month: m };
  });
  const [selectedDay, setSelectedDay] = useState<string>(initialToday);

  const idx = Math.max(0, CALENDARS.findIndex((c) => c.chave === activeKey));
  const accent = PALETTE[idx % PALETTE.length];
  const activeCal = CALENDARS[idx];
  const latestKey = useRef(activeKey);

  const load = useCallback((key: string, silent = false) => {
    if (silent) setRefreshing(true);
    else { setStatus("loading"); setEvents([]); }
    fetch(`/api/calendario/${key}?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { events: IcsEvent[] }) => {
        if (key !== latestKey.current) return;
        setEvents(data.events || []); setStatus("ok"); setUpdatedAt(new Date());
      })
      .catch(() => { if (key === latestKey.current && !silent) setStatus("error"); })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => { latestKey.current = activeKey; load(activeKey); }, [activeKey, load]);
  useEffect(() => {
    const onFocus = () => load(latestKey.current, true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  /* Troca de calendário com direção de swipe baseada na ordem das abas. */
  const switchCalendar = (key: string) => {
    const newIdx = CALENDARS.findIndex((c) => c.chave === key);
    setDir(newIdx >= idx ? 1 : -1);
    setActiveKey(key);
  };
  const goMonth = (delta: number) => {
    setDir(delta);
    setView((v) => {
      const i = v.month - 1 + delta;
      return { year: v.year + Math.floor(i / 12), month: ((i % 12) + 12) % 12 + 1 };
    });
  };

  /* Monta as semanas do mês. */
  const firstWeekday = new Date(Date.UTC(view.year, view.month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${view.year}-${pad(view.month)}-${pad(d)}`);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const today = todayYmd();

  /* Eventos do dia selecionado (inclui multi-dia que passam por ele). */
  const selectedEvents = events
    .filter((ev) => { const { first, last } = eventRange(ev); return selectedDay >= first && selectedDay <= last; })
    .sort((a, b) => (isSpanning(b) ? 1 : 0) - (isSpanning(a) ? 1 : 0) || a.start.localeCompare(b.start));

  const swipe = reduce
    ? { initial: false as const, animate: {}, exit: {} }
    : {
        initial: { x: dir > 0 ? "55%" : "-55%", opacity: 0 },
        animate: { x: "0%", opacity: 1 },
        exit: { x: dir > 0 ? "-55%" : "55%", opacity: 0 },
      };

  const hover = reduce ? {} : { scale: 1.12 };
  const tap = reduce ? {} : { scale: 0.92 };

  return (
    <div className="cal2" style={{ ["--cal-accent" as string]: accent }}>
      {/* ── Abas ── */}
      <div role="tablist" aria-label="Selecione o calendário" className="cal2-tabs">
        {CALENDARS.map((cal) => (
          <button key={cal.chave} role="tab" aria-selected={activeKey === cal.chave} className="cal2-tab" onClick={() => switchCalendar(cal.chave)}>
            {cal.nome}
          </button>
        ))}
      </div>

      {/* ── Barra compacta ── */}
      <div className="cal2-bar">
        <div className="cal2-bar-left">
          <motion.button className="cal2-navbtn" whileHover={hover} whileTap={tap} onClick={() => goMonth(-1)} aria-label="Mês anterior">‹</motion.button>
          <span className="cal2-monthlabel" aria-live="polite">{monthLabel(view.year, view.month)}</span>
          <motion.button className="cal2-navbtn" whileHover={hover} whileTap={tap} onClick={() => goMonth(1)} aria-label="Próximo mês">›</motion.button>
        </div>
        <div className="cal2-bar-right">
          <span className="cal2-meta-status">
            {refreshing ? "Atualizando…" : updatedAt ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })}` : ""}
          </span>
          <motion.button className="cal2-refresh" whileHover={reduce ? {} : { scale: 1.04 }} whileTap={reduce ? {} : { scale: 0.96 }} onClick={() => load(activeKey, true)} aria-label="Atualizar calendário agora">
            <span className={"cal2-refresh-icon" + (refreshing ? " cal2-spin" : "")} aria-hidden>⟳</span>
            Atualizar
          </motion.button>
        </div>
      </div>

      {status === "loading" && <div className="cal2-state" role="status">Carregando reservas…</div>}
      {status === "error" && (
        <div className="cal2-state cal2-state-error" role="alert">
          Não foi possível carregar o calendário agora.{" "}
          <button className="cal2-refresh" onClick={() => load(activeKey)}>Tentar de novo</button>
        </div>
      )}

      {status === "ok" && (
        <>
          {/* Cabeçalho dos dias da semana */}
          <div className="cal2-weekdays" aria-hidden>
            {WEEKDAYS.map((w) => <div key={w} className="cal2-weekday">{w}</div>)}
          </div>

          {/* Grade (com swipe ao trocar calendário/mês) */}
          <div className="cal2-viewport">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={`${activeKey}-${view.year}-${view.month}`}
                className="cal2-weeks"
                initial={swipe.initial}
                animate={swipe.animate}
                exit={swipe.exit}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {weeks.map((weekDays, wi) => {
                  const { visible, overflow } = layoutWeek(weekDays, events);
                  return (
                    <div className="cal2-week" key={wi}>
                      {/* Fundo clicável: 1 coluna por dia, altura cheia da semana */}
                      {weekDays.map((ymd, p) =>
                        ymd ? (
                          <button
                            key={`bg${p}`}
                            className={"cal2-daycol" + (ymd === today ? " cal2-today" : "") + (events.some(ev => { const r = eventRange(ev); return ymd >= r.first && ymd <= r.last; }) ? " cal2-has" : "")}
                            style={{ gridColumn: p + 1, gridRow: "1 / -1" }}
                            aria-pressed={ymd === selectedDay}
                            aria-label={longDayLabel(ymd)}
                            onClick={() => setSelectedDay(ymd)}
                          >
                            {ymd === selectedDay && (
                              <motion.span
                                className="cal2-sel-ring" aria-hidden
                                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 520, damping: 30 }}
                              />
                            )}
                          </button>
                        ) : (
                          <div key={`bg${p}`} className="cal2-daycol cal2-daycol-empty" style={{ gridColumn: p + 1, gridRow: "1 / -1" }} aria-hidden />
                        )
                      )}

                      {/* Números dos dias (linha 1) */}
                      {weekDays.map((ymd, p) =>
                        ymd ? (
                          <span key={`n${p}`} className="cal2-daynum-wrap" style={{ gridColumn: p + 1, gridRow: 1 }} aria-hidden>
                            <span className="cal2-daynum">{Number(ymd.slice(8, 10))}</span>
                          </span>
                        ) : null
                      )}

                      {/* Barras de evento */}
                      {visible.map((seg, si) => {
                        const blocked = isBlocked(seg.ev);
                        const showTime = !seg.contLeft && !seg.ev.allDay && !isMultiDay(seg.ev);
                        return (
                          <div
                            key={`s${si}`}
                            aria-hidden
                            className={
                              "cal2-evbar" +
                              (blocked ? " cal2-evbar-blocked" : "") +
                              (seg.contLeft ? " cal2-evbar-contl" : "") +
                              (seg.contRight ? " cal2-evbar-contr" : "") +
                              (isSpanning(seg.ev) ? " cal2-evbar-span" : "")
                            }
                            style={{ gridColumn: `${seg.startCol + 1} / ${seg.endCol + 2}`, gridRow: seg.lane + 2 }}
                            title={seg.ev.title}
                          >
                            <span className="cal2-evbar-label">
                              {seg.contLeft && <span className="cal2-evbar-arrow">‹ </span>}
                              {showTime && <b>{brasilia(seg.ev.start).hm} </b>}
                              {seg.ev.title}
                              {seg.contRight && <span className="cal2-evbar-arrow"> ›</span>}
                            </span>
                          </div>
                        );
                      })}

                      {/* Excedente "+N" por coluna */}
                      {overflow.map((n, p) =>
                        n > 0 ? (
                          <span key={`o${p}`} className="cal2-more" style={{ gridColumn: p + 1, gridRow: MAX_LANES + 2 }} aria-hidden>
                            +{n}
                          </span>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ── Reservas do dia selecionado ── */}
      {status === "ok" && (
        <div className="cal2-day">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              aria-live="polite"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="cal2-day-title">{longDayLabel(selectedDay)}</h3>
              {selectedEvents.length === 0 ? (
                <p className="cal2-day-empty">Nenhuma reserva neste dia.</p>
              ) : (
                <ul className="cal2-day-list" role="list">
                  {selectedEvents.map((ev, i) => (
                    <li key={i} className={"cal2-event" + (isBlocked(ev) ? " cal2-event-blocked" : "")}>
                      <div className="cal2-event-head">
                        <span className="cal2-event-time">{timeLabel(ev)}</span>
                        {isBlocked(ev) ? (
                          <span className="cal2-event-tag cal2-event-tag-blocked">bloqueado</span>
                        ) : isMultiDay(ev) ? (
                          <span className="cal2-event-tag">vários dias</span>
                        ) : null}
                        <span className="cal2-event-title">{ev.title}</span>
                      </div>
                      {ev.location && (
                        <p className="cal2-event-loc">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
                            <path d="M8 1.5c-2.8 0-5 2.2-5 5 0 3.4 5 8 5 8s5-4.6 5-8c0-2.8-2.2-5-5-5Z" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="8" cy="6.5" r="1.7" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                          {ev.location}
                        </p>
                      )}
                      {ev.description && <p className="cal2-event-desc">{ev.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
