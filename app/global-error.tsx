"use client";

/**
 * global-error — capturado apenas quando o próprio layout raiz falha.
 * Precisa renderizar <html>/<body> porque substitui o layout inteiro.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
          background: "#F7F6F2",
          color: "#060606",
          padding: 24,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Algo deu errado
        </h1>
        <p style={{ color: "#6e6e6e", maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
          Não foi possível carregar o site. Tente novamente em instantes.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#060606",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "14px 28px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
