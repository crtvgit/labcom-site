import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://labcom.ucb.br"),
  title: {
    default: "LAB.COM — Laboratórios de Comunicação | UCB",
    template: "%s | LAB.COM UCB",
  },
  description:
    "O espaço de aprendizado prático dos cursos de Comunicação da Universidade Católica de Brasília. Estúdio de TV, rádio, fotografia e muito mais.",
  keywords: [
    "LAB.COM",
    "laboratórios de comunicação",
    "UCB",
    "Universidade Católica de Brasília",
    "CRTV",
    "estúdio de TV",
    "rádio",
    "fotografia",
    "comunicação social",
    "Brasília",
  ],
  authors: [{ name: "UCB — Universidade Católica de Brasília" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://labcom.ucb.br",
    siteName: "LAB.COM UCB",
    title: "LAB.COM — Laboratórios de Comunicação | UCB",
    description:
      "O espaço de aprendizado prático dos cursos de Comunicação da Universidade Católica de Brasília.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LAB.COM — Laboratórios de Comunicação UCB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LAB.COM — Laboratórios de Comunicação | UCB",
    description:
      "O espaço de aprendizado prático dos cursos de Comunicação da Universidade Católica de Brasília.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/*
 * viewport-fit: cover — allows content to extend under the iOS notch /
 * Dynamic Island so the fixed header can use env(safe-area-inset-top).
 * themeColor matches the page background, colouring the iOS/Android status bar.
 */
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#F0EEE9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={hanken.variable}>
      <body className="page-texture">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
