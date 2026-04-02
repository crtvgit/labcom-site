import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotebookBackground from "@/components/NotebookBackground";
import HeroSection from "@/components/sections/HeroSection";
import VideoSection from "@/components/sections/VideoSection";
import AboutSpacesGroup from "@/components/AboutSpacesGroup";
import ResourcesSection from "@/components/sections/ResourcesSection";
import CalendarSection from "@/components/sections/CalendarSection";
import ReservaContent from "@/components/ReservaContent";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />

      <main style={{ position: "relative", paddingTop: "var(--header-h)" }}>
        {/* ── Page decorations (z:0, behind all content) ── */}
        <NotebookBackground />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/*
           * ── Hero & Video Group (with Triangle Background) ──
           * The triangle sits inside this relative wrapper, filling the space
           * from the top down to just after the Video section, perfectly cutting off
           * before the About section starts.
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
            <div
              style={{
                position: "relative",
                maxWidth: 1280,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  marginLeft: "clamp(1rem, 12.8vw, 164px)",
                  marginRight: "clamp(1rem, 12.7vw, 162px)",
                }}
              >
                <HeroSection />
                <VideoSection />
              </div>
            </div>
          </div>

          {/*
           * ── About → Spaces → Resources ──
           */}
          <div
            style={{
              position: "relative",
              zIndex: 1, // Lifts the sections ABOVE the subsequent -46px margined Blue zone so they aren't visually cut off
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                marginLeft: "clamp(1rem, 12.8vw, 164px)",
                marginRight: "clamp(1rem, 12.7vw, 162px)",
              }}
            >
              <AboutSpacesGroup />
              <ResourcesSection />
            </div>
          </div>

          {/*
           * ── Blue zone (Figma: Contact group's Blue_Background) ──
           *
           * Full viewport width — intentionally NOT wrapped in maxWidth.
           *
           * Figma coordinates (Desktop frame 1280 × 3575 px):
           *   Blue_Background : x=0, y=2100, w=1280, h=936
           *   SpacesSection   : About group ends at y=2146 → blue overlaps Spaces by 46 px
           *   CalendarSection : starts at y=2202 → 102 px below blue top
           *
           *   marginTop : -46 px — blue starts 46 px behind SpacesSection bottom
           *   paddingTop : 102 px — Calendar begins 102 px from blue top
           *   visible gap (blue visible between Spaces bottom and Calendar) = 102 − 46 = 56 px ✓
           *
           * zIndex:0 keeps the blue behind the upper sections block (zIndex:1).
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
            <div
              style={{
                maxWidth: 1280,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  marginLeft: "clamp(1rem, 12.8vw, 164px)",
                  marginRight: "clamp(1rem, 12.7vw, 162px)",
                }}
              >
                <CalendarSection />
              </div>
            </div>
          </div>

          {/* ── Reservation form section — directly below the blue zone ── */}
          <div
            style={{
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                marginLeft: "clamp(1rem, 12.8vw, 164px)",
                marginRight: "clamp(1rem, 12.7vw, 162px)",
              }}
            >
              <ReservaContent />
            </div>
          </div>

          {/* ── Contact section — paper box below reservation ── */}
          <div
            style={{
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <ContactSection />
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
