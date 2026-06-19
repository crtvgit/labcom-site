/**
 * Rota /api/calendario/[chave]
 *
 * Busca o feed ".ics" do calendário (no SERVIDOR, evitando o bloqueio de
 * iframe da Microsoft) e devolve os eventos já tratados em JSON para o
 * componente de calendário desenhar tudo dentro do site.
 *
 * Os calendários (chave, nome e link .ics) ficam em: lib/siteConfig.ts
 */

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";
import { parseIcs } from "@/lib/ics";

// SEMPRE ao vivo: cada requisição busca o calendário direto do Outlook,
// para nunca ficar desatualizado.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chave: string }> }
) {
  const { chave } = await params;

  const cal = siteConfig.calendarios.find((c) => c.chave === chave);
  if (!cal) {
    return NextResponse.json(
      { error: "Calendário não encontrado" },
      { status: 404 }
    );
  }

  try {
    const res = await fetch(cal.ics, {
      headers: {
        // Alguns endpoints da Microsoft recusam requisições sem User-Agent.
        "User-Agent":
          "Mozilla/5.0 (compatible; LABCOM-site/1.0; +https://labcom.ucb.br)",
        Accept: "text/calendar, text/plain, */*",
      },
      // Sempre buscar a versão mais recente do Outlook.
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Falha ao buscar o calendário (HTTP ${res.status})` },
        { status: 502 }
      );
    }

    const text = await res.text();
    const events = parseIcs(text);

    return NextResponse.json(
      { calendar: cal.nome, events },
      {
        headers: {
          // Nunca armazenar em cache — o calendário deve refletir o Outlook agora.
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar o calendário no momento." },
      { status: 502 }
    );
  }
}
