export type Category = 'Featured' | 'Benchmark' | 'Control';
export type RecordEntry = {
  id: string; name: string; body: 'Earth' | 'Moon' | 'Mars'; group: Category | null; region: string | null;
  coordinates: null; coordinate_status: 'PENDING_HUMAN_REVIEW'; coordinate_issue: string; decision: string;
  score: null; measurements: Record<string, { value: null; unit: null; source_id: null; status: 'MISSING' }>;
};
export type AtlasData = {
  schema_version: 'pending-display-v1'; register_status: string; register_sha256: string; register_sources: string[];
  sites: RecordEntry[]; targets: RecordEntry[];
  features: { id: string; label: string; unit: null; status: string; definition_source: string; limitations: string }[];
  sources: { name: string; body: string; variables: string; url: string; notes: string; status: string; provenance: string }[];
  gaps: string[]; scoring_status: 'NOT_COMPUTED'; policy: string;
};
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');
export function parseAtlas(v: unknown): AtlasData {
  const fail = (): never => { throw new Error('The atlas data failed validation. No scientific records have been displayed.'); };
  if (!object(v) || v.schema_version !== 'pending-display-v1' || v.scoring_status !== 'NOT_COMPUTED' ||
      typeof v.policy !== 'string' || typeof v.register_status !== 'string' || typeof v.register_sha256 !== 'string' ||
      !strings(v.register_sources) || !strings(v.gaps) || !Array.isArray(v.features) || v.features.length !== 8 ||
      !Array.isArray(v.sites) || v.sites.length !== 12 || !Array.isArray(v.targets) || v.targets.length !== 4 || !Array.isArray(v.sources)) return fail();
  const featureIds = new Set<string>();
  for (const f of v.features) {
    if (!object(f) || typeof f.id !== 'string' || featureIds.has(f.id) || typeof f.label !== 'string' ||
        typeof f.definition_source !== 'string' || typeof f.limitations !== 'string' || f.unit !== null || f.status !== 'PENDING_REVIEW') return fail();
    featureIds.add(f.id);
  }
  const ids = new Set<string>();
  for (const r of [...v.sites, ...v.targets]) {
    if (!object(r) || typeof r.id !== 'string' || ids.has(r.id) || typeof r.name !== 'string' ||
        !['Earth','Moon','Mars'].includes(String(r.body)) || (r.region !== null && typeof r.region !== 'string') ||
        typeof r.coordinate_issue !== 'string' || typeof r.decision !== 'string' || r.coordinates !== null ||
        r.coordinate_status !== 'PENDING_HUMAN_REVIEW' || r.score !== null || !object(r.measurements)) return fail();
    ids.add(r.id);
    if (Object.keys(r.measurements).length !== featureIds.size) return fail();
    for (const id of featureIds) {
      const m = r.measurements[id];
      if (!object(m) || m.value !== null || m.unit !== null || m.source_id !== null || m.status !== 'MISSING') return fail();
    }
  }
  if (v.sites.some(r => r.body !== 'Earth' || !['Featured','Benchmark','Control'].includes(r.group)) ||
      v.targets.some(r => !['Moon','Mars'].includes(r.body) || r.group !== null)) return fail();
  for (const s of v.sources) {
    if (!object(s) || !['name','body','variables','url','notes','status','provenance'].every(k => typeof s[k] === 'string') ||
        s.status !== 'CANDIDATE_NOT_APPROVED') return fail();
    try { if (new URL(s.url as string).protocol !== 'https:') return fail(); } catch { return fail(); }
  }
  // Narrowed at the untrusted JSON boundary; this release intentionally accepts pending records only.
  return v as unknown as AtlasData;
}
