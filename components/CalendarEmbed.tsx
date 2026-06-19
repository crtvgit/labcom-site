"use client";

/**
 * CalendarEmbed — calendário de reservas exibido DENTRO do site (inline).
 *
 *  - Abas para escolher o calendário (CRTV / Rádio / N.FOTO), cada uma com
 *    sua própria cor e animação de entrada.
 *  - Eventos vêm da rota /api/calendario/[chave], que lê o feed ".ics" do
 *    Outlook NO SERVIDOR e SEMPRE AO VIVO (sem cache). Reatualiza ao voltar
 *    o foco para a aba e por um botão "Atualizar".
 *  - Eventos de VÁRIOS DIAS aparecem em todos os dias que ocupam.
 *  - Mostra horário, local e descrição (a descrição já vem sem o bloco de
 *    reunião do Teams, por segurança — ver lib/ics.ts).
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
const ANIMS = ["slide", "scale", "rise", "fade"] as const;

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

/** Soma (ou subtrai) dias a um "yyyy-mm-dd" usando aritmética em UTC. */
function addDays(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + delta * 86400000;
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Lista de dias (yyyy-mm-dd) que um evento ocupa, do início ao fim. */
function eventDays(ev: IcsEvent): string[] {
  const startYmd = brasilia(ev.start).ymd;
  const end = brasilia(ev.end);
  // DTEND é exclusivo para eventos de dia inteiro; idem quando termina à meia-noite.
  let lastYmd = end.ymd;
  if (ev.allDay || end.hm === "00:00") lastYmd = addDays(end.ymd, -1);
  if (lastYmd < startYmd) lastYmd = startYmd;

  const days: string[] = [];
  let cur = startYmd;
  for (let i = 0; i < 400 && cur <= lastYmd; i++) {
    days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

function isMultiDay(ev: IcsEvent): boolean {
  return eventDays(ev).length > 1;
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

/** Rótulo de horário do evento (trata mesmo dia e vários dias). */
function timeLabel(ev: IcsEvent): string {
  const s = brasilia(ev.start);
  const e = brasilia(ev.end);
  if (s.ymd === e.ymd) {
    if (ev.allDay) return "Dia todo";
    return s.hm === e.hm ? s.hm : `${s.hm}–${e.hm}`;
  }
  // Vários dias: "08/06 08:00 → 12/06 09:00" (ou só datas, se dia inteiro)
  const endYmd = ev.allDay ? addDays(e.ymd, -1) : e.ymd;
  const fmt = (ymd: string, hm: string) =>
    `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}${ev.allDay ? "" : ` ${hm}`}`;
  return `${fmt(s.ymd, s.hm)} → ${fmt(endYmd, e.hm)}`;
}

function variantFor(kind: (typeof ANIMS)[number], reduce: boolean | null) {
  if (reduce) return { initial: false as const, animate: {}, exit: {} };
  switch (kind) {
    case "slide": return { initial: { opacity: 0, x: 36 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };
    case "scale": return { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.03 } };
    case "rise":  return { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -18 } };
    default:      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  }
}

export default function CalendarEmbed() {
  const reduce = useReducedMotion();

  const [activeKey, setActiveKey] = useState<string>(CALENDARS[0].chave);
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
  const animKind = ANIMS[idx % ANIMS.length];
  const activeCal = CALENDARS[idx];

  const latestKey = useRef(activeKey);

  const load = useCallback((key: string, silent = false) => {
    if (silent) setRefreshing(true);
    else { setStatus("loading"); setEvents([]); }
    fetch(`/api/calendario/${key}?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { events: IcsEvent[] }) => {
        if (key !== latestKey.current) return;
        setEvents(data.events || []);
        setStatus("ok");
        setUpdatedAt(new Date());
      })
      .catch(() => { if (key === latestKey.current && !silent) setStatus("error"); })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    latestKey.current = activeKey;
    load(activeKey);
  }, [activeKey, load]);

  useEffect(() => {
    const onFocus = () => load(latestKey.current, true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  /* Agrupa eventos por dia — cada evento entra em TODOS os dias que ocupa. */
  const byDay: Record<string, IcsEvent[]> = {};
  for (const ev of events) {
    for (const day of eventDays(ev)) (byDay[day] ||= []).push(ev);
  }

  const firstWeekday = new Date(Date.UTC(view.year, view.month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${view.year}-${pad(view.month)}-${pad(d)}`);
  while (cells.length % 7 !== 0) cells.push(null);

  const today = todayYmd();
  const selectedEvents = (byDay[selectedDay] || []).slice().sort((a, b) => a.start.localeCompare(b.start));

  const goMonth = (delta: number) => {
    setView((v) => {
      const i = v.month - 1 + delta;
      return { year: v.year + Math.floor(i / 12), month: ((i % 12) + 12) % 12 + 1 };
    });
  };

  const v = variantFor(animKind, reduce);
  const hover = reduce ? {} : { scale: 1.12 };
  const tap = reduce ? {} : { scale: 0.92 };

  return (
    <div className="cal2" style={{ ["--cal-accent" as string]: accent }}>
      {/* ── Abas de calendário ── */}
      <div role="tablist" aria-label="Selecione o calendário" className="cal2-tabs">
        {CALENDARS.map((cal) => (
          <button
            key={cal.chave}
            role="tab"
            aria-selected={activeKey === cal.chave}
            className="cal2-tab"
            onClick={() => setActiveKey(cal.chave)}
          >
            {cal.nome}
          </button>
        ))}
      </div>

      {/* ── Barra compacta: navegação + atualização numa linha só ── */}
      <div className="cal2-bar">
        <div className="cal2-bar-left">
          <motion.button className="cal2-navbtn" whileHover={hover} whileTap={tap} onClick={() => goMonth(-1)} aria-label="Mês anterior">‹</motion.button>
          <span className="cal2-monthlabel" aria-live="polite">{monthLabel(view.year, view.month)}</span>
          <motion.button className="cal2-navbtn" whileHover={hover} whileTap={tap} onClick={() => goMonth(1)} aria-label="Próximo mês">›</motion.button>
        </div>
        <div className="cal2-bar-right">
          <span className="cal2-meta-status">
            {refreshing
              ? "Atualizando…"
              : updatedAt
              ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })}`
              : ""}
          </span>
          <motion.button
            className="cal2-refresh"
            whileHover={reduce ? {} : { scale: 1.04 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            onClick={() => load(activeKey, true)}
            aria-label="Atualizar calendário agora"
          >
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
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeKey}-${view.year}-${view.month}`}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cal2-grid" role="grid" aria-label={`Calendário ${activeCal.nome}, ${monthLabel(view.year, view.month)}`}>
              {WEEKDAYS.map((w) => (
                <div key={w} className="cal2-weekday" role="columnheader" aria-hidden>{w}</div>
              ))}
              {cells.map((ymd, i) => {
                if (!ymd) return <div key={`b${i}`} className="cal2-cell cal2-cell-empty" aria-hidden />;
                const dayNum = Number(ymd.slice(8, 10));
                const dayEvents = byDay[ymd] || [];
                const count = dayEvents.length;
                const isToday = ymd === today;
                const isSelected = ymd === selectedDay;
                return (
                  <button
                    key={ymd}
                    role="gridcell"
                    className={"cal2-cell" + (isToday ? " cal2-today" : "") + (count ? " cal2-has" : "")}
                    aria-label={`${longDayLabel(ymd)}${count ? `, ${count} reserva${count > 1 ? "s" : ""}` : ", sem reservas"}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDay(ymd)}
                  >
                    {isSelected && (
                      <motion.span
                        className="cal2-sel-ring"
                        aria-hidden
                        initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 520, damping: 30 }}
                      />
                    )}
                    <span className="cal2-daynum">{dayNum}</span>
                    <span className="cal2-chips">
                      {dayEvents.slice(0, 2).map((ev, j) => {
                        const startsHere = brasilia(ev.start).ymd === ymd;
                        return (
                          <span key={j} className="cal2-chip" title={ev.title}>
                            <span className="cal2-chip-time">{startsHere && !ev.allDay ? brasilia(ev.start).hm : "•"}</span> {ev.title}
                          </span>
                        );
                      })}
                      {count > 2 && <span className="cal2-more">+{count - 2}</span>}
                    </span>
                    {count > 0 && <span className="cal2-dot" aria-hidden>{count}</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Reservas do dia selecionado (anima ao trocar o dia) ── */}
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
                    <li key={i} className="cal2-event">
                      <div className="cal2-event-head">
                        <span className="cal2-event-time">{timeLabel(ev)}</span>
                        {isMultiDay(ev) && <span className="cal2-event-tag">vários dias</span>}
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
