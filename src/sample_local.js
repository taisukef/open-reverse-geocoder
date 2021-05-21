import { openReverseGeocoder as geocoder } from "./main.ts";
const res = await geocoder([139.7673068, 35.6809591]);
console.log(res);
