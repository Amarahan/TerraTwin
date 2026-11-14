import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { approvedMapPosition, displayMapPosition, type MapSite } from './mapData';

type Props = { sites?: MapSite[]; activeSiteId?: string; onSelectSite?: (id: string) => void };

export function WorldMap({ sites = [], activeSiteId, onSelectSite }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const instance = useRef<L.Map | null>(null);
  const tiles = useRef<L.TileLayer | null>(null);
  const [tileError, setTileError] = useState(false);
  const located = sites.filter(site => displayMapPosition(site) !== null);

  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, { minZoom: 1, maxZoom: 18, scrollWheelZoom: true }).setView([20, 10], 2);
    instance.current = map;
    const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.current = layer;
    layer.on('tileerror', () => setTileError(true));
    const resize = () => map.invalidateSize({ pan: false });
    const observer = new ResizeObserver(resize);
    observer.observe(element.current);
    resize();
    return () => { observer.disconnect(); map.remove(); instance.current = null; tiles.current = null; };
  }, []);

  useEffect(() => {
    const map = instance.current;
    if (!map) return;
    const markers = L.layerGroup().addTo(map);
    for (const site of sites) {
      const coordinates = displayMapPosition(site);
      if (!coordinates) continue;
      const active = site.id === activeSiteId;
      const color = site.group === 'Featured' ? '#00e5ff' : site.group === 'Benchmark' ? '#f59e0b' : '#10b981';
      const marker = L.circleMarker(coordinates, {
        dashArray: approvedMapPosition(site) ? undefined : '3 3', radius: active ? 11 : 7, fillColor: color, color: '#fff', weight: active ? 3 : 1.5, fillOpacity: .9,
      });
      const label = document.createElement('span');
      label.textContent = `${site.name} · ${site.region ?? ''} · ${site.group ?? ''} · ${approvedMapPosition(site) ? 'Approved location' : 'Provisional candidate location — not approved'}`;
      marker.bindTooltip(label, { direction: 'top', offset: [0, -6] });
      const select = () => onSelectSite?.(site.id);
      marker.on('click', select);
      marker.on('add', () => {
        const el = marker.getElement();
        el?.setAttribute('tabindex', '0'); el?.setAttribute('role', 'button');
        el?.setAttribute('aria-label', `Select ${site.name}${approvedMapPosition(site) ? '' : ' (provisional location)'}`);
        el?.setAttribute('aria-pressed', String(active));
        el?.addEventListener('keydown', event => {
          if (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); select();
          }
        });
      });
      marker.addTo(markers);
    }
    return () => { markers.remove(); };
  }, [sites, activeSiteId, onSelectSite]);

  // Display selection uses either approved or explicitly labelled provisional positions.
  const active = sites.find(site => site.id === activeSiteId);
  const coordinates = active ? displayMapPosition(active) : null;
  const latitude = coordinates?.[0], longitude = coordinates?.[1];
  useEffect(() => {
    const map = instance.current;
    if (map && latitude !== undefined && longitude !== undefined) {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), 4), { duration: .6 });
    }
  }, [activeSiteId, latitude, longitude]);

  function fitAll() {
    const positions = located.map(site => displayMapPosition(site)!);
    if (positions.length) instance.current?.fitBounds(L.latLngBounds(positions), { padding: [35,35], maxZoom: 6 });
  }

  return <section className="pending-map interactive-atlas-map" aria-label="Earth map">
    <div className="map-workspace-toolbar">
      <div><h2>Global Candidate Map</h2><small>{sites.length} candidates · {sites.filter(s=>approvedMapPosition(s)).length} approved · {located.filter(s=>!approvedMapPosition(s)).length} provisional placements</small></div>
      <div className="map-toolbar-actions" aria-label="Map controls">
        <button className="map-tool-btn" onClick={() => instance.current?.flyTo([21,95.1],7,{duration:.6})}
          title="Browse Myanmar; this view does not approve any site location">Focus Myanmar</button>
        <button className="map-tool-btn" onClick={fitAll} disabled={!located.length}
          title={located.length ? 'Fit displayed candidate positions; this does not approve geometry' : 'Candidate positions unavailable'}>Fit All Sites</button>
        <button className="map-tool-btn" onClick={() => instance.current?.flyTo([20,10],2,{duration:.6})}>Reset View</button>
      </div>
      <small className="map-review-note">{located.length ? 'Dashed markers: provisional candidate positions. Coordinate approval remains pending.' : 'Candidate positions unavailable. Basemap only.'}</small>
      {tileError && <div className="map-load-error" role="status">Some basemap tiles could not load. <button onClick={() => { setTileError(false); tiles.current?.redraw(); }}>Retry tiles</button></div>}
    </div>
    <div ref={element} className="leaflet-atlas" aria-label="Interactive Earth basemap" />
  </section>;
}
