import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotebookBackground from "@/components/NotebookBackground";

export const metadata: Metadata = {
  title: "404 — Página não encontrada",
};

export default function NotFound() {
  return (
    <>
      <Header />

      <main style={{ position: "relative", paddingTop: "var(--header-h)" }}>
        <NotebookBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="site-shell">
            <div className="site-gutter">
              <section
                aria-labelledby="not-found-heading"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--off-white)",
                  backgroundImage: "var(--texture-url)",
                  backgroundSize: "var(--texture-size) var(--texture-size)",
                  backgroundRepeat: "repeat",
                  backgroundBlendMode: "multiply",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "clamp(440px, 62vh, 660px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/*
                 * Watermark — decorative oversized "404" bled to the right.
                 * overflow:hidden on the section clips it cleanly.
                 * opacity 0.06 keeps it subliminal; it adds depth without
                 * competing with the foreground content.
                 */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: "clamp(-0.14em, -1.5vw, -0.06em)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "clamp(220px, 36vw, 480px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.07em",
                    color: "var(--blue-accent)",
                    opacity: 0.06,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  404
                </span>

                {/* Foreground content — left-aligned editorial layout */}
                <div
                  className="content-inner"
                  style={{
                    paddingTop: "clamp(52px, 8vw, 96px)",
                    paddingBottom: "clamp(52px, 8vw, 96px)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <p
                    className="section-eyebrow not-found-anim"
                    style={{
                      marginBottom: "clamp(20px, 2.6vw, 34px)",
                      animationDelay: "0.08s",
                    }}
                  >
                    erro 404
                  </p>

                  {/* Typographic focal point */}
                  <div
                    aria-hidden
                    className="not-found-anim"
                    style={{
                      fontSize: "clamp(76px, 13vw, 156px)",
                      fontWeight: 700,
                      color: "var(--blue-accent)",
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                      marginBottom: "clamp(20px, 2.6vw, 34px)",
                      animationDelay: "0.2s",
                    }}
                  >
                    404
                  </div>

                  {/* Thin editorial rule */}
                  <div
                    className="not-found-anim"
                    style={{
                      width: "clamp(36px, 4vw, 56px)",
                      height: 1,
                      backgroundColor: "var(--border)",
                      marginBottom: "clamp(20px, 2.6vw, 34px)",
                      animationDelay: "0.3s",
                    }}
                  />

                  <h1
                    id="not-found-heading"
                    className="not-found-anim"
                    style={{
                      fontSize: "clamp(20px, 3vw, 40px)",
                      fontWeight: 700,
                      lineHeight: 1.15,
                      color: "#000",
                      marginBottom: "clamp(10px, 1.2vw, 16px)",
                      animationDelay: "0.3s",
                    }}
                  >
                    Página não encontrada.
                  </h1>

                  <p
                    className="not-found-anim"
                    style={{
                      fontSize: "clamp(13px, 1.2vw, 16px)",
                      fontWeight: 400,
                      color: "var(--gray-muted)",
                      lineHeight: 1.65,
                      maxWidth: "clamp(260px, 38vw, 440px)",
                      marginBottom: "clamp(34px, 4.8vw, 56px)",
                      animationDelay: "0.4s",
                    }}
                  >
                    Este endereço não existe no LAB.COM. O espaço pode ter sido
                    removido ou o link está incorreto.
                  </p>

                  <Link
                    href="/"
                    className="not-found-cta not-found-anim btn-dark"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "var(--near-black)",
                      color: "var(--off-white)",
                      fontWeight: 700,
                      fontSize: "clamp(13px, 1.2vw, 16px)",
                      lineHeight: 1,
                      padding:
                        "clamp(14px, 1.6vw, 18px) clamp(24px, 2.8vw, 36px)",
                      borderRadius: 4,
                      textDecoration: "none",
                      letterSpacing: "0.01em",
                      animationDelay: "0.5s",
                    }}
                  >
                    <span aria-hidden className="btn-arrow" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span>
                    <span>Voltar ao início</span>
                  </Link>
                </div>
              </section>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
