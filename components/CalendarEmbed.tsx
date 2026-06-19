"use client";

/**
 * CalendarEmbed — calendário de reservas exibido DENTRO do site (inline).
 *
 *  - Abas para escolher o calendário (CRTV / Rádio / N.FOTO), cada uma com
 *    sua própria cor e sua própria animação de entrada.
 *  - Os eventos vêm da rota /api/calendario/[chave], que lê o feed ".ics"
 *    publicado do Outlook NO SERVIDOR e SEMPRE AO VIVO (sem cache), além de
 *    reatualizar ao voltar para a aba e por um botão "Atualizar".
 *  - Mostra as informações completas do evento (horário, local e descrição).
 *
 * Os calendários são editáveis em: lib/siteConfig.ts → calendarios
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";
import type { IcsEvent } from "@/lib/ics";

const CALENDARS = siteConfig.calendarios;
const TZ = "America/Sao_Paulo";
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Cor e estilo de animação por calendário (ciclam se houver mais calendários). */
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
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
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

function timeRange(ev: IcsEvent): string {
  if (ev.allDay) return "Dia todo";
  const ini = brasilia(ev.start).hm;
  const fim = brasilia(ev.end).hm;
  return ini === fim ? ini : `${ini}–${fim}`;
}

function variantFor(kind: (typeof ANIMS)[number], reduce: boolean | null) {
  if (reduce) return { initial: false, animate: {}, exit: {} } as const;
  switch (kind) {
    case "slide": return { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 } };
    case "scale": return { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.04 } };
    case "rise":  return { initial: { opacity: 0, y: 32 },  animate: { opacity: 1, y: 0 },  exit: { opacity: 0, y: -22 } };
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

  /* ── Carrega eventos (sempre ao vivo) ── */
  const load = useCallback((key: string, silent = false) => {
    if (silent) setRefreshing(true);
    else { setStatus("loading"); setEvents([]); }

    fetch(`/api/calendario/${key}?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { events: IcsEvent[] }) => {
        if (key !== latestKey.current) return; // ignora resposta de aba antiga
        setEvents(data.events || []);
        setStatus("ok");
        setUpdatedAt(new Date());
      })
      .catch(() => {
        if (key === latestKey.current && !silent) setStatus("error");
      })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    latestKey.current = activeKey;
    load(activeKey);
  }, [activeKey, load]);

  // Reatualiza ao voltar o foco para a aba do navegador.
  useEffect(() => {
    const onFocus = () => load(latestKey.current, true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  /* ── Agrupa eventos por dia (Brasília) ── */
  const byDay: Record<string, IcsEvent[]> = {};
  for (const ev of events) (byDay[brasilia(ev.start).ymd] ||= []).push(ev);

  /* ── Células da grade ── */
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

      {/* ── Barra do mês ── */}
      <div className="cal2-monthbar">
        <button className="cal2-navbtn" onClick={() => goMonth(-1)} aria-label="Mês anterior">‹</button>
        <span className="cal2-monthlabel" aria-live="polite">{monthLabel(view.year, view.month)}</span>
        <button className="cal2-navbtn" onClick={() => goMonth(1)} aria-label="Próximo mês">›</button>
      </div>

      {/* ── Linha de atualização (sempre ao vivo) ── */}
      <div className="cal2-meta">
        <span className="cal2-meta-status">
          {refreshing
            ? "Atualizando…"
            : updatedAt
            ? `Atualizado às ${updatedAt.toLocaleTimeString("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </span>
        <button
          className="cal2-refresh"
          onClick={() => load(activeKey, true)}
          aria-label="Atualizar calendário agora"
        >
          <span className={"cal2-refresh-icon" + (refreshing ? " cal2-spin" : "")} aria-hidden>⟳</span>
          Atualizar
        </button>
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Grade do mês ── */}
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
                    className={"cal2-cell" + (isToday ? " cal2-today" : "") + (isSelected ? " cal2-selected" : "") + (count ? " cal2-has" : "")}
                    aria-label={`${longDayLabel(ymd)}${count ? `, ${count} reserva${count > 1 ? "s" : ""}` : ", sem reservas"}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDay(ymd)}
                  >
                    <span className="cal2-daynum">{dayNum}</span>
                    <span className="cal2-chips">
                      {dayEvents.slice(0, 2).map((ev, j) => (
                        <span key={j} className="cal2-chip" title={ev.title}>
                          <span className="cal2-chip-time">{brasilia(ev.start).hm}</span> {ev.title}
                        </span>
                      ))}
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

      {/* ── Reservas do dia selecionado (com infos completas) ── */}
      {status === "ok" && (
        <div className="cal2-day" aria-live="polite">
          <h3 className="cal2-day-title">{longDayLabel(selectedDay)}</h3>
          {selectedEvents.length === 0 ? (
            <p className="cal2-day-empty">Nenhuma reserva neste dia.</p>
          ) : (
            <ul className="cal2-day-list" role="list">
              {selectedEvents.map((ev, i) => (
                <motion.li
                  key={i}
                  className="cal2-event"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.05 }}
                >
                  <div className="cal2-event-head">
                    <span className="cal2-event-time">{timeRange(ev)}</span>
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
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
