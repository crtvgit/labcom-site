"use client";

/**
 * Error boundary — exibido quando algo dá errado em tempo de execução.
 * Mantém a identidade do site (papel + azul) e oferece "tentar novamente".
 */

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotebookBackground from "@/components/NotebookBackground";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registra o erro no console (útil para diagnóstico em produção).
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />

      <main style={{ position: "relative", paddingTop: "var(--header-h)" }}>
        <NotebookBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="site-shell">
            <div className="site-gutter">
              <section
                aria-labelledby="error-heading"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--off-white)",
                  backgroundImage: "var(--texture-url)",
                  backgroundSize: "var(--texture-size) var(--texture-size)",
                  backgroundRepeat: "repeat",
                  backgroundBlendMode: "multiply",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "clamp(420px, 58vh, 620px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
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
                    className="section-eyebrow"
                    style={{ marginBottom: "clamp(16px, 2.2vw, 28px)" }}
                  >
                    algo deu errado
                  </p>

                  <h1
                    id="error-heading"
                    style={{
                      fontSize: "clamp(24px, 3.6vw, 44px)",
                      fontWeight: 700,
                      lineHeight: 1.12,
                      color: "#000",
                      marginBottom: "clamp(12px, 1.4vw, 18px)",
                    }}
                  >
                    <span>Tivemos um </span>
                    <span style={{ color: "var(--blue-accent)" }}>problema</span>
                    <span> ao carregar esta página.</span>
                  </h1>

                  <p
                    style={{
                      fontSize: "clamp(13px, 1.2vw, 16px)",
                      color: "var(--gray-muted)",
                      lineHeight: 1.65,
                      maxWidth: "clamp(260px, 42vw, 460px)",
                      marginBottom: "clamp(28px, 4vw, 44px)",
                    }}
                  >
                    Tente novamente. Se o problema continuar, volte ao início ou
                    entre em contato pelo e-mail do LAB.COM.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <button
                      type="button"
                      onClick={reset}
                      className="btn-dark"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: "var(--near-black)",
                        color: "var(--off-white)",
                        fontWeight: 700,
                        fontSize: "clamp(13px, 1.2vw, 16px)",
                        lineHeight: 1,
                        padding: "clamp(13px, 1.5vw, 17px) clamp(22px, 2.6vw, 32px)",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        letterSpacing: "0.01em",
                      }}
                    >
                      <span aria-hidden className="btn-arrow">↻</span>
                      <span>Tentar novamente</span>
                    </button>

                    <Link
                      href="/"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        border: "1px solid var(--border)",
                        color: "#000",
                        fontWeight: 600,
                        fontSize: "clamp(13px, 1.2vw, 16px)",
                        lineHeight: 1,
                        padding: "clamp(13px, 1.5vw, 17px) clamp(22px, 2.6vw, 32px)",
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                    >
                      Voltar ao início
                    </Link>
                  </div>
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
