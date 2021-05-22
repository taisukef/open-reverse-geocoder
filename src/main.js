import { geoContains } from "https://taisukef.github.io/d3-geo/src/index.js";
import { lngLatToGoogle } from "https://taisukef.github.io/global-mercator/index.js";
import { Pbf } from "https://taisukef.github.io/pbf/Pbf.js";
import { VectorTile } from "https://taisukef.github.io/vector-tile-js/VectorTile.js";

const DEFAULT_OPTIONS = {
  zoomBase: 10,
  tileUrl:
    `https://geolonia.github.io/open-reverse-geocoder/tiles/{z}/{x}/{y}.pbf`,
};

export const openReverseGeocoder = async (lnglat, inputOptions = {}) => {
  const options = {
    ...DEFAULT_OPTIONS,
    ...inputOptions,
  };
  const [x, y] = lngLatToGoogle(lnglat, options.zoomBase);
  const tileUrl = options.tileUrl
    .replace("{z}", String(options.zoomBase))
    .replace("{x}", String(x))
    .replace("{y}", String(y));

  const geocodingResult = {
    code: "",
    prefecture: "",
    city: "",
  };

  const res = await fetch(tileUrl);
  if (!res.ok) {
    await res.text();
    return null;
  }
  const buffer = await res.arrayBuffer();
  const tile = new VectorTile(new Pbf(buffer));
  let layers = Object.keys(tile.layers);

  if (!Array.isArray(layers)) layers = [layers];

  layers.forEach((layerID) => {
    const layer = tile.layers[layerID];
    if (layer) {
      for (let i = 0; i < layer.length; i++) {
        const feature = layer.feature(i).toGeoJSON(x, y, options.zoomBase);
        if (layers.length > 1) feature.properties.vt_layer = layerID;

        const geojson = {
          type: "FeatureCollection",
          features: [feature],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = geoContains(geojson, lnglat);
        if (res) {
          geocodingResult.code = 5 === String(feature.id).length
            ? String(feature.id)
            : `0${String(feature.id)}`;
          geocodingResult.prefecture = feature.properties.prefecture;
          geocodingResult.city = feature.properties.city;
        }
      }
    }
  });

  return geocodingResult;
};
