const fs = require('fs');

let html = fs.readFileSync('index-old.html', 'utf-8');

// extract CSS
const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  let css = cssMatch[1].trim();
  // We can write css to src/index.css
  fs.writeFileSync('src/index.css', css);
}

// extract body
let bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.log("No body found");
  process.exit(1);
}
let bodyHtml = bodyMatch[1];

// remove scripts
bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/g, '');

// HTML comments to JSX comments
bodyHtml = bodyHtml.replace(/<!--([\s\S]*?)-->/g, (match, p1) => `{/* ${p1.trim()} */}`);

// class to className
bodyHtml = bodyHtml.replace(/class="/g, 'className="');

// for to htmlFor
bodyHtml = bodyHtml.replace(/for="/g, 'htmlFor="');

// tabindex to tabIndex
bodyHtml = bodyHtml.replace(/tabindex/g, 'tabIndex');

// onclick to onClick (though some might have actual js inside, we'll strip or modify)
// e.g. onclick="window.location='caixabank.html'" -> onClick={() => window.location.href='caixabank.html'}
bodyHtml = bodyHtml.replace(/onclick="([^"]*)"/g, (m, p1) => `onClick={() => { ${p1} }}`);

// fix SVG stroke vars
bodyHtml = bodyHtml.replace(/stroke-width/g, 'strokeWidth');
bodyHtml = bodyHtml.replace(/stroke-linecap/g, 'strokeLinecap');
bodyHtml = bodyHtml.replace(/stroke-linejoin/g, 'strokeLinejoin');

// fix self-closing tags
bodyHtml = bodyHtml.replace(/<img(.*?)(?<!\/)>/g, '<img$1 />');
bodyHtml = bodyHtml.replace(/<br(.*?)(?<!\/)>/g, '<br$1 />');
bodyHtml = bodyHtml.replace(/<source(.*?)(?<!\/)>/g, '<source$1 />');

// aria-hidden="true" -> aria-hidden={true}
bodyHtml = bodyHtml.replace(/aria-hidden="true"/g, 'aria-hidden="true"');

// Fix style string to style object
// Quick and dirty matcher for style="..."
bodyHtml = bodyHtml.replace(/style="([^"]*)"/g, (match, p1) => {
    let styles = p1.split(';').filter(s => s.trim() !== '');
    let objPairs = styles.map(s => {
        let parts = s.split(':');
        if (parts.length < 2) return '';
        let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        let val = parts.slice(1).join(':').trim();
        return `${key}: "${val}"`;
    }).filter(p => p !== '');
    return `style={{${objPairs.join(', ')}}}`;
});

const appTsx = `import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// You might also want to import your animations/interactions if extracted.

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const container = useRef(null);

  useGSAP(() => {
    /* ---- CURSOR (Miro-style) - desktop/mouse only ---- */
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursorEl = document.getElementById('cursor');

      if (cursorEl) {
        document.addEventListener('mousemove', e => {
          cursorEl.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
          cursorEl.style.opacity = '1';
        }, { once: false });

        document.addEventListener('mouseleave', () => {
          cursorEl.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
          cursorEl.style.opacity = '1';
        });

        document.querySelectorAll('a, button, .pcard:not(.pcard--wip)').forEach(el => {
          el.addEventListener('mouseenter', () => {
            document.body.classList.add('is-hovering');
            const t = document.getElementById('cursorLabelText');
            if (t && el.getAttribute('data-cursor') === 'hi') {
              t.style.opacity = '0';
              setTimeout(() => { t.textContent = 'Say hi! 👋'; t.style.opacity = '1'; }, 120);
            }
          });
          el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering');
            const t = document.getElementById('cursorLabelText');
            if (t && t.textContent !== 'Guest') {
              t.style.opacity = '0';
              setTimeout(() => { t.textContent = 'Guest'; t.style.opacity = '1'; }, 120);
            }
          });
        });
      }
    }

    /* ---- PRELOADER ---- */
    const preloader = document.getElementById('preloader');
    const plBar     = document.getElementById('plBar');
    const plName    = document.querySelector('.pl-name span');
    
    function heroIn() {
      gsap.set('.nav-logo', { opacity: 0 });
      gsap.set('.nav-right', { opacity: 0 });
      gsap.set('.pill', { opacity: 0, x: 32 });
      
      gsap.to(['.nav-logo', '.nav-right'], {
        opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out'
      });
      gsap.to('.hero-title .tl span', {
        y: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out', delay: 0.05
      });
      gsap.to('.hero-eyebrow span', {
        y: 0, duration: 0.75, ease: 'power3.out', delay: 0.5
      });
      gsap.set('.hero-desc', { opacity: 0, y: 16 });
      gsap.to('.hero-desc', { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.65 });
      gsap.to('.pill', {
        x: 0, opacity: 1, duration: 0.55, stagger: 0.1,
        ease: 'power2.out', delay: 0.75
      });
      gsap.to('.scroll-hint', { opacity: 1, duration: 0.6, delay: 1.2 });

      initScroll();
    }

    if (sessionStorage.getItem('dvdrod_visited')) {
      if (preloader) preloader.style.display = 'none';
      heroIn();
    } else {
      sessionStorage.setItem('dvdrod_visited', '1');
      if (plName) gsap.to(plName, { y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
      setTimeout(() => { if(plBar) plBar.style.width = '100%'; }, 150);
      setTimeout(() => {
        if(preloader) {
          gsap.to(preloader, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power3.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
              heroIn();
            }
          });
        }
      }, 1300);
    }

    function initScroll() {
      gsap.set('.pcard:not([hidden])', { opacity: 0, y: 40 });
      gsap.set('.pdf-strip', { opacity: 0, y: 24 });
      gsap.set('.about-bio .cv-btn', { opacity: 0, y: 16 });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.pcard:not([hidden]), .pdf-strip, .about-bio .cv-btn').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        return;
      }

      gsap.utils.toArray('.s-title').forEach(el => {
        const spans = el.querySelectorAll('.tl span');
        gsap.to(spans, {
          y: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      gsap.utils.toArray('.pcard:not([hidden])').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      gsap.utils.toArray('.about-bio p').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, delay: i * 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
          }
        );
      });

      gsap.to('.pdf-strip', {
        opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: '.pdf-strip', start: 'top 88%' }
      });

      gsap.to('.about-bio .cv-btn', {
        opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-bio .cv-btn', start: 'top 92%' }
      });

      gsap.utils.toArray('.about-side > div').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65, delay: i * 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
          }
        );
      });

      gsap.utils.toArray('.contact-headline .tl span').forEach((el, i) => {
        gsap.fromTo(el,
          { y: '110%' },
          { y: '0%', duration: 0.9, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' }
          }
        );
      });

      gsap.fromTo('.contact-footer',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-footer', start: 'top 90%' }
        }
      );

      setTimeout(() => ScrollTrigger.refresh(), 400);
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
  }, { scope: container });

  // Theme support
  const [dark, setDark] = useState(
    () => (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Nav Scroll Style
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dvd.rod@proton.me').then(() => {
      const copyBtn = document.getElementById('copyEmailBtn');
      if (copyBtn) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3.5 3.5L11 3"/></svg>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="7" height="7" rx="1.2"/><path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6"/></svg>';
        }, 2000);
      }
    });
  };

  return (
    <div ref={container}>
      ${bodyHtml}
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', appTsx);
console.log('Done!');
