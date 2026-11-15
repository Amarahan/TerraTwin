/**
 * TerraTwin — Candidate Scientific Dataset & Provenance
 *
 * Source: Ingested from master workbook `mee_lay_master_project_data(1).xlsx`
 * and expanded dataset `mee_lay_complete_analog_data_expanded.xlsx` (Codex pipeline).
 * LEGACY CANDIDATE RECORDS — NOT SCIENTIFIC APPROVAL.
 * Coordinate/measurement constants and normalization below remain unapproved.
 * Production views use contextual descriptions/images here. Exploratory calculations
 * read generated exploratory-model.json, with explicit assumptions and source-cell traceability.
 * Canonical scientific coordinates/measurements remain pending in atlas.json.
 */

export interface CandidateMeasurement {
  raw: number | string | null;
  displayValue: string;
  unit: string;
  sourceCitation: string;
  normalized: number | string | null;
}

export interface CandidateSiteData {
  id: string;
  name: string;
  group: 'Featured' | 'Benchmark' | 'Control';
  region: string;
  coordinates: [number, number];
  primaryLithology: string;
  rockCategory: string;
  iceStatus: string;
  iceIndex: number;
  features: {
    slope: CandidateMeasurement;
    roughness: CandidateMeasurement;
    temperature: CandidateMeasurement;
    dryness: CandidateMeasurement;
    vegetation: CandidateMeasurement;
    dust_wind: CandidateMeasurement;
    rock_mineral: CandidateMeasurement;
    water_ice: CandidateMeasurement;
  };
  images: {
    photo?: { url: string; title: string; caption: string; source: string };
    dem?: { url: string; title: string; caption: string; source: string };
    aster?: { url: string; title: string; caption: string; source: string };
  };
}


