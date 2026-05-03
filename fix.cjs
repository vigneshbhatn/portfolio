const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. React import
code = code.replace(/import React, {/g, "import {");

// 2. el as HTMLElement / Element
code = code.replace(/el\.style\./g, "(el as HTMLElement).style.");
code = code.replace(/el\.querySelectorAll/g, "(el as HTMLElement).querySelectorAll");
code = code.replace(/trigger: el/g, "trigger: el as HTMLElement");

code = code.replace(/gsap\.to\(el,/g, "gsap.to(el as HTMLElement,");
code = code.replace(/gsap\.fromTo\(el,/g, "gsap.fromTo(el as HTMLElement,");

// 3. window.location
code = code.replace(/window\.location='([^']+)'/g, "window.location.href='$1'");

// 4. setDark
code = code.replace(/<button className="theme-btn" id="themeBtn" aria-label="Toggle colour scheme">/g, '<button className="theme-btn" id="themeBtn" aria-label="Toggle colour scheme" onClick={() => setDark(!dark)}>');

// 5. navScrolled
code = code.replace(/<nav id="nav">/, '<nav id="nav" className={navScrolled ? "scrolled" : ""}>');

// 6. handleCopyEmail
code = code.replace(/<button className="copy-btn" id="copyEmailBtn" aria-label="Copy email address">/, '<button className="copy-btn" id="copyEmailBtn" aria-label="Copy email address" onClick={handleCopyEmail}>');

fs.writeFileSync('src/App.tsx', code);
