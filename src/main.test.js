import * as t from "https://deno.land/std/testing/asserts.ts";
import { openReverseGeocoder as geocoder } from "./main.js";

Deno.test("東京駅 [139.7673068, 35.6809591]", async () => {
  const res = await geocoder([139.7673068, 35.6809591]);
  t.assertEquals(res, {
    code: "13101",
    prefecture: "東京都",
    city: "千代田区",
  });
});

Deno.test("大阪駅 [135.4983028, 34.7055051]", async () => {
  const res = await geocoder([135.4983028, 34.7055051]);
  t.assertEquals(res, {
    code: "27127",
    prefecture: "大阪府",
    city: "大阪市北区",
  });
});

Deno.test("串本町 [135.781478, 33.472551]", async () => {
  const res = await geocoder([135.781478, 33.472551]);
  t.assertEquals(res, {
    code: "30428",
    prefecture: "和歌山県",
    city: "東牟婁郡串本町",
  });
});

Deno.test("北海道羅臼町 [145.189681, 44.021866]", async () => {
  const res = await geocoder([145.189681, 44.021866]);
  t.assertEquals(res, {
    code: "01694",
    prefecture: "北海道",
    city: "目梨郡羅臼町",
  });
});

Deno.test("八丈町 [139.785231, 33.115122]", async () => {
  const res = await geocoder([139.785231, 33.115122]);
  t.assertEquals(res, {
    code: "13401",
    prefecture: "東京都",
    city: "八丈町",
  });
});

Deno.test("範囲外 [135.375680, 36.880782]", async () => {
  const res = await geocoder([135.375680, 36.880782]);
  t.assertEquals(res, null);
});
