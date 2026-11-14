import { useState } from "react";
import type { AtlasData } from "./data";
export type Screen = "home" | "targets" | "explorer" | "rankings" | "details" | "compare" | "about";
const images = {
  earth: `${import.meta.env.BASE_URL}images/celestial/nasa_blue_marble_earth.jpg`,
  // Authentic NASA Galileo/LRO Lunar surface imagery (cratered grey celestial body)
  moon: `${import.meta.env.BASE_URL}images/celestial/nasa_galileo_moon.jpg`,
  // Authentic NASA Mars imagery (reddish planet)
  mars: `${import.meta.env.BASE_URL}images/celestial/nasa_mola_mars.jpg`,
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

const FEATURED_LOCATIONS = [
  {
    id: "mount-popa-central-dry-zone",
    name: "Mount Popa",
    region: "Myanmar",
    image: `${import.meta.env.BASE_URL}assets/featured/mount-popa.jpg`,
    alt: "Mount Popa volcanic mountain with the monastery at the summit",
    objectPosition: "center 35%",
    description: "Volcanic plug with hydrothermal mineral deposits and distinct basaltic slopes.",
  },
  {
    id: "twin-taung-maar-crater",
    name: "Twin Taung Maar Crater",
    region: "Myanmar",
    image: `${import.meta.env.BASE_URL}assets/featured/twin-taung.jpg`,
    alt: "Twin Taung crater lake and surrounding landscape",
    objectPosition: "center center",
    description: "Volcanic maar crater lake exhibiting steep ejecta walls and morphologic depression.",
  },
  {
    id: "letpadaung-monywa-copper-area",
    name: "Letpadaung / Monywa Copper Area",
    region: "Myanmar",
    image: `${import.meta.env.BASE_URL}assets/featured/letpadaung.jpg`,
    alt: "Letpadaung copper-area landscape",
    objectPosition: "center 45%",
    description: "Open hydrothermal copper-porphyry deposit with diverse altered rock and mineral zones.",
  },
  {
    id: "kawah-ijen",
    name: "Kawah Ijen",
    region: "Indonesia",
    image: `${import.meta.env.BASE_URL}assets/featured/kawah-ijen.jpg`,
    alt: "Kawah Ijen turquoise acidic crater lake",
    objectPosition: "center 55%",
    description: "Hyper-acidic turquoise crater lake characterized by active sulfur solfatara processes.",
  },
];

export function Home({ navigate, data, selectSite }: { navigate: (s: Screen) => void; data: AtlasData; selectSite: (id: string) => void }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="mission-kicker">
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
        <div className="planet-stage" aria-label="Earth, Moon and Mars celestial visualization">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit orbit-c" />
          <div className="earth">
            <img src={images.earth} alt="NASA Blue Marble view of Earth from space" />
            <div className="atmosphere" />
          </div>
          <div className="moon" style={{ backgroundImage: `url(${images.moon})` }} aria-label="Moon cratered reference body" />
          <div className="mars" style={{ backgroundImage: `url(${images.mars})` }} aria-label="Mars reddish reference body" />
          <div className="trajectory trajectory-moon" />
          <div className="trajectory trajectory-mars" />
          <div className="planet-label earth-label">
            <span>01</span> EARTH · NASA CONTEXT IMAGE
          </div>
          <div className="planet-label moon-label">
            <span>02</span> MOON REFERENCE BODY
          </div>
          <div className="planet-label mars-label">
            <span>03</span> MARS REFERENCE BODY
          </div>
          <div className="stage-caption">
            Illustrative planetary composition · Not to scale
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
          {FEATURED_LOCATIONS.map((loc, index) => (
            <button
              className="feature-card"
              key={loc.id}
              onClick={() => selectSite(loc.id)}
            >
              <img
                src={loc.image}
                alt={loc.alt}
                style={{ objectPosition: loc.objectPosition }}
                loading="lazy"
              />
              <div className="card-scanlines" />
              <div className="card-header-tags">
                <span className="card-identifier">0{index + 1} / {loc.region}</span>
                <span className="card-badge">Featured</span>
              </div>
              <h3>{loc.name}</h3>
              <p>{loc.description}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

