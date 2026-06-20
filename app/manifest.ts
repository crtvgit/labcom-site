import type { MetadataRoute } from "next";

/**
 * Web App Manifest — permite "instalar" o site e melhora SEO/compartilhamento.
 * O Next gera /manifest.webmanifest automaticamente a partir deste arquivo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LAB.COM — Laboratórios de Comunicação | UCB",
    short_name: "LAB.COM",
    description:
      "O espaço de aprendizado prático dos cursos de Comunicação da Universidade Católica de Brasília.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F2",
    theme_color: "#F7F6F2",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
