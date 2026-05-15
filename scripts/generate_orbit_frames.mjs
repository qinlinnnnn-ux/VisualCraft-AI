import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "frames", "veyra-runner");
mkdirSync(outDir, { recursive: true });

const totalFrames = 72;

function frameSvg(index) {
  const progress = index / totalFrames;
  const angle = progress * Math.PI * 2;
  const yaw = Math.sin(angle);
  const frontness = Math.abs(yaw);
  const widthScale = 1 - frontness * 0.24;
  const toeLift = Math.sin(angle + 0.4) * 6;
  const heelShift = yaw * 38;
  const laceShift = yaw * 24;
  const shadowShift = yaw * 46;
  const frameLabel = String(index + 1).padStart(2, "0");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="studioBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#faf7f3"/>
      <stop offset="54%" stop-color="#ece7df"/>
      <stop offset="100%" stop-color="#c9b7aa"/>
    </linearGradient>
    <linearGradient id="upper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="46%" stop-color="#edf0f2"/>
      <stop offset="100%" stop-color="#bec5cb"/>
    </linearGradient>
    <linearGradient id="sole" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fffdf8"/>
      <stop offset="62%" stop-color="#eee9df"/>
      <stop offset="100%" stop-color="#d5cbbd"/>
    </linearGradient>
    <linearGradient id="rubber" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d1d5db"/>
      <stop offset="100%" stop-color="#8b949e"/>
    </linearGradient>
    <filter id="ao" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="${yaw * 12}" dy="24" stdDeviation="18" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="1600" height="1000" fill="url(#studioBg)"/>
  <ellipse cx="${800 + shadowShift}" cy="760" rx="${470 * widthScale}" ry="${68 + frontness * 12}" fill="#1f1715" opacity="0.22"/>

  <g transform="translate(800 520) scale(${widthScale} 1) translate(-800 -520)" filter="url(#ao)">
    <!-- outsole, deliberately crisp so the object reads as a shoe at every frame -->
    <path d="M345 642
             C428 701, 1026 718, 1248 642
             C1294 626, 1310 652, 1290 686
             C1244 764, 528 792, 306 690
             C271 674, 285 622, 345 642Z"
          fill="url(#sole)"/>
    <path d="M360 704
             C540 758, 1036 760, 1248 698"
          fill="none" stroke="url(#rubber)" stroke-width="22" stroke-linecap="round" opacity="0.92"/>
    <path d="M438 716
             C650 755, 985 754, 1164 710"
          fill="none" stroke="#f9fafb" stroke-width="10" stroke-linecap="round" opacity="0.7"/>

    <!-- main upper -->
    <path d="M318 604
             C370 502, 456 428, 586 390
             C690 238, 902 274, 1028 424
             C1135 448, 1238 518, 1294 610
             C1182 662, 926 676, 670 640
             C520 618, 420 594, 318 604Z"
          fill="url(#upper)"/>

    <!-- heel cup -->
    <path d="M328 594
             C384 468, 474 407, 590 390
             C548 488, 540 565, 576 636
             C470 628, 388 608, 328 594Z"
          fill="#d8dde1"/>

    <!-- collar opening and tongue -->
    <path d="M596 400
             C688 320, 844 328, 966 438
             C850 484, 702 492, 570 452
             C574 434, 582 416, 596 400Z"
          fill="#b8c0c7"/>
    <path d="M654 388
             C730 344, 850 358, 938 428
             C842 448, 742 456, 636 434Z"
          fill="#eef1f3"/>

    <!-- side panel -->
    <path d="M560 474
             C704 526, 928 518, 1110 462
             C1162 496, 1212 542, 1246 600
             C1048 638, 792 638, 596 604
             C562 570, 548 526, 560 474Z"
          fill="#d0d6db"/>

    <!-- toe box -->
    <path d="M1084 468
             C1190 488, 1270 548, 1296 616
             C1234 646, 1132 660, 1018 658
             C1054 604, 1076 544, 1084 468Z"
          fill="#f7f8f8"/>

    <!-- lace rows -->
    <path d="M520 ${526 + laceShift * 0.08}
             C648 ${500 + laceShift * 0.05}, 784 ${480 - laceShift * 0.04}, 918 ${452 - laceShift * 0.06}"
          fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round"/>
    <path d="M552 ${574 + laceShift * 0.06}
             C686 ${548 + laceShift * 0.04}, 828 ${528 - laceShift * 0.03}, 972 ${496 - laceShift * 0.06}"
          fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
    <path d="M574 526 L642 586 M674 496 L744 560 M778 480 L848 536 M886 456 L952 510"
          fill="none" stroke="#c7ced5" stroke-width="9" stroke-linecap="round" opacity="0.78"/>

    <!-- recognizable accent panel, not a brand logo -->
    <path d="M962 ${498 + toeLift}
             C1040 ${536 + toeLift}, 1114 ${582 + toeLift}, 1192 ${612 + toeLift}"
          fill="none" stroke="#ef476f" stroke-width="${44 - frontness * 8}" stroke-linecap="round"/>
    <path d="M984 ${494 + toeLift}
             C1058 ${528 + toeLift}, 1130 ${570 + toeLift}, 1204 ${596 + toeLift}"
          fill="none" stroke="#ff7b97" stroke-width="15" stroke-linecap="round" opacity="0.9"/>

    <!-- heel pull tab shifts subtly to imply rotation -->
    <path d="M392 ${448 - heelShift * 0.05}
             C372 ${382 - heelShift * 0.05}, 410 ${344 - heelShift * 0.05}, 468 ${386 - heelShift * 0.05}"
          fill="none" stroke="#9aa3ad" stroke-width="28" stroke-linecap="round"/>
  </g>

  <text x="800" y="928" text-anchor="middle" fill="#312a2a" opacity="0.42" font-family="Inter, Arial" font-size="24" font-weight="900" letter-spacing="7">VEYRA COURT RUNNER / FRAME ${frameLabel}</text>
</svg>`;
}

for (let i = 0; i < totalFrames; i += 1) {
  writeFileSync(join(outDir, `frame_${String(i).padStart(3, "0")}.svg`), frameSvg(i), "utf8");
}

console.log(`Generated ${totalFrames} clear sneaker orbit frames in ${outDir}`);
