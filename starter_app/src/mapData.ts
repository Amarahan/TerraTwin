/** Coordinates must come from an approved register; no UI fallback positions. */
export type MapSite = {
  id: string; name: string; group: string | null; region: string | null;
  coordinates: [number, number] | null; coordinate_status: string; candidate_coordinates?: [number,number];
};
export function approvedMapPosition(site: MapSite): [number, number] | null {
  const c = site.coordinates;
  if (site.coordinate_status !== 'APPROVED' || !c || c.length !== 2 ||
      !c.every(Number.isFinite) || Math.abs(c[0]) > 90 || Math.abs(c[1]) > 180) return null;
  return c;
}

/** Explicitly requested exploratory display. This never changes approved coordinates. */
export function displayMapPosition(site: MapSite): [number,number] | null {
 const approved=approvedMapPosition(site); if(approved)return approved;
 const c=site.candidate_coordinates;
 return site.coordinate_status==='PENDING_HUMAN_REVIEW' && c && c.length===2 && c.every(Number.isFinite) && Math.abs(c[0])<=90 && Math.abs(c[1])<=180 ? c : null;
}
