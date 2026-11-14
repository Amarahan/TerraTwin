NASA-only Analog Atlas data folder

This folder contains official NASA/Space Apps pages, NASA Trek metadata/catalogs,
one public Mars MOLA map tile, NASA Worldview imagery, and official NASA LP DAAC
browse files for the three Earth analog locations. It also contains site_targets.csv
for the challenge locations.

Downloaded folders
------------------
official_pages/  Challenge, Resources, Moon Trek, Mars Trek, and Trek API pages.
moon/            LRO/LOLA and LROC metadata plus NASA LRO instrument information.
mars/            Public Mars MOLA tile and CRISM source metadata page.
earth/           NASA Worldview imagery plus NASA LP DAAC SRTM and ASTER GDEM
                 browse files for Atacama, Death Valley, and Haughton.

NASA Trek target layers added
------------------------------
moon/metadata/moon_trek_polar_layers.json contains the official Moon Trek polar
layer catalog. moon/trek_target_layers/ contains preview maps for Shackleton Rim
and Malapert Massif: LOLA 5 m/pixel color hillshade and color slope; Malapert's
LROC DEM slope map is included as well.

mars/mars_trek_eq_layers.json contains the official Mars Trek equirectangular
layer catalog. mars/trek_target_layers/ contains NASA Trek preview maps for
Jezero-relevant global layers: MOLA hillshade, MOLA roughness, TES dust, TES dust
index, CTX global mosaic, and HiRISE global mosaic. It also contains the direct
NASA Trek tiles centered on Jezero for MOLA hillshade, MOLA roughness, TES dust,
and TES dust index, at each layer's available map zoom.

Use core_target_data_manifest.csv to see each downloaded file, its NASA source,
and whether it is a directly usable preview layer or a catalog/reference file.

Earth files downloaded in this bundle
--------------------------------------
earth/srtm/S24W070.SRTMGL1.2.jpg       NASA SRTM browse tile for Atacama
earth/srtm/N36W117.SRTMGL1.2.jpg       NASA SRTM browse tile for Death Valley
earth/aster_gdem/ASTGTMV003_S24W070.1.jpg  NASA ASTER GDEM browse tile for Atacama
earth/aster_gdem/ASTGTMV003_N36W117.1.jpg  NASA ASTER GDEM browse tile for Death Valley
earth/aster_gdem/ASTGTMV003_N75W090.1.jpg  NASA ASTER GDEM browse tile for Haughton

These are official public browse images. The full SRTM HGT and ASTER GeoTIFF
granules are much larger and the LP DAAC protected download flow requires the
Earthdata Login session in the browser; they are not silently replaced with
third-party copies.

Why this is not every raw file
-------------------------------
NASA's official collections are very large and are distributed across Moon Trek,
Mars Trek, NASA Earthdata, PDS, and Worldview. There is no single challenge data
archive. Some Earthdata products require an Earthdata Login, and complete global
rasters are too large for a practical hackathon folder.

Recommended next downloads
--------------------------
For Moon: search Moon Trek for LOLA, Diviner, LEND, LAMP, and LROC around Shackleton
and Malapert.
For Mars: use MOLA, TES Dust, CRISM, and Jezero CTX/HiRISE products around Jezero.
For Earth: use SRTM and EMIT through Earthdata Search, and Worldview for dated imagery.

All listed sources are NASA or NASA-hosted official sources. Do not add third-party
datasets if your rules require NASA-only data.
