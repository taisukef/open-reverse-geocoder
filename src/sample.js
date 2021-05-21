import { openReverseGeocoder as geocoder } from "https://taisukef.github.io/open-reverse-geocoder/src/main.js";
const res = await geocoder([139.7673068, 35.6809591]);
console.log(res);
