import { geoContains } from "https://taisukef.github.io/d3-geo/src/index.js";
import { lngLatToGoogle } from "https://taisukef.github.io/global-mercator/index.js";
//import Protobuf from 'pbf'
//1import axios from 'axios'
//import { setupCache } from 'axios-cache-adapter'
import { Pbf } from "https://taisukef.github.io/pbf/Pbf.js";
import { VectorTile } from "https://taisukef.github.io/vector-tile-js/VectorTile.js";

export interface ReverseGeocodingResult {
  code: string;
  prefecture: string;
  city: string;
}

type LngLat = [number, number];

export interface ReverseGeocodingOptions {
  /** どのズームを使うか。デフォルトは 10 */
  zoomBase: number;

  /** タイルが入ってるURLフォーマット。 */
  tileUrl: string;
}

const DEFAULT_OPTIONS: ReverseGeocodingOptions = {
  zoomBase: 10,
  tileUrl:
    `https://geolonia.github.io/open-reverse-geocoder/tiles/{z}/{x}/{y}.pbf`,
};

//const cache = setupCache({
//  maxAge: 60 * 60 * 24 * 1000
//})

//const api = axios.create({
//  adapter: cache.adapter
//})

export const openReverseGeocoder: (
  input: LngLat,
  options?: Partial<ReverseGeocodingOptions>,
) => Promise<ReverseGeocodingResult> = async (lnglat, inputOptions = {}) => {
  const options: ReverseGeocodingOptions = {
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

  let buffer;

  try {
    buffer = await (await fetch(tileUrl)).arrayBuffer();
  } catch (error) {
    throw new Error(error);
  }

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
        const res = geoContains(geojson as any, lnglat);
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
