import assert from "node:assert/strict";
import { idFromUrl, parseEpisodeCode, visuals, parseAirDate, slugify } from "./transform";

assert.equal(idFromUrl("https://rickandmortyapi.com/api/location/3"), 3);
assert.equal(idFromUrl(""), null);
assert.equal(idFromUrl("unknown"), null);
assert.deepEqual(parseEpisodeCode("S01E01"), { season: 1, number: 1 });
assert.deepEqual(parseEpisodeCode("S05E10"), { season: 5, number: 10 });
assert.deepEqual(visuals(42), visuals(42));
assert.notDeepEqual(visuals(42), visuals(43));
const v = visuals(7);
assert.match(v.color, /^#[0-9a-f]{6}$/);
assert.ok(v.size >= 0.6 && v.size <= 1.6 && v.orbitAngle >= 0 && v.orbitAngle <= 2 * Math.PI);
assert.equal(parseAirDate("December 2, 2013")?.toISOString(), "2013-12-02T00:00:00.000Z");
assert.equal(slugify("Replacement Dimension"), "replacement-dimension");
console.log("transform tests OK");
