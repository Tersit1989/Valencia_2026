// Generates public/icons/icon-192.png and icon-512.png without native deps.
// Draws a stylised orange (fruit) on a terracotta background.
// Run: node scripts/make-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

function makeIcon(size) {
  const bg = [232, 89, 12]; // terracotta
  const fruit = [255, 196, 92]; // warm orange
  const fruitHi = [255, 224, 158];
  const leaf = [47, 158, 68];
  const cx = size / 2;
  const cy = size * 0.57;
  const r = size * 0.3;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      let [rr, gg, bb] = bg;
      const d = Math.hypot(x - cx, y - cy);
      if (d < r) {
        [rr, gg, bb] = fruit;
        const dh = Math.hypot(x - (cx - r * 0.35), y - (cy - r * 0.35));
        if (dh < r * 0.45) [rr, gg, bb] = fruitHi;
      }
      // leaf: ellipse above the fruit, tilted to the right
      const lx = (x - cx - size * 0.06) / (size * 0.13);
      const ly = (y - (cy - r - size * 0.05)) / (size * 0.055);
      if (lx * lx + ly * ly < 1) [rr, gg, bb] = leaf;
      raw[p++] = rr;
      raw[p++] = gg;
      raw[p++] = bb;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

mkdirSync("public/icons", { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, makeIcon(size));
  console.log(`public/icons/icon-${size}.png`);
}