const assetUrl = (p: string): string => {
  const base = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${p.replace(/^\//, '')}`;
};

export interface TargetModelData {
  id: string;
  name: string;
  body: 'Moon' | 'Mars';
  coordinates: [number, number];
  missionContext: string;
  primaryLithology: string;
  rockCategory: string;
  iceStatus: string;
  iceIndex: number;
  features: {
    slope: CandidateMeasurement;
    roughness: CandidateMeasurement;
    temperature: CandidateMeasurement;
    dryness: CandidateMeasurement;
    vegetation: CandidateMeasurement;
    dust_wind: CandidateMeasurement;
    rock_mineral: CandidateMeasurement;
    water_ice: CandidateMeasurement;
  };
  images: {
    primary: { url: string; title: string; caption: string; source: string };
    secondary?: { url: string; title: string; caption: string; source: string };
    tertiary?: { url: string; title: string; caption: string; source: string };
  };
}

export const TARGET_MODELS: Record<string, TargetModelData> = {
  'shackleton-crater-rim': {
    id: 'shackleton-crater-rim',
    name: 'Shackleton Crater Rim',
    body: 'Moon',
    coordinates: [-89.9, 0.0],
    missionContext: 'Permanently shadowed lunar south pole cold trap; primary Artemis landing zone candidate.',
    primaryLithology: 'Anorthositic highland regolith and impactites',
    rockCategory: 'anorthosite',
    iceStatus: 'Up to ~22% regolith water-ice equivalent in interior cold traps (LOLA/LCROSS)',
    iceIndex: 0.70,
    features: {
      slope: { raw: 10.0, displayValue: '10.0°', unit: 'degrees', sourceCitation: 'NASA LRO LOLA DEM (Haruyama et al. 2008)', normalized: 10.0 / 30.0 },
      roughness: { raw: 25.0, displayValue: '25.0 m', unit: 'meters (~1km baseline)', sourceCitation: 'NASA LRO LOLA Surface Roughness Model', normalized: 25.0 / 80.0 },
      temperature: { raw: 190.0, displayValue: '190.0 K (40K–230K)', unit: 'Kelvin', sourceCitation: 'NASA LRO Diviner Thermal Radiometer', normalized: 190.0 / 200.0 },
      dryness: { raw: 0.0, displayValue: '0.0 mm/yr (Hyper-arid vacuum)', unit: 'mm/year', sourceCitation: 'Lunar Surface Environment Reference', normalized: 1.0 },
      vegetation: { raw: 0.0, displayValue: '0.00 (Sterile regolith)', unit: 'NDVI index', sourceCitation: 'Exobiology baseline', normalized: 0.0 },
      dust_wind: { raw: 0.05, displayValue: '0.05 (Surface exosphere)', unit: 'optical depth', sourceCitation: 'LADEE / LRO Lunar Dust Environment', normalized: 0.05 },
      rock_mineral: { raw: 'anorthosite', displayValue: 'Anorthositic highland regolith', unit: 'lithology category', sourceCitation: 'USGS LCROSS / Apollo highland samples', normalized: 'anorthosite' },
      water_ice: { raw: 0.70, displayValue: '0.70 (Confirmed cold-trap ice)', unit: 'ice presence index [0-1]', sourceCitation: 'NASA LRO LAMP / LEND hydrogen detection', normalized: 0.70 },
    },
    images: {
      primary: {
        url: assetUrl('images/moon/shackleton_lola_color_slope.png'),
        title: 'LOLA Topographic Slope Map',
        caption: 'Color-coded slope map from the Lunar Orbiter Laser Altimeter at 20 m resolution.',
        source: 'NASA LRO / LOLA Science Team',
      },
      secondary: {
        url: assetUrl('images/moon/shackleton_lola_color_hillshade.png'),
        title: 'LOLA Lunar Polar Shaded Relief',
        caption: 'Digital elevation shaded relief centered on the 89.9°S rim.',
        source: 'NASA / GSFC / PDS Geosciences',
      },
    },
  },
  'malapert-massif': {
    id: 'malapert-massif',
    name: 'Malapert Massif',
    body: 'Moon',
    coordinates: [-86.0, 0.0],
    missionContext: 'High-altitude lunar south pole peak offering near-continuous solar illumination and Earth line-of-sight.',
    primaryLithology: 'Anorthosite and impact melt breccia',
    rockCategory: 'anorthosite',
    iceStatus: 'Localized cold traps in deep adjacent valleys (Diviner/LOLA)',
    iceIndex: 0.20,
    features: {
      slope: { raw: 17.5, displayValue: '17.5°', unit: 'degrees', sourceCitation: 'NASA LRO LOLA / LROC DEM', normalized: 17.5 / 30.0 },
      roughness: { raw: 40.0, displayValue: '40.0 m', unit: 'meters (~1km baseline)', sourceCitation: 'NASA LRO LOLA Roughness Assessment', normalized: 40.0 / 80.0 },
      temperature: { raw: 200.0, displayValue: '200.0 K (100K–300K)', unit: 'Kelvin', sourceCitation: 'NASA LRO Diviner Lunar Data', normalized: 200.0 / 200.0 },
      dryness: { raw: 0.0, displayValue: '0.0 mm/yr (Vacuum)', unit: 'mm/year', sourceCitation: 'Lunar environment reference', normalized: 1.0 },
      vegetation: { raw: 0.0, displayValue: '0.00 (Sterile regolith)', unit: 'NDVI index', sourceCitation: 'Exobiology baseline', normalized: 0.0 },
      dust_wind: { raw: 0.05, displayValue: '0.05 (Surface exosphere)', unit: 'optical depth', sourceCitation: 'LADEE dust sensor measurements', normalized: 0.05 },
      rock_mineral: { raw: 'anorthosite', displayValue: 'Anorthosite / impact breccia', unit: 'lithology category', sourceCitation: 'NASA LRO LROC Multi-spectral mapping', normalized: 'anorthosite' },
      water_ice: { raw: 0.20, displayValue: '0.20 (Low to moderate cold trap potential)', unit: 'ice presence index [0-1]', sourceCitation: 'NASA LRO Diviner & Mini-RF radar', normalized: 0.20 },
    },
    images: {
      primary: {
        url: assetUrl('images/moon/malapert_lola_color_slope.png'),
        title: 'LOLA Slope Gradient Model',
        caption: 'High-resolution slope classification of the massif summit and steep flanks.',
        source: 'NASA LRO LOLA Team / PDS',
      },
      secondary: {
        url: assetUrl('images/moon/malapert_lroc_dem_slope.png'),
        title: 'LROC NAC Stereo DEM Analysis',
        caption: 'High-detail surface slope extracted from Narrow Angle Camera stereo imagery.',
        source: 'NASA / Arizona State University (ASU)',
      },
      tertiary: {
        url: assetUrl('images/moon/malapert_lola_color_hillshade.png'),
        title: 'LOLA Color Shaded Relief',
        caption: 'Elevation-tinted relief illustrating communications visibility toward Earth.',
        source: 'NASA GSFC / LRO Team',
      },
    },
  },
  'jezero-crater': {
    id: 'jezero-crater',
    name: 'Jezero Crater',
    body: 'Mars',
    coordinates: [18.4, 77.5],
    missionContext: 'Ancient paleolake delta system with preserved lacustrine sediments; NASA Perseverance rover landing site.',
    primaryLithology: 'Carbonates, smectite clays, and olivine-bearing basaltic delta sands',
    rockCategory: 'carbonate',
    iceStatus: 'Low equatorial subsurface water equivalent hydrogen (~0.05-0.10)',
    iceIndex: 0.10,
    features: {
      slope: { raw: 5.0, displayValue: '5.0°', unit: 'degrees', sourceCitation: 'NASA MGS MOLA / Mars Express HRSC', normalized: 5.0 / 30.0 },
      roughness: { raw: 15.0, displayValue: '15.0 m', unit: 'meters (~1km baseline)', sourceCitation: 'MOLA Surface Roughness Grid', normalized: 15.0 / 80.0 },
      temperature: { raw: 125.0, displayValue: '125.0 K (150K–275K)', unit: 'Kelvin', sourceCitation: 'Mars Global Surveyor TES Surface Temperature', normalized: 125.0 / 200.0 },
      dryness: { raw: 0.0, displayValue: '0.0 mm/yr (Hyper-arid desert)', unit: 'mm/year', sourceCitation: 'Mars Climate Database (MCD)', normalized: 1.0 },
      vegetation: { raw: 0.0, displayValue: '0.00 (Biotic absence)', unit: 'NDVI index', sourceCitation: 'Astrobiology reference', normalized: 0.0 },
      dust_wind: { raw: 0.55, displayValue: '0.55 (AOD 0.3–0.8)', unit: 'optical depth (9 µm)', sourceCitation: 'NASA MGS TES Dust Optical Depth', normalized: 0.55 },
      rock_mineral: { raw: 'carbonate', displayValue: 'Smectite clays & Mg-carbonates', unit: 'lithology category', sourceCitation: 'NASA MRO CRISM (Ehlmann et al. 2008)', normalized: 'carbonate' },
      water_ice: { raw: 0.10, displayValue: '0.10 (Hydrated mineral matrix)', unit: 'ice presence index [0-1]', sourceCitation: 'Mars Odyssey GRS Subsurface Hydrogen', normalized: 0.10 },
    },
    images: {
      primary: {
        url: assetUrl('images/mars/jezero_hirise_global_mosaic.png'),
        title: 'HiRISE Delta System Mosaic',
        caption: '0.25 m/pixel color mosaic showing ancient river delta deposits and lakebed sediment.',
        source: 'NASA / JPL-Caltech / Univ. of Arizona',
      },
      secondary: {
        url: assetUrl('images/mars/jezero_ctx_global_mosaic.png'),
        title: 'Context Camera (CTX) Overview',
        caption: '6 m/pixel regional context mosaic of the Jezero impact basin and Western Delta.',
        source: 'NASA / JPL / MSSS',
      },
      tertiary: {
        url: assetUrl('images/mars/jezero_tes_dust.png'),
        title: 'MGS TES Dust Index Map',
        caption: 'Thermal Emission Spectrometer atmospheric aerosol and dust opacity mapping.',
        source: 'NASA MGS TES Team / ASU',
      },
    },
  },
  'meridiani-planum': {
    id: 'meridiani-planum',
    name: 'Meridiani Planum',
    body: 'Mars',
    coordinates: [-1.9, 354.5],
    missionContext: 'Equatorial smooth hematite and sulfate plain; landing site of NASA Mars Exploration Rover Opportunity.',
    primaryLithology: 'Sulfate evaporites (jarosite), hematite spherules, and basaltic sand',
    rockCategory: 'evaporite',
    iceStatus: 'Hyper-dry equatorial regolith; no near-surface ground ice',
    iceIndex: 0.05,
    features: {
      slope: { raw: 1.5, displayValue: '1.5°', unit: 'degrees', sourceCitation: 'NASA MGS MOLA Precision Altimetry', normalized: 1.5 / 30.0 },
      roughness: { raw: 8.0, displayValue: '8.0 m', unit: 'meters (~1km baseline)', sourceCitation: 'MOLA Regional Topographic Variance', normalized: 8.0 / 80.0 },
      temperature: { raw: 120.0, displayValue: '120.0 K (160K–280K)', unit: 'Kelvin', sourceCitation: 'NASA MGS TES / Opportunity Mini-TES', normalized: 120.0 / 200.0 },
      dryness: { raw: 0.0, displayValue: '0.0 mm/yr (Hyper-arid)', unit: 'mm/year', sourceCitation: 'Mars Atmospheric Model', normalized: 1.0 },
      vegetation: { raw: 0.0, displayValue: '0.00 (Biotic absence)', unit: 'NDVI index', sourceCitation: 'Astrobiology reference', normalized: 0.0 },
      dust_wind: { raw: 0.50, displayValue: '0.50 (AOD 0.3–0.7)', unit: 'optical depth (9 µm)', sourceCitation: 'NASA MGS TES Dust Product', normalized: 0.50 },
      rock_mineral: { raw: 'evaporite', displayValue: 'Polyhydrated sulfates & jarosite', unit: 'lithology category', sourceCitation: 'NASA Opportunity Rover APXS & Mössbauer', normalized: 'evaporite' },
      water_ice: { raw: 0.05, displayValue: '0.05 (Negligible equatorial ice)', unit: 'ice presence index [0-1]', sourceCitation: 'Mars Odyssey Neutron Spectrometer', normalized: 0.05 },
    },
    images: {
      primary: {
        url: assetUrl('images/mars/mola_global_tile.jpg'),
        title: 'MOLA Topographic Relief Tile',
        caption: 'Global elevation tile depicting the smooth, low-gradient expanse of Meridiani Planum.',
        source: 'NASA MGS MOLA Science Team / USGS',
      },
      secondary: {
        url: assetUrl('images/mars/jezero_mola_roughness.png'),
        title: 'MOLA Regional Roughness Distribution',
        caption: 'Topographic variance profile illustrating low surface obstacle density.',
        source: 'NASA PDS Geosciences Node',
      },
    },
  },
};

export const CANDIDATE_SITES: Record<string, CandidateSiteData> = {
  'atacama-desert': {
    id: 'atacama-desert',
    name: 'Atacama Desert',
    group: 'Benchmark',
    region: 'Antofagasta / Tarapacá, Chile',
    coordinates: [-23.86, -69.13],
    primaryLithology: 'Evaporites, ignimbrites, alluvial gravels, and salt flats',
    rockCategory: 'evaporite',
    iceStatus: 'No widespread permafrost; localized high-altitude ground ice',
    iceIndex: 0.05,
    features: {
      slope: { raw: 4.8518, displayValue: '4.85°', unit: 'degrees', sourceCitation: 'NASA SRTM 30m Global DEM (S24W070)', normalized: 4.8518 / 30.0 },
      roughness: { raw: 20.7992, displayValue: '20.80 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 20.7992 / 80.0 },
      temperature: { raw: 32.8816, displayValue: '32.88 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS Terra/Aqua Land Surface Temp', normalized: 32.8816 / 200.0 },
      dryness: { raw: 3.4481, displayValue: '3.45 mm/yr (Hyper-arid)', unit: 'mm/year', sourceCitation: 'ECMWF ERA5 / CHIRPS Precipitation', normalized: Math.max(0, 1.0 - 3.4481 / 2500.0) },
      vegetation: { raw: 0.0978, displayValue: '0.098 (Barren hyper-arid)', unit: 'NDVI index', sourceCitation: 'NASA MODIS MOD13A2 Vegetation Index', normalized: 0.0978 },
      dust_wind: { raw: 0.1300, displayValue: '0.130 (Mineral dust proxy)', unit: 'AOD 550nm', sourceCitation: 'NASA MODIS MCD19A2 MAIAC Aerosol', normalized: 0.1300 },
      rock_mineral: { raw: 'evaporite', displayValue: 'Evaporites, halite & gypsiferous salts', unit: 'lithology category', sourceCitation: 'NASA Analog Research / SERNAGEOMIN Chile', normalized: 'evaporite' },
      water_ice: { raw: 0.05, displayValue: '0.05 (Negligible surface ice)', unit: 'ice presence index [0-1]', sourceCitation: 'Planetary Analog Soil Mapping', normalized: 0.05 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/atacama_true_color.jpg'),
        title: 'Copernicus / USGS True-Color Satellite Browse',
        caption: 'Optical satellite imagery showing hyperarid salt flats and alluvial plains.',
        source: 'Copernicus Sentinel / USGS Landsat',
      },
      dem: {
        url: assetUrl('images/earth/S24W070.SRTMGL1.2.jpg'),
        title: 'NASA SRTM 30m Global Elevation Model',
        caption: 'Shuttle Radar Topography Mission tile S24W070 at 1-arcsecond resolution.',
        source: 'NASA JPL / USGS LP DAAC',
      },
      aster: {
        url: assetUrl('images/earth/ASTGTMV003_S24W070.1.jpg'),
        title: 'ASTER Global DEM v003 Tile',
        caption: 'Terra ASTER optical stereo digital elevation model of the Atacama basin.',
        source: 'NASA / METI / LP DAAC',
      },
    },
  },
  'death-valley': {
    id: 'death-valley',
    name: 'Death Valley',
    group: 'Benchmark',
    region: 'California / Nevada, USA',
    coordinates: [36.53, -116.93],
    primaryLithology: 'Alluvial fans, playa evaporites, carbonate rocks, and basaltic cinder cones',
    rockCategory: 'evaporite',
    iceStatus: 'No permafrost in valley floor; localized frost at high elevations',
    iceIndex: 0.0,
    features: {
      slope: { raw: 4.0577, displayValue: '4.06°', unit: 'degrees', sourceCitation: 'NASA SRTM 1-arcsecond DEM (N36W117)', normalized: 4.0577 / 30.0 },
      roughness: { raw: 17.7016, displayValue: '17.70 m', unit: 'meters', sourceCitation: 'SRTM Topographic Variance Grid', normalized: 17.7016 / 80.0 },
      temperature: { raw: 16.8976, displayValue: '16.90 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS Land Surface Temperature', normalized: 16.8976 / 200.0 },
      dryness: { raw: 116.8918, displayValue: '116.89 mm/yr (Arid)', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis Precipitation', normalized: Math.max(0, 1.0 - 116.8918 / 2500.0) },
      vegetation: { raw: 0.0738, displayValue: '0.074 (Sparse desert scrub)', unit: 'NDVI index', sourceCitation: 'NASA MODIS 16-Day NDVI', normalized: 0.0738 },
      dust_wind: { raw: 0.1522, displayValue: '0.152 (Playa dust & aerosol)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC High-Res Aerosol Depth', normalized: 0.1522 },
      rock_mineral: { raw: 'evaporite', displayValue: 'Playa evaporites, borates & carbonates', unit: 'lithology category', sourceCitation: 'USGS Death Valley Geological Map', normalized: 'evaporite' },
      water_ice: { raw: 0.0, displayValue: '0.00 (Zero ground ice)', unit: 'ice presence index [0-1]', sourceCitation: 'US National Park Service Climate Data', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/death_valley_true_color.jpg'),
        title: 'Landsat / Sentinel True-Color Browse',
        caption: 'True-color optical satellite imagery of Badwater Basin and alluvial fans.',
        source: 'USGS / NASA Earthdata',
      },
      dem: {
        url: assetUrl('images/earth/death_valley_aster_dem.jpg'),
        title: 'ASTER Digital Elevation Model',
        caption: 'Digital elevation relief depicting below-sea-level basin floor (-86 m) and Panamint Range.',
        source: 'NASA / METI / LP DAAC',
      },
      aster: {
        url: assetUrl('images/earth/N36W117.SRTMGL1.2.jpg'),
        title: 'NASA SRTM 1-Arcsecond Global DEM',
        caption: 'Radar interferometer elevation tile N36W117 covering Death Valley.',
        source: 'NASA JPL / USGS',
      },
    },
  },
  'haughton-crater': {
    id: 'haughton-crater',
    name: 'Haughton Crater',
    group: 'Benchmark',
    region: 'Devon Island, Nunavut, Canada',
    coordinates: [75.37, -89.68],
    primaryLithology: 'Impact breccia, shocked dolomite, limestone, and shatter cones',
    rockCategory: 'impact_breccia',
    iceStatus: 'Continuous permafrost; seasonal active-layer thaw and extensive ground ice',
    iceIndex: 0.90,
    features: {
      slope: { raw: 4.0115, displayValue: '4.01°', unit: 'degrees', sourceCitation: 'ArcticDEM / ASTER Elevation Model', normalized: 4.0115 / 30.0 },
      roughness: { raw: 16.2928, displayValue: '16.29 m', unit: 'meters', sourceCitation: 'High-Latitude Roughness Extraction', normalized: 16.2928 / 80.0 },
      temperature: { raw: 2.1245, displayValue: '2.12 K (diurnal contrast; Polar cold)', unit: 'Kelvin', sourceCitation: 'NASA MODIS Cold-Season LST', normalized: 2.1245 / 200.0 },
      dryness: { raw: 255.9516, displayValue: '255.95 mm/yr (Polar desert)', unit: 'mm/year', sourceCitation: 'ERA5 High-Latitude Climate Model', normalized: Math.max(0, 1.0 - 255.9516 / 2500.0) },
      vegetation: { raw: 0.0190, displayValue: '0.019 (High Arctic polar desert)', unit: 'NDVI index', sourceCitation: 'NASA MODIS Arctic Vegetation Mask', normalized: 0.0190 },
      dust_wind: { raw: 0.1562, displayValue: '0.156 (Arctic haze proxy)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC Arctic Aerosol Observation', normalized: 0.1562 },
      rock_mineral: { raw: 'impact_breccia', displayValue: 'Impact breccia & shocked dolomite', unit: 'lithology category', sourceCitation: 'NASA Haughton-Mars Project / GSC Canada', normalized: 'impact_breccia' },
      water_ice: { raw: 0.90, displayValue: '0.90 (Continuous permafrost & ice wedges)', unit: 'ice presence index [0-1]', sourceCitation: 'Geological Survey of Canada Arctic Permafrost Atlas', normalized: 0.90 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/haughton_true_color.jpg'),
        title: 'NASA Haughton-Mars Project Satellite Browse',
        caption: 'High-latitude optical satellite view of the 23-km Haughton impact structure on Devon Island.',
        source: 'NASA HMP / Copernicus Sentinel',
      },
      dem: {
        url: assetUrl('images/earth/haughton_aster_dem.jpg'),
        title: 'ASTER Digital Elevation Model',
        caption: 'Elevation relief highlighting the eroded rim and central uplift features.',
        source: 'NASA / METI / LP DAAC',
      },
      aster: {
        url: assetUrl('images/earth/ASTGTMV003_N75W090.1.jpg'),
        title: 'ASTER GDEM v3 High-Latitude Tile',
        caption: 'Granule ASTGTMV003_N75W090 covering eastern Devon Island.',
        source: 'NASA / METI',
      },
    },
  },
  'mcmurdo-dry-valleys': {
    id: 'mcmurdo-dry-valleys',
    name: 'McMurdo Dry Valleys',
    group: 'Benchmark',
    region: 'Victoria Land, Antarctica',
    coordinates: [-77.5, 162.5],
    primaryLithology: 'Basaltic volcanic rocks, dolerite sills, sandstone, and glacial moraines',
    rockCategory: 'basalt',
    iceStatus: 'Continuous permafrost; ice-cemented ground, perennially frozen lakes, and glaciers',
    iceIndex: 1.00,
    features: {
      slope: { raw: 15.8622, displayValue: '15.86°', unit: 'degrees', sourceCitation: 'REMA / CryoSat Antarctic DEM', normalized: 15.8622 / 30.0 },
      roughness: { raw: 73.2172, displayValue: '73.22 m', unit: 'meters', sourceCitation: 'Antarctic High-Relief Roughness Grid', normalized: 73.2172 / 80.0 },
      temperature: { raw: 1.1697, displayValue: '1.17 K (polar day/night contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS Antarctic LST Composite', normalized: 1.1697 / 200.0 },
      dryness: { raw: 45.4870, displayValue: '45.49 mm/yr (Hyper-arid polar cold)', unit: 'mm/year', sourceCitation: 'ERA5 High-Latitude Climate Reanalysis', normalized: Math.max(0, 1.0 - 45.4870 / 2500.0) },
      vegetation: { raw: 0.0, displayValue: '0.00 (Biotic absence / Ice-free desert)', unit: 'NDVI index', sourceCitation: 'US Antarctic Program Long-Term Research', normalized: 0.0 },
      dust_wind: { raw: 0.1428, displayValue: '0.143 (Katabatic wind mineral dust)', unit: 'AOD 550nm', sourceCitation: 'NASA AERONET / MAIAC Antarctic Stations', normalized: 0.1428 },
      rock_mineral: { raw: 'basalt', displayValue: 'Ferrar dolerite & Beacon sandstone', unit: 'lithology category', sourceCitation: 'USAP Antarctic Geological Survey', normalized: 'basalt' },
      water_ice: { raw: 1.00, displayValue: '1.00 (Permanent ice-cemented permafrost)', unit: 'ice presence index [0-1]', sourceCitation: 'National Science Foundation USAP Science Records', normalized: 1.00 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/mcmurdo-dry-valleys.jpg'),
        title: 'McMurdo Dry Valleys Terrain',
        caption: 'Ice-free polar desert landscape of Victoria Land, Antarctica.',
        source: 'Attribution pending review',
      },
    },
  },
  'twin-taung-maar-crater': {
    id: 'twin-taung-maar-crater',
    name: 'Twin Taung Maar Crater',
    group: 'Featured',
    region: 'Sagaing Region, Myanmar',
    coordinates: [22.37056, 95.01861],
    primaryLithology: 'Basaltic-andesite volcanic rocks, weathered tuff, and scoria',
    rockCategory: 'basalt',
    iceStatus: 'No permafrost; tropical seasonal monsoonal weathering',
    iceIndex: 0.0,
    features: {
      slope: { raw: 1.0906, displayValue: '1.09°', unit: 'degrees', sourceCitation: 'SRTM / ALOS AW3D30 Elevation Model', normalized: 1.0906 / 30.0 },
      roughness: { raw: 4.5155, displayValue: '4.52 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 4.5155 / 80.0 },
      temperature: { raw: 13.4528, displayValue: '13.45 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS Land Surface Temp', normalized: 13.4528 / 200.0 },
      dryness: { raw: 751.7461, displayValue: '751.75 mm/yr (Dry Zone precipitation)', unit: 'mm/year', sourceCitation: 'ECMWF ERA5 / CHIRPS Precipitation', normalized: Math.max(0, 1.0 - 751.7461 / 2500.0) },
      vegetation: { raw: 0.3770, displayValue: '0.377 (Dry zone scrub & farmland)', unit: 'NDVI index', sourceCitation: 'NASA MODIS 16-Day NDVI', normalized: 0.3770 },
      dust_wind: { raw: 0.3112, displayValue: '0.311 (Aerosol optical depth)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC MCD19A2 Aerosol', normalized: 0.3112 },
      rock_mineral: { raw: 'basalt', displayValue: 'Basaltic-andesite volcanic tuff', unit: 'lithology category', sourceCitation: 'Smithsonian GVP no. 275090 / Lithos 2016', normalized: 'basalt' },
      water_ice: { raw: 0.0, displayValue: '0.00 (Tropical zero ground ice)', unit: 'ice presence index [0-1]', sourceCitation: 'Regional climate mapping', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('assets/featured/twin-taung.jpg'),
        title: 'Twin Taung Maar Crater Lake',
        caption: 'Explosive basaltic maar crater lake surrounded by volcanic tephra rings.',
        source: 'Regional Geological Survey / Ground Observation',
      },
    },
  },
  'letpadaung-monywa-copper-area': {
    id: 'letpadaung-monywa-copper-area',
    name: 'Letpadaung / Monywa Copper Area',
    group: 'Featured',
    region: 'Sagaing Region, Myanmar',
    coordinates: [22.1, 95.1],
    primaryLithology: 'Porphyry copper system, hydrothermal alteration, andesite, and granodiorite',
    rockCategory: 'volcanic_mafic',
    iceStatus: 'No permafrost; warm tropical soils',
    iceIndex: 0.0,
    features: {
      slope: { raw: 1.5022, displayValue: '1.50°', unit: 'degrees', sourceCitation: 'SRTM Elevation Model', normalized: 1.5022 / 30.0 },
      roughness: { raw: 6.3532, displayValue: '6.35 m', unit: 'meters', sourceCitation: 'SRTM Topographic Window', normalized: 6.3532 / 80.0 },
      temperature: { raw: 12.3336, displayValue: '12.33 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 12.3336 / 200.0 },
      dryness: { raw: 762.1584, displayValue: '762.16 mm/yr', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 762.1584 / 2500.0) },
      vegetation: { raw: 0.3874, displayValue: '0.387 (Exposed soil & open pit)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.3874 },
      dust_wind: { raw: 0.3127, displayValue: '0.313 (Mineral dust & quarrying)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.3127 },
      rock_mineral: { raw: 'volcanic_mafic', displayValue: 'Hydrothermal copper porphyry & andesite', unit: 'lithology category', sourceCitation: 'Myanmar Copper Belt Studies', normalized: 'volcanic_mafic' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Regional climate mapping', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('assets/featured/letpadaung.jpg'),
        title: 'Letpadaung Hydrothermal Open Pit',
        caption: 'Open-pit exposure of hydrothermally altered volcanic rocks and copper mineralization.',
        source: 'Regional Geological Survey / Mining Survey',
      },
    },
  },
  'mount-popa-central-dry-zone': {
    id: 'mount-popa-central-dry-zone',
    name: 'Mount Popa / Central Dry Zone',
    group: 'Featured',
    region: 'Mandalay Region, Myanmar',
    coordinates: [20.92, 95.25],
    primaryLithology: 'Basaltic-andesite lava, scoria, volcanic ash, and altered volcanic neck',
    rockCategory: 'basalt',
    iceStatus: 'No permafrost; tropical volcanic soils',
    iceIndex: 0.0,
    features: {
      slope: { raw: 4.6190, displayValue: '4.62°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 4.6190 / 30.0 },
      roughness: { raw: 20.2080, displayValue: '20.21 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 20.2080 / 80.0 },
      temperature: { raw: 11.2280, displayValue: '11.23 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 11.2280 / 200.0 },
      dryness: { raw: 1014.6628, displayValue: '1014.66 mm/yr', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 1014.6628 / 2500.0) },
      vegetation: { raw: 0.5373, displayValue: '0.537 (Vegetated volcanic flanks)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.5373 },
      dust_wind: { raw: 0.2532, displayValue: '0.253 (Aerosol optical depth)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.2532 },
      rock_mineral: { raw: 'basalt', displayValue: 'Basaltic-andesite lava & volcanic scoria', unit: 'lithology category', sourceCitation: 'Mount Popa Volcanology Surveys', normalized: 'basalt' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Regional climate mapping', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('assets/featured/mount-popa.jpg'),
        title: 'Mount Popa Volcanic Complex',
        caption: 'Conical volcanic plug and lava flows rising above the Myanmar central dry zone.',
        source: 'Regional Geological Survey / Ground Observation',
      },
    },
  },
  'kawah-ijen': {
    id: 'kawah-ijen',
    name: 'Kawah Ijen',
    group: 'Benchmark',
    region: 'East Java, Indonesia',
    coordinates: [-8.058, 114.242],
    primaryLithology: 'Sulfur-rich crater lake deposits, andesite, and hydrothermal alteration',
    rockCategory: 'volcanic_mafic',
    iceStatus: 'No permafrost; humid tropical volcanic environment',
    iceIndex: 0.0,
    features: {
      slope: { raw: 11.6468, displayValue: '11.65°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 11.6468 / 30.0 },
      roughness: { raw: 51.9491, displayValue: '51.95 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 51.9491 / 80.0 },
      temperature: { raw: 8.1847, displayValue: '8.18 K', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 8.1847 / 200.0 },
      dryness: { raw: 2282.7552, displayValue: '2282.76 mm/yr (Humid monsoonal)', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 2282.7552 / 2500.0) },
      vegetation: { raw: 0.6869, displayValue: '0.687 (Tropical rainforest flanks)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.6869 },
      dust_wind: { raw: 0.1080, displayValue: '0.108 (Volcanic sulfur / aerosol)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.1080 },
      rock_mineral: { raw: 'volcanic_mafic', displayValue: 'Sulfur-rich volcanic & hydrothermal deposits', unit: 'lithology category', sourceCitation: 'Indonesian Volcanology Survey', normalized: 'volcanic_mafic' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Tropical climate baseline', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('assets/featured/kawah-ijen.jpg'),
        title: 'Kawah Ijen Crater & Acid Lake',
        caption: 'Active sulfuric crater lake with extreme acid hydrothermal activity and solfatara deposits.',
        source: 'Ground Observation / Geological Survey',
      },
    },
  },
  'lonar-crater': {
    id: 'lonar-crater',
    name: 'Lonar Crater',
    group: 'Benchmark',
    region: 'Maharashtra, India',
    coordinates: [19.976, 76.507],
    primaryLithology: 'Basaltic impact breccia, Deccan flood basalt, and saline-alkaline lake sediments',
    rockCategory: 'impact_breccia',
    iceStatus: 'No permafrost; tropical/subtropical setting',
    iceIndex: 0.0,
    features: {
      slope: { raw: 1.2612, displayValue: '1.26°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 1.2612 / 30.0 },
      roughness: { raw: 5.3491, displayValue: '5.35 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 5.3491 / 80.0 },
      temperature: { raw: 15.6197, displayValue: '15.62 K', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 15.6197 / 200.0 },
      dryness: { raw: 1155.3968, displayValue: '1155.40 mm/yr', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 1155.3968 / 2500.0) },
      vegetation: { raw: 0.4367, displayValue: '0.437', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.4367 },
      dust_wind: { raw: 0.5086, displayValue: '0.509 (Subcontinental aerosol proxy)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.5086 },
      rock_mineral: { raw: 'impact_breccia', displayValue: 'Deccan basaltic impact breccia', unit: 'lithology category', sourceCitation: 'Lonar Impact Crater Studies', normalized: 'impact_breccia' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Subtropical climate baseline', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/lonar-crater.jpg'),
        title: 'Lonar Crater Lake',
        caption: 'Saline-alkaline crater lake formed in Deccan basalt by meteorite impact.',
        source: 'Attribution pending review',
      },
    },
  },
  'amazon-rainforest': {
    id: 'amazon-rainforest',
    name: 'Amazon Rainforest',
    group: 'Control',
    region: 'Amazonas, Brazil',
    coordinates: [-3.465, -62.215],
    primaryLithology: 'Lateritic soils, deeply weathered crystalline rocks, and alluvial river silt',
    rockCategory: 'sedimentary_clastic',
    iceStatus: 'No permafrost; humid tropical rainforest',
    iceIndex: 0.0,
    features: {
      slope: { raw: 2.7002, displayValue: '2.70°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 2.7002 / 30.0 },
      roughness: { raw: 10.5864, displayValue: '10.59 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 10.5864 / 80.0 },
      temperature: { raw: 7.9448, displayValue: '7.94 K (diurnal contrast)', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 7.9448 / 200.0 },
      dryness: { raw: 2529.2402, displayValue: '2529.24 mm/yr (Hyper-wet tropical)', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: 0.0 },
      vegetation: { raw: 0.5424, displayValue: '0.542 (Dense equatorial canopy)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.5424 },
      dust_wind: { raw: 0.2240, displayValue: '0.224 (Biogenic aerosol proxy)', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.2240 },
      rock_mineral: { raw: 'sedimentary_clastic', displayValue: 'Deeply weathered lateritic sediments', unit: 'lithology category', sourceCitation: 'CPRM Brazilian Geological Survey', normalized: 'sedimentary_clastic' },
      water_ice: { raw: 0.0, displayValue: '0.00 (Zero ground ice)', unit: 'ice presence index [0-1]', sourceCitation: 'Tropical climate baseline', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/amazon-rainforest.jpg'),
        title: 'Amazon Rainforest Canopy',
        caption: 'Dense equatorial rainforest canopy of the Amazon Basin, Amazonas, Brazil.',
        source: 'Attribution pending review',
      },
    },
  },
  'congo-basin': {
    id: 'congo-basin',
    name: 'Congo Basin',
    group: 'Control',
    region: 'Democratic Republic of the Congo',
    coordinates: [0.0, 21.75],
    primaryLithology: 'Lateritic ferralsols, sandstone, and Precambrian basement',
    rockCategory: 'sandstone',
    iceStatus: 'No permafrost; humid tropical basin',
    iceIndex: 0.0,
    features: {
      slope: { raw: 2.8412, displayValue: '2.84°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 2.8412 / 30.0 },
      roughness: { raw: 11.8420, displayValue: '11.84 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 11.8420 / 80.0 },
      temperature: { raw: 5.6633, displayValue: '5.66 K', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 5.6633 / 200.0 },
      dryness: { raw: 1240.3933, displayValue: '1240.39 mm/yr (Wet tropical)', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 1240.3933 / 2500.0) },
      vegetation: { raw: 0.7887, displayValue: '0.789 (High-density rainforest canopy)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.7887 },
      dust_wind: { raw: 0.2844, displayValue: '0.284', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.2844 },
      rock_mineral: { raw: 'sandstone', displayValue: 'Ferralsols & cratonic sandstone', unit: 'lithology category', sourceCitation: 'Central African Geological Mapping', normalized: 'sandstone' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Tropical climate baseline', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/congo-basin.jpg'),
        title: 'Congo Basin Rainforest',
        caption: 'Dense tropical forest canopy and river drainage of the Congo Basin, DR Congo.',
        source: 'Attribution pending review',
      },
    },
  },
  'irrawaddy-delta-rice-fields': {
    id: 'irrawaddy-delta-rice-fields',
    name: 'Irrawaddy Delta rice fields',
    group: 'Control',
    region: 'Ayeyarwady Region, Myanmar',
    coordinates: [16.5, 95.0],
    primaryLithology: 'Alluvial sand, silt, marine clay, and monsoonal delta sediment',
    rockCategory: 'sedimentary_clastic',
    iceStatus: 'No permafrost; tropical monsoonal delta',
    iceIndex: 0.0,
    features: {
      slope: { raw: 0.1629, displayValue: '0.16°', unit: 'degrees', sourceCitation: 'SRTM 30m Global DEM', normalized: 0.1629 / 30.0 },
      roughness: { raw: 0.6635, displayValue: '0.66 m', unit: 'meters', sourceCitation: 'SRTM Local Roughness Window', normalized: 0.6635 / 80.0 },
      temperature: { raw: 8.8623, displayValue: '8.86 K', unit: 'Kelvin', sourceCitation: 'NASA MODIS LST', normalized: 8.8623 / 200.0 },
      dryness: { raw: 2356.1763, displayValue: '2356.18 mm/yr (Monsoonal wetland)', unit: 'mm/year', sourceCitation: 'ERA5 Land Reanalysis', normalized: Math.max(0, 1.0 - 2356.1763 / 2500.0) },
      vegetation: { raw: 0.4942, displayValue: '0.494 (Paddy fields & wetlands)', unit: 'NDVI index', sourceCitation: 'NASA MODIS NDVI', normalized: 0.4942 },
      dust_wind: { raw: 0.2500, displayValue: '0.250', unit: 'AOD 550nm', sourceCitation: 'NASA MAIAC AOD', normalized: 0.2500 },
      rock_mineral: { raw: 'sedimentary_clastic', displayValue: 'Alluvial silt, clay & delta sediment', unit: 'lithology category', sourceCitation: 'Irrawaddy Delta Geological Survey', normalized: 'sedimentary_clastic' },
      water_ice: { raw: 0.0, displayValue: '0.00', unit: 'ice presence index [0-1]', sourceCitation: 'Monsoonal climate baseline', normalized: 0.0 },
    },
    images: {
      photo: {
        url: assetUrl('images/earth/irrawaddy-delta.jpg'),
        title: 'Irrawaddy Delta Aerial View',
        caption: 'Aerial view of the braided river channels and tidal flats of the Irrawaddy Delta, Myanmar.',
        source: 'Attribution pending review',
      },
    },
  },
};
