const fs = require('fs');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="224" ry="224" fill="#BE78F0"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#D4A3F7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#BE78F0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#glow)"/>

  <g transform="translate(512, 410)" stroke="none">
    <!-- LEFT ARM -->
    <path d="M-120,40 Q-160,35 -190,0 Q-210,-25 -220,-60"
          fill="none" stroke="white" stroke-width="36" stroke-linecap="round" opacity="0.95"/>
    <path d="M-220,-60 Q-215,-90 -200,-120 Q-190,-145 -185,-160"
          fill="none" stroke="white" stroke-width="32" stroke-linecap="round" opacity="0.95"/>
    <ellipse cx="-195" cy="-95" rx="32" ry="20" fill="white" opacity="0.95"
             transform="rotate(-25, -195, -95)"/>
    <circle cx="-185" cy="-168" r="22" fill="white" opacity="0.95"/>

    <!-- RIGHT ARM -->
    <path d="M120,40 Q160,35 190,0 Q210,-25 220,-60"
          fill="none" stroke="white" stroke-width="36" stroke-linecap="round" opacity="0.95"/>
    <path d="M220,-60 Q215,-90 200,-120 Q190,-145 185,-160"
          fill="none" stroke="white" stroke-width="32" stroke-linecap="round" opacity="0.95"/>
    <ellipse cx="195" cy="-95" rx="32" ry="20" fill="white" opacity="0.95"
             transform="rotate(25, 195, -95)"/>
    <circle cx="185" cy="-168" r="22" fill="white" opacity="0.95"/>

    <!-- BRAIN -->
    <path d="M-8,-130 C-8,-170 -55,-190 -85,-180 C-115,-170 -130,-140 -130,-110
             C-150,-105 -158,-75 -148,-50 C-162,-32 -155,15 -135,30
             C-142,58 -125,85 -98,90 C-88,108 -62,118 -38,108
             C-22,118 -8,112 -8,95 Z"
          fill="white" opacity="0.95"/>
    <path d="M8,-130 C8,-170 55,-190 85,-180 C115,-170 130,-140 130,-110
             C150,-105 158,-75 148,-50 C162,-32 155,15 135,30
             C142,58 125,85 98,90 C88,108 62,118 38,108
             C22,118 8,112 8,95 Z"
          fill="white" opacity="0.95"/>
    <line x1="0" y1="-125" x2="0" y2="95" stroke="#BE78F0" stroke-width="2.5" opacity="0.25"/>
    <path d="M-25,-85 C-55,-78 -85,-95 -105,-75" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
    <path d="M-20,-35 C-50,-28 -95,-42 -120,-18" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
    <path d="M-15,20 C-45,28 -85,12 -110,38" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
    <path d="M25,-85 C55,-78 85,-95 105,-75" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
    <path d="M20,-35 C50,-28 95,-42 120,-18" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
    <path d="M15,20 C45,28 85,12 110,38" fill="none" stroke="#BE78F0" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
  </g>

  <text x="512" y="780" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="68" font-weight="800" fill="rgba(255,255,255,0.95)"
    letter-spacing="6">MINDSETS</text>
</svg>`;

const outputDir = path.join(__dirname, '..', 'assets', 'images');
fs.writeFileSync(path.join(outputDir, 'icon.svg'), svg);
console.log('Purple icon SVG saved');
