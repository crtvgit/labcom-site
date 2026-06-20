import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotebookBackground from "@/components/NotebookBackground";
import ReservationNotice from "@/components/ReservationNotice";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import AboutSpacesGroup from "@/components/AboutSpacesGroup";
import ResourcesSection from "@/components/sections/ResourcesSection";
import CalendarSection from "@/components/sections/CalendarSection";
import ReservaContent from "@/components/ReservaContent";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />

      <main id="conteudo" style={{ position: "relative", paddingTop: "var(--header-h)" }}>
        {/* ── Aviso de reservas bloqueadas (tarja vermelha — liga/desliga em lib/siteConfig.ts) ── */}
        <ReservationNotice />

        {/* ── Page decorations (z:0, behind all content) ── */}
        <NotebookBackground />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/*
           * ── Hero & Intro Group (with Polygon Background) ──
           * The polygon sits inside this relative wrapper, filling the space
           * from the top down to just after the Intro section.
           */}
          <div style={{ position: "relative" }}>
            {/* Polygon Background (Right side, right trapezoid) */}
            <div
              aria-hidden
              className="geo-polygon-bg"
              style={{
                position: "absolute",
                zIndex: 0,
                top: "calc(-1 * var(--header-h))",
                bottom: "calc(-1 * clamp(10px, 2.1vw, 27px))", // Extrapola o container e desce até o EXATO centro do Margin Top da próxima seção
                left: 0,
                right: 0,
                backgroundColor: "#D0CABB",
                clipPath: "polygon(calc(50% + clamp(50px, 15vw, 250px)) 0%, 100% 0%, 100% 100%, calc(50% - min(10%, 100px)) 100%)",
                backgroundImage: `var(--texture-url), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='224' height='224'%3E%3Crect width='112' height='112' fill='rgba(20,30,45,0.035)'/%3E%3Crect x='112' y='112' width='112' height='112' fill='rgba(20,30,45,0.035)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat, repeat",
                backgroundBlendMode: "multiply, normal",
                opacity: 0.45,
                pointerEvents: "none",
              }}
            />
            <div className="site-shell" style={{ position: "relative" }}>
              <div className="site-gutter">
                <HeroSection />
                <IntroSection />
              </div>
            </div>
          </div>

          {/*
           * ── About → Spaces → Resources ──
           */}
          <div className="site-shell" style={{ position: "relative", zIndex: 1 }}>
            <div className="site-gutter">
              <AboutSpacesGroup />
              <ResourcesSection />
            </div>
          </div>

          {/*
           * ── Blue zone (Contact group's Blue_Background) ──
           * Full viewport width — intentionally NOT wrapped in maxWidth.
           * marginTop:-46px lets the blue start behind the Spaces bottom;
           * paddingTop creates the visible gap before the Calendar.
           */}
          <div
            style={{
              position: "relative",
              zIndex: 0,
              marginTop: "-46px",
              backgroundColor: "#AFC6E5",
              backgroundImage: "url('/textures/Blue_Background.svg')",
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "top left",
              paddingTop: "clamp(36px, 4.5vw, 64px)",
              paddingBottom: "clamp(24px, 5.4vw, 69px)",
            }}
          >
            <div className="site-shell">
              <div className="site-gutter">
                <CalendarSection />
              </div>
            </div>
          </div>

          {/* ── Reservation form section — directly below the blue zone ── */}
          <div className="site-shell">
            <div className="site-gutter">
              <ReservaContent />
            </div>
          </div>

          {/* ── Contact section — paper box below reservation ── */}
          <div className="site-shell">
            <ContactSection />
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
