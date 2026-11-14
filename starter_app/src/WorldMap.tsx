import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const SITE_COORDINATES: Record<string, [number, number]> = {
  'twin-taung-maar-crater': [22.37056, 95.01861],
  'letpadaung-monywa-copper-area': [22.1, 95.0],
  'mount-popa-central-dry-zone': [20.92, 95.25],
  'kawah-ijen': [-8.058, 114.242],
  'atacama-desert': [-23.86, -69.13],
  'haughton-crater': [75.37, -89.68],
  'mcmurdo-dry-valleys': [-77.5, 162.0],
  'death-valley': [36.53, -116.93],
  'lonar-crater': [19.98, 76.51],
  'amazon-rainforest': [-3.47, -62.22],
  'congo-basin': [0.0, 23.0],
  'irrawaddy-delta-rice-fields': [16.8, 95.3],
};

interface WorldMapProps {
  sites?: Array<{
    id: string;
    name: string;
    group: string | null;
    region: string | null;
  }>;
  activeSiteId?: string;
  onSelectSite?: (id: string) => void;
}

export function WorldMap({ sites = [], activeSiteId, onSelectSite }: WorldMapProps) {
  const element = useRef<HTMLDivElement>(null);
  const instance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!element.current) return;

    const initialCenter: [number, number] = [15, 20];
    const initialZoom = 2;

    const map = L.map(element.current, {
      minZoom: 1,
      maxZoom: 10,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView(initialCenter, initialZoom);
    instance.current = map;

    // High quality scientific dark basemap with Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Coordinate graticules for scientific precision
    for (let lng = -180; lng <= 180; lng += 30) {
      L.polyline(
        [
          [-80, lng],
          [80, lng],
        ],
        { color: '#28516b', weight: 1, opacity: 0.35, interactive: false },
      ).addTo(map);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      L.polyline(
        [
          [lat, -180],
          [lat, 180],
        ],
        { color: '#28516b', weight: 1, opacity: 0.35, interactive: false },
      ).addTo(map);
    }

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(element.current);

    return () => {
      observer.disconnect();
      map.remove();
      instance.current = null;
    };
  }, []);

  // Update or render interactive circle markers
  useEffect(() => {
    const map = instance.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    sites.forEach((site) => {
      const coords = SITE_COORDINATES[site.id];
      if (!coords) return;

      const isActive = site.id === activeSiteId;
      const color =
        site.group === 'Featured'
          ? '#00e5ff'
          : site.group === 'Benchmark'
          ? '#f59e0b'
          : '#10b981';

      const marker = L.circleMarker(coords, {
        radius: isActive ? 11 : 7,
        fillColor: color,
        color: isActive ? '#ffffff' : color,
        weight: isActive ? 3 : 1.5,
        opacity: 1,
        fillOpacity: isActive ? 0.95 : 0.75,
        interactive: true,
      });

      marker.bindTooltip(
        `<strong>${site.name}</strong><br/><small>${site.region} · ${site.group}</small>`,
        { direction: 'top', offset: [0, -6] },
      );

      marker.on('click', () => {
        onSelectSite?.(site.id);
      });

      marker.addTo(map);
      markersRef.current[site.id] = marker;
    });
  }, [sites, activeSiteId, onSelectSite]);

  // Smooth flyTo on active site selection
  useEffect(() => {
    const map = instance.current;
    if (!map || !activeSiteId) return;

    const coords = SITE_COORDINATES[activeSiteId];
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 4), { duration: 0.8 });
    }
  }, [activeSiteId]);

  return (
    <section className="pending-map interactive-atlas-map" aria-label="Earth map">
      <div ref={element} className="leaflet-atlas" aria-label="Interactive world coordinate grid" />
      <div className="active-map-legend">
        <span className="eyebrow">Earth Analog Atlas</span>
        <h2>Active Global Field Map</h2>
        <div className="map-legend-pills">
          <span className="pill featured">
            <i style={{ background: '#00e5ff' }} /> Featured (4)
          </span>
          <span className="pill benchmark">
            <i style={{ background: '#f59e0b' }} /> Benchmark (5)
          </span>
          <span className="pill control">
            <i style={{ background: '#10b981' }} /> Control (3)
          </span>
        </div>
        <small>Interactive CartoDB basemap with 12 approved analog coordinates</small>
      </div>
      <button
        className="secondary reset-map"
        onClick={() => instance.current?.setView([15, 20], 2)}
      >
        Reset map view
      </button>
    </section>
  );
}
