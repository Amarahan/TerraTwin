import { useState } from "react";
import type { AtlasData } from "./data";
export type Screen = "home" | "targets" | "explorer" | "rankings" | "details" | "compare" | "about";
const images = {
  earth: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001386/GSFC_20171208_Archive_e001386~medium.jpg",
  meridiani: "https://images-assets.nasa.gov/image/PIA04275/PIA04275~medium.jpg",
};
export const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3-9 5 9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v6H5V6h6" />
      </>
    ),
    compare: (
      <>
        <path d="M8 4 4 8l4 4M4 8h8M16 20l4-4-4-4m4 4h-8" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

export function Header({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", "Mission"],
    ["targets", "Targets"],
    ["explorer", "Explore"],
    ["rankings", "Catalogue"],
    ["compare", "Compare"],
    ["about", "Method"],
  ] as [Screen, string][];
  return (
    <header className="topbar">
      <button className="brand" onClick={() => navigate("home")} aria-label="TerraTwin home">
        <img src={`${import.meta.env.BASE_URL}assets/17d10.png`} alt="TerraTwin" />
        <span>Earth Analog Exploration Platform</span>
      </button>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation" id="primary-nav">
        {nav.map(([id, label]) => (
          <button
            key={id}
            className={screen === id ? "active" : ""}
            onClick={() => {
              navigate(id);
              setOpen(false);
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="mission-status">
        Provisional research atlas
      </div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="primary-nav">
        <Icon name={open ? "close" : "menu"} />
      </button>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function Home({ navigate, data, selectSite }: { navigate: (s: Screen) => void; data: AtlasData; selectSite: (id: string) => void }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="mission-kicker">
            <span>Mission TT–01</span>
            <i /> Planetary analog reconnaissance
          </div>
          <h1>
            Discover Earth’s Twins <em>Beyond Earth.</em>
          </h1>
          <p>
            Explore our planet as a living laboratory for the Moon and Mars—comparing terrain,
            climate, geology, and ice signatures through a transparent research workflow.
          </p>
          <div className="button-row">
            <button className="primary" onClick={() => navigate("targets")}>
              Start Exploring <Icon name="arrow" />
            </button>
            <button className="secondary" onClick={() => navigate("about")}>
              Learn About the Mission
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{data.sites.length}</strong>
              <span>Earth study sites</span>
            </div>
            <div>
              <strong>{data.targets.length}</strong>
              <span>Planetary targets</span>
            </div>
            <div>
              <strong>{data.features.length}</strong>
              <span>Environmental variables</span>
            </div>
          </div>
        </div>
        <div className="planet-stage" aria-label="Earth and Mars orbital visualization">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="earth">
            <img src={images.earth} alt="NASA Blue Marble view of Earth" />
            <div className="atmosphere" />
          </div>
          <div className="mars" style={{ backgroundImage: `url(${images.meridiani})` }} />
          <div className="trajectory" />
          <div className="planet-label earth-label">
            <span>01</span> Earth · NASA context image
          </div>
          <div className="planet-label mars-label">
            <span>02</span> Mars reference body
          </div>
          <div className="telemetry">
            <span>CONTEXT VIEW</span>
            <b>NO LIVE MODEL</b>
            <small>ORBITAL VIEW / NOT TO SCALE</small>
          </div>
        </div>
      </section>

      <section className="mission-overview">
        <SectionHeading
          eyebrow="Research framework"
          title="One planet. Two destinations. Shared questions."
          text="TerraTwin organizes Earth observations into an explainable analog-research workflow."
        />
        <div className="mission-columns">
          <article>
            <span className="index">01</span>
            <Icon name="globe" size={24} />
            <h3>Select a destination</h3>
            <p>
              Choose a lunar or Martian site and review the environmental characteristics guiding
              the search.
            </p>
          </article>
          <article>
            <span className="index">02</span>
            <Icon name="layers" size={24} />
            <h3>Interrogate Earth</h3>
            <p>
              Explore candidate, benchmark, and control sites through a geospatial evidence layer.
            </p>
          </article>
          <article>
            <span className="index">03</span>
            <Icon name="chart" size={24} />
            <h3>Compare transparently</h3>
            <p>
              Inspect data availability, sources, and limitations before any comparison is scored.
            </p>
          </article>
        </div>
      </section>

      <section className="featured-strip">
        <div className="strip-head">
          <div>
            <p className="eyebrow">Field catalogue</p>
            <h2>Featured Earth locations</h2>
          </div>
          <button className="text-button" onClick={() => navigate("explorer")}>
            Open atlas <Icon name="arrow" />
          </button>
        </div>
        <div className="feature-grid">
          {data.sites.filter(s => s.group === "Featured").map((site, index) => (
            <button className="feature-card pending-card" key={site.id} onClick={() => selectSite(site.id)}>
              <div className="card-scanlines" />
              <span className="card-identifier">0{index + 1} / {site.region}</span>
              <h3>{site.name}</h3>
              <p>Candidate site · Geographic placement pending review</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

