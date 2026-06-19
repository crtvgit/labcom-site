"use client";

/**
 * CalendarEmbed — calendário de reservas exibido DENTRO do site (inline).
 *
 * Como funciona:
 *  - Abas para escolher o calendário (CRTV / Rádio / N.FOTO).
 *  - Os eventos vêm da rota /api/calendario/[chave], que lê o feed ".ics"
 *    publicado do Outlook no servidor (sem o bloqueio de iframe da Microsoft).
 *  - Desenhamos a grade do mês aqui mesmo; clicar em um dia mostra as reservas
 *    daquele dia. Nada abre em nova aba.
 *
 * Os calendários são editáveis em: lib/siteConfig.ts → calendarios
 */

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import type { IcsEvent } from "@/lib/ics";

const CALENDARS = siteConfig.calendarios;
const TZ = "America/Sao_Paulo";
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/* ── Helpers de data (sempre no fuso de Brasília) ───────────── */
const pad = (n: number) => String(n).padStart(2, "0");

function brasilia(iso: string) {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { ymd: `${p.year}-${p.month}-${p.day}`, hm: `${p.hour}:${p.minute}` };
}

function todayYmd(): string {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

function monthLabel(year: number, month: number): string {
  const d = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(d);
}

function longDayLabel(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

export default function CalendarEmbed() {
  const [activeKey, setActiveKey] = useState<string>(CALENDARS[0].chave);

  // Cache de eventos por calendário, para não rebuscar ao trocar de aba.
  const cacheRef = useRef<Record<string, IcsEvent[]>>({});
  const [events, setEvents] = useState<IcsEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  // Mês visível + dia selecionado
  const initialToday = todayYmd();
  const [view, setView] = useState(() => {
    const [y, m] = initialToday.split("-").map(Number);
    return { year: y, month: m };
  });
  const [selectedDay, setSelectedDay] = useState<string>(initialToday);

  const activeCal = CALENDARS.find((c) => c.chave === activeKey)!;

  /* ── Busca os eventos do calendário ativo ── */
  useEffect(() => {
    let cancelled = false;

    if (cacheRef.current[activeKey]) {
      setEvents(cacheRef.current[activeKey]);
      setStatus("ok");
      return;
    }

    setStatus("loading");
    fetch(`/api/calendario/${activeKey}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { events: IcsEvent[] }) => {
        if (cancelled) return;
        cacheRef.current[activeKey] = data.events || [];
        setEvents(data.events || []);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [activeKey]);

  /* ── Agrupa eventos por dia (yyyy-mm-dd, Brasília) ── */
  const byDay: Record<string, IcsEvent[]> = {};
  for (const ev of events) {
    const key = brasilia(ev.start).ymd;
    (byDay[key] ||= []).push(ev);
  }

  /* ── Monta as células da grade do mês ── */
  const firstWeekday = new Date(Date.UTC(view.year, view.month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${view.year}-${pad(view.month)}-${pad(d)}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const today = todayYmd();
  const selectedEvents = (byDay[selectedDay] || [])
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start));

  const goMonth = (delta: number) => {
    setView((v) => {
      const idx = v.month - 1 + delta;
      const year = v.year + Math.floor(idx / 12);
      const month = ((idx % 12) + 12) % 12 + 1;
      return { year, month };
    });
  };

  return (
    <div className="cal2">
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
        <span className="cal2-monthlabel" aria-live="polite">
          {monthLabel(view.year, view.month)}
        </span>
        <button className="cal2-navbtn" onClick={() => goMonth(1)} aria-label="Próximo mês">›</button>
      </div>

      {status === "loading" && (
        <div className="cal2-state" role="status">Carregando reservas…</div>
      )}

      {status === "error" && (
        <div className="cal2-state cal2-state-error" role="alert">
          Não foi possível carregar o calendário agora.{" "}
          <a href={activeCal.ics.replace(/\.ics$/, ".html")} target="_blank" rel="noopener noreferrer">
            Abrir no Outlook
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      )}

      {status === "ok" && (
        <>
          {/* ── Grade do mês ── */}
          <div className="cal2-grid" role="grid" aria-label={`Calendário ${activeCal.nome}, ${monthLabel(view.year, view.month)}`}>
            {WEEKDAYS.map((w) => (
              <div key={w} className="cal2-weekday" role="columnheader" aria-hidden>{w}</div>
            ))}
            {cells.map((ymd, i) => {
              if (!ymd) return <div key={`b${i}`} className="cal2-cell cal2-cell-empty" aria-hidden />;
              const dayNum = Number(ymd.slice(8, 10));
              const dayEvents = (byDay[ymd] || []);
              const isToday = ymd === today;
              const isSelected = ymd === selectedDay;
              const count = dayEvents.length;
              return (
                <button
                  key={ymd}
                  role="gridcell"
                  className={
                    "cal2-cell" +
                    (isToday ? " cal2-today" : "") +
                    (isSelected ? " cal2-selected" : "") +
                    (count ? " cal2-has" : "")
                  }
                  aria-label={`${longDayLabel(ymd)}${count ? `, ${count} reserva${count > 1 ? "s" : ""}` : ", sem reservas"}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDay(ymd)}
                >
                  <span className="cal2-daynum">{dayNum}</span>
                  {/* Chips (desktop) */}
                  <span className="cal2-chips">
                    {dayEvents.slice(0, 2).map((ev, j) => (
                      <span key={j} className="cal2-chip" title={ev.title}>
                        <span className="cal2-chip-time">{brasilia(ev.start).hm}</span> {ev.title}
                      </span>
                    ))}
                    {count > 2 && <span className="cal2-more">+{count - 2}</span>}
                  </span>
                  {/* Ponto (mobile) */}
                  {count > 0 && <span className="cal2-dot" aria-hidden>{count}</span>}
                </button>
              );
            })}
          </div>

          {/* ── Reservas do dia selecionado ── */}
          <div className="cal2-day" aria-live="polite">
            <h3 className="cal2-day-title">{longDayLabel(selectedDay)}</h3>
            {selectedEvents.length === 0 ? (
              <p className="cal2-day-empty">Nenhuma reserva neste dia.</p>
            ) : (
              <ul className="cal2-day-list" role="list">
                {selectedEvents.map((ev, i) => (
                  <li key={i} className="cal2-event">
                    <span className="cal2-event-time">
                      {(() => {
                        if (ev.allDay) return "Dia todo";
                        const ini = brasilia(ev.start).hm;
                        const fim = brasilia(ev.end).hm;
                        return ini === fim ? ini : `${ini}–${fim}`;
                      })()}
                    </span>
                    <span className="cal2-event-body">
                      <span className="cal2-event-title">{ev.title}</span>
                      {ev.location && <span className="cal2-event-loc">{ev.location}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
