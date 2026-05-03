const fs = require('fs');

// Update App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf-8');

appTsx = appTsx.replace(
  /\{?\/\* ==================== CURSOR ====================\s*\*\/\}?\s*<div className="cursor" id="cursor" aria-hidden="true">[\s\S]*?<\/div>\s*<\/div>/,
  `{/* ==================== CURSOR ==================== */}
  <div className="cursor" id="cursor" aria-hidden="true"></div>`
);

appTsx = appTsx.replace(
  /document\.querySelectorAll\('a, button, \.pcard:not\(\.pcard--wip\)'\)\.forEach\(el => \{[\s\S]*?\}\);/g,
  `document.querySelectorAll('a, button, .pcard:not(.pcard--wip)').forEach(el => {
          el.addEventListener('mouseenter', () => {
            document.body.classList.add('is-hovering');
          });
          el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering');
          });
        });`
);

fs.writeFileSync('src/App.tsx', appTsx);

// Update index.css
let indexCss = fs.readFileSync('src/index.css', 'utf-8');

const newCursorCss = `/* ============================================
       CURSOR - MIRO STYLE (REPLACED WITH DIFFERENCE DOT)
    ============================================ */
    .cursor {
      position: fixed;
      top: -8px; left: -8px;
      width: 16px; height: 16px;
      border-radius: 50%;
      background: white;
      mix-blend-mode: difference;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
      opacity: 0;
      transition: width 0.25s cubic-bezier(0.25,0.46,0.45,0.94), height 0.25s cubic-bezier(0.25,0.46,0.45,0.94), top 0.25s cubic-bezier(0.25,0.46,0.45,0.94), left 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    
    body.is-hovering .cursor {
      width: 48px;
      height: 48px;
      top: -24px; left: -24px;
    }`;

indexCss = indexCss.replace(
  /\/\* ============================================\s*CURSOR - MIRO STYLE\s*============================================ \*\/[\s\S]*?body\.is-hovering \.cursor-label-dot \{\s*background: rgba\(255,255,255,0\.6\);\s*\}/,
  newCursorCss
);

fs.writeFileSync('src/index.css', indexCss);
