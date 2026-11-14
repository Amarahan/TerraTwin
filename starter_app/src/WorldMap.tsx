import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export function WorldMap() {
  const element = useRef<HTMLDivElement>(null);
  const instance = useRef<L.Map | null>(null);
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, { minZoom: 1, maxZoom: 5, scrollWheelZoom: false, attributionControl: false }).setView([0,0],1);
    instance.current = map;
    // Reference graticule only; no site geometry or spatial analysis.
    for (let lng=-180; lng<=180; lng+=30) L.polyline([[-80,lng],[80,lng]], {color:'#28516b',weight:1,interactive:false}).addTo(map);
    for (let lat=-60; lat<=60; lat+=30) L.polyline([[lat,-180],[lat,180]], {color:'#28516b',weight:1,interactive:false}).addTo(map);
    const observer=new ResizeObserver(()=>map.invalidateSize()); observer.observe(element.current);
    return ()=>{observer.disconnect();map.remove();instance.current=null;};
  }, []);
  return <section className="pending-map" aria-label="Earth map"><div ref={element} className="leaflet-atlas" aria-label="Interactive world coordinate grid"/><div className="map-pending-note"><span className="eyebrow">Earth atlas</span><h2>Geographic placement pending</h2><p>No site markers are shown until coordinates and representative geometries are approved.</p><small>Reference grid only · No site coverage or heatmap</small></div><button className="secondary reset-map" onClick={()=>instance.current?.setView([0,0],1)}>Reset map view</button></section>;
}
