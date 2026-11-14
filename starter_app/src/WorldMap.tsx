import { useEffect, useRef, useCallback } from 'react';
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

const MYANMAR_SITE_IDS = [
  'twin-taung-maar-crater',
  'letpadaung-monywa-copper-area',
  'mount-popa-central-dry-zone',
  'irrawaddy-delta-rice-fields',
];

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

  const focusGlobal = useCallback(() => {
    instance.current?.flyTo([20, 10], 2, { duration: 1.0 });
  }, []);

  const focusMyanmar = useCallback(() => {
    instance.current?.flyTo([21.0, 95.1], 7, { duration: 1.2 });
  }, []);

  const fitAll = useCallback(() => {
    const map = instance.current;
    if (!map || sites.length === 0) return;
    const coords = sites
      .map((s) => SITE_COORDINATES[s.id])
      .filter((c): c is [number, number] => Boolean(c));
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  }, [sites]);

  useEffect(() => {
    if (!element.current) return;

    const initialCenter: [number, number] = [20, 10];
    const initialZoom = 2;

    const map = L.map(element.current, {
      minZoom: 1,
      maxZoom: 18,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView(initialCenter, initialZoom);
    instance.current = map;

    // Standard OpenStreetMap tiles (reliable, free, universal, no API key required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Coordinate graticules for scientific context
    for (let lng = -180; lng <= 180; lng += 30) {
      L.polyline(
        [
          [-80, lng],
          [80, lng],
        ],
        { color: '#2b5070', weight: 1, opacity: 0.35, interactive: false },
      ).addTo(map);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      L.polyline(
        [
          [lat, -180],
          [lat, 180],
        ],
        { color: '#2b5070', weight: 1, opacity: 0.35, interactive: false },
      ).addTo(map);
    }

    // Comprehensive invalidateSize handling to ensure zero unrendered tiles
    const triggerInvalidate = () => {
      if (map && element.current) {
        map.invalidateSize();
      }
    };

    const timer1 = setTimeout(triggerInvalidate, 100);
    const timer2 = setTimeout(triggerInvalidate, 350);
    const timer3 = setTimeout(triggerInvalidate, 750);

    const observer = new ResizeObserver(triggerInvalidate);
    observer.observe(element.current);
    window.addEventListener('resize', triggerInvalidate);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', triggerInvalidate);
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
        radius: isActive ? 12 : 7,
        fillColor: color,
        color: isActive ? '#ffffff' : '#ffffff',
        weight: isActive ? 3.5 : 1.5,
        opacity: 1,
        fillOpacity: isActive ? 1.0 : 0.85,
        interactive: true,
      });

      marker.bindTooltip(
        `<strong>${site.name}</strong><br/><small>${site.region} · ${site.group}</small><br/><span style="color:#f2bd76;font-size:10px;">Provisional candidate coordinate: ${coords[0].toFixed(2)}°, ${coords[1].toFixed(2)}°</span>`,
        { direction: 'top', offset: [0, -6] },
      );

      marker.on('click', () => {
        onSelectSite?.(site.id);
        if (map.getZoom() < 5) {
          map.flyTo(coords, 5, { duration: 0.8 });
        }
      });

      marker.addTo(map);
      markersRef.current[site.id] = marker;
    });

    map.invalidateSize();
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

  const featuredCount = sites.filter((s) => s.group === 'Featured').length;
  const benchmarkCount = sites.filter((s) => s.group === 'Benchmark').length;
  const controlCount = sites.filter((s) => s.group === 'Control').length;

  return (
    <section className="pending-map interactive-atlas-map" aria-label="Earth map">
      <div ref={element} className="leaflet-atlas" aria-label="Interactive world coordinate grid" />

      {/* Floating HUD Legend */}
      <div className="active-map-legend">
        <span className="eyebrow">Earth Analog Atlas</span>
        <h2>Global Candidate Map</h2>
        <div className="map-legend-pills">
          <span className="pill featured">
            <i style={{ background: '#00e5ff' }} /> Featured ({featuredCount})
          </span>
          <span className="pill benchmark">
            <i style={{ background: '#f59e0b' }} /> Benchmark ({benchmarkCount})
          </span>
          <span className="pill control">
            <i style={{ background: '#10b981' }} /> Control ({controlCount})
          </span>
        </div>
        <small>{sites.length} provisional candidate locations plotted · Coordinates under review</small>
      </div>

      {/* Map Focus & Reset Toolbar */}
      <div className="map-toolbar-actions">
        <button
          className="map-tool-btn"
          onClick={focusMyanmar}
          title="Focus on Myanmar analog cluster"
        >
          Focus Myanmar ({sites.filter((s) => MYANMAR_SITE_IDS.includes(s.id)).length})
        </button>
        <button className="map-tool-btn" onClick={fitAll} title="Fit all visible candidates">
          Fit All Sites
        </button>
        <button className="secondary reset-map" onClick={focusGlobal}>
          Reset map view
        </button>
      </div>
    </section>
  );
}
