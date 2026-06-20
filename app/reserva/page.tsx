import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotebookBackground from "@/components/NotebookBackground";
import ReservationNotice from "@/components/ReservationNotice";
import ReservaContent from "@/components/ReservaContent";

export const metadata: Metadata = {
  title: "Faça sua Reserva — LAB.COM | UCB",
  description:
    "Reserve um espaço no LAB.COM — Laboratórios de Comunicação da UCB.",
};

export default function ReservaPage() {
  return (
    <>
      <Header />

      {/* position:relative so NotebookBackground (absolute inset:0) is contained here */}
      <main id="conteudo" style={{ position: "relative", paddingTop: "var(--header-h)" }}>
        <ReservationNotice />
        <NotebookBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="site-shell">
            <div className="site-gutter">
              {/* ── Booking form section (animated client component) ── */}
              <ReservaContent />
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
