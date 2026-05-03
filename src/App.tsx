import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const container = useRef(null);

  useGSAP(() => {
    /* ---- CURSOR ---- */
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursorEl = document.getElementById('cursor');

      if (cursorEl) {
        document.addEventListener('mousemove', e => {
          cursorEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
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
          });
          el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering');
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
      gsap.to('.hero-avatar', {
        opacity: 1, scale: 1, y: 0, duration: 1.05, ease: 'power3.out', delay: 0.3
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

    // Always play preloader animation
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

    function initScroll() {
      gsap.set('.pcard:not([hidden])', { opacity: 0, y: 40 });
      gsap.set('.pdf-strip', { opacity: 0, y: 24 });
      gsap.set('.about-bio .cv-btn', { opacity: 0, y: 16 });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.pcard:not([hidden]), .pdf-strip, .about-bio .cv-btn').forEach(el => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'none';
        });
        return;
      }

      gsap.utils.toArray('.s-title').forEach(el => {
        const spans = (el as HTMLElement).querySelectorAll('.tl span');
        gsap.to(spans, {
          y: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: el as HTMLElement, start: 'top 88%' }
        });
      });

      gsap.utils.toArray('.pcard:not([hidden])').forEach((el, i) => {
        gsap.to(el as HTMLElement, {
          opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el as HTMLElement, start: 'top 88%' }
        });
      });

      gsap.utils.toArray('.about-bio p').forEach((el, i) => {
        gsap.fromTo(el as HTMLElement,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, delay: i * 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: el as HTMLElement, start: 'top 90%' }
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
        gsap.fromTo(el as HTMLElement,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65, delay: i * 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: el as HTMLElement, start: 'top 88%' }
          }
        );
      });

      gsap.utils.toArray('.contact-headline .tl span').forEach((el, i) => {
        gsap.fromTo(el as HTMLElement,
          { y: '110%' },
          { y: '0%', duration: 0.9, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: el as HTMLElement, start: 'top 90%' }
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

  const [dark, setDark] = useState(
    () => (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('vigneshbhatn27@gmail.com').then(() => {
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
      
  <div id="preloader" aria-hidden="true">
    <div className="pl-name"><span>Vignesh Bhat N</span></div>
    <div className="pl-bar-wrap"><div className="pl-bar" id="plBar"></div></div>
  </div>

  <div className="cursor" id="cursor" aria-hidden="true"></div>

  <nav id="nav" className={navScrolled ? "scrolled" : ""}>
    <a href="#hero" className="nav-logo" data-cursor="hi">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="VB Logo" style={{ height: '36px', borderRadius: '4px', filter: dark ? 'invert(1)' : 'none' }} />
    </a>
    <div className="nav-right">
      <ul className="nav-links">
        <li><a href="#work">Projects</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="theme-btn" id="themeBtn" aria-label="Toggle colour scheme" onClick={() => setDark(!dark)}>
        <span className="t-icon" id="tIcon">{dark ? '◐' : '◑'}</span>
        <span id="tLabel">{dark ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  </nav>

  <main>
  <section id="hero">
    <div className="hero-top-wrapper">
      <div className="hero-left-content">
        <p className="hero-eyebrow"><span>Software Developer</span></p>

        <h1 className="hero-title">
          <span className="tl"><span>Vignesh</span></span>
          <span className="tl"><span>Bhat N</span></span>
        </h1>
      </div>
      <div className="hero-photo-container">
         <img src={`${import.meta.env.BASE_URL}avatar.png`} alt="Vignesh Bhat N" className="hero-avatar" />
      </div>
    </div>

    <div className="hero-bottom">
      <p className="hero-desc">
        <span>Bengaluru based, specializing in AI, backend pipelines, and document intelligence. Currently pursuing my B.E. at Bapuji Institute of Engineering and Technology.</span>
      </p>
      <div className="hero-right">
        <div className="pill available"><span className="pill-dot"></span>LogicBrackets Intern</div>
        <div className="pill">Bengaluru, India</div>
        <div className="pill">AI & ML Enthusiast</div>
      </div>
    </div>

    <div className="scroll-hint" aria-hidden="true">
      <div className="sh-line"></div>
      <span>Scroll</span>
    </div>
  </section>

  <div className="marquee-wrap" aria-hidden="true">
    <div className="marquee-track">
      <span className="mq-item">Python</span>
      <span className="mq-item">PyTorch</span>
      <span className="mq-item">FastAPI</span>
      <span className="mq-item">LLMs</span>
      <span className="mq-item">Computer Vision</span>
      <span className="mq-item">PostgreSQL</span>
      <span className="mq-item">Docker</span>
      <span className="mq-item">Redis</span>
      <span className="mq-item">Streamlit</span>
      <span className="mq-item">Document Intelligence</span>
      <span className="mq-item">Python</span>
      <span className="mq-item">PyTorch</span>
      <span className="mq-item">FastAPI</span>
      <span className="mq-item">LLMs</span>
      <span className="mq-item">Computer Vision</span>
      <span className="mq-item">PostgreSQL</span>
      <span className="mq-item">Docker</span>
      <span className="mq-item">Redis</span>
      <span className="mq-item">Streamlit</span>
      <span className="mq-item">Document Intelligence</span>
    </div>
  </div>

  <section id="work">
    <div className="s-header">
      <div>
        <p className="s-label">Selected Projects</p>
        <h2 className="s-title"><span className="tl"><span>Projects</span></span></h2>
      </div>
    </div>

    <div className="projects">

      <article className="pcard p-caixabank" data-index="0" onClick={() => { window.open('https://github.com/vigneshbhatn/ancient-kannada-inscriptions', '_blank') }} style={{cursor: "none"}}>
        <div className="pcard-inner">
          <div className="pcard-info">
            <div className="pcard-top">
              <span className="pnum">01</span>
              <div className="tags">
                <span className="tag">Deep Learning</span>
                <span className="tag">NLP</span>
              </div>
            </div>
            <div className="pcard-mid">
              <p className="pcompany">KSCST Funded Research</p>
              <h3 className="pname">Ancient Kannada Inscriptions Gen AI</h3>
              <p className="pyear">Python, PyTorch, OpenCV, Gemini</p>
            </div>
            <div className="pmetrics">
              <div className="pmetric">
                <span className="pm-val">84%</span>
                <span className="pm-label">Validation<br />Accuracy</span>
              </div>
              <div className="pmetric">
                <span className="pm-val">26%</span>
                <span className="pm-label">Reduced Character<br />Error Rate</span>
              </div>
            </div>
          </div>
          <div className="pcard-vis">
            <div className="pcard-bg"></div>
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="p-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </article>

      <article className="pcard p-gymondo1" data-index="1" onClick={() => { window.open('https://github.com/vigneshbhatn/student-analytics', '_blank') }} style={{cursor: "none"}}>
        <div className="pcard-inner">
          <div className="pcard-info">
            <div className="pcard-top">
              <span className="pnum">02</span>
              <div className="tags">
                <span className="tag">Data Analytics</span>
                <span className="tag">ETL</span>
              </div>
            </div>
            <div className="pcard-mid">
              <p className="pcompany">Dashboard Development</p>
              <h3 className="pname">Student Analytics Dashboard</h3>
              <p className="pyear">Power BI, MySQL, Pandas, Streamlit</p>
            </div>
            <div className="pmetrics">
              <div className="pmetric">
                <span className="pm-val">10K+</span>
                <span className="pm-label">Data points parsed<br />and tracked</span>
              </div>
              <div className="pmetric">
                <span className="pm-val">4</span>
                <span className="pm-label">Interactive tracking<br />dashboards</span>
              </div>
            </div>
          </div>
          <div className="pcard-vis">
            <div className="pcard-bg"></div>
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="p-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </article>

      <article className="pcard p-gymondo2" data-index="2" onClick={() => { window.open('https://github.com/vigneshbhatn/finance-tracker', '_blank') }} style={{cursor: "none"}}>
        <div className="pcard-inner">
          <div className="pcard-info">
            <div className="pcard-top">
              <span className="pnum">03</span>
              <div className="tags">
                <span className="tag">Backend</span>
                <span className="tag">API</span>
              </div>
            </div>
            <div className="pcard-mid">
              <p className="pcompany">Web Application</p>
              <h3 className="pname">Personal Finance Tracker</h3>
              <p className="pyear">FastAPI, PostgreSQL, JWT</p>
            </div>
            <div className="pmetrics">
              <div className="pmetric">
                <span className="pm-val">12+</span>
                <span className="pm-label">RESTful API<br />Endpoints</span>
              </div>
              <div className="pmetric">
                <span className="pm-val">JWT</span>
                <span className="pm-label">Token-Based<br />Authentication</span>
              </div>
            </div>
          </div>
          <div className="pcard-vis">
            <div className="pcard-bg"></div>
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="p-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </article>

    </div>

    <div className="pdf-strip" style={{marginTop: "48px", paddingTop: "48px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap"}}>
      <div>
        <p style={{fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "4px"}}>Looking for more projects?</p>
        <p style={{fontSize: "13px", color: "var(--muted)", lineHeight: "1.5"}}>More of my code is available on GitHub.</p>
      </div>
      <a href="https://github.com/vigneshbhatn" target="_blank" rel="noopener" className="cv-btn">
        View GitHub
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12L12 2M12 2H4M12 2V10"/>
        </svg>
      </a>
    </div>
  </section>

  <section id="about">
    <div className="s-header">
      <div>
        <p className="s-label">My story</p>
        <h2 className="s-title"><span className="tl"><span>About</span></span></h2>
      </div>
    </div>

    <div className="about-grid">
      <div className="about-bio">
       <p><strong>I am a Computer Science Engineering student</strong> at Bapuji Institute of Engineering and Technology (2022–2026), focused on building practical AI systems that solve real-world problems.</p>

       <p>Currently, I work as a <strong>Software Developer Intern at LogicBrackets</strong> in Bengaluru, where I designed and built an end-to-end document intelligence pipeline. My work combines OCR, LLMs, and semantic search to extract, structure, and enable querying over unstructured data.</p>

       <p>I enjoy building scalable backend systems and have optimized OCR inference using containerized pipelines and cloud GPUs, significantly reducing processing and benchmarking time.</p>

       <p>When I'm not coding or exploring the latest AI models, I work on side projects in linux and OS. Outside of tech, I enjoy watching motorsports, playing badminton, and occasionally sim racing and gaming.</p>
        <a href="https://www.linkedin.com/in/vignesh-bhat-n-701562259" target="_blank" rel="noopener" className="cv-btn" style={{marginTop: "20px"}}>
          View LinkedIn
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12L12 2M12 2H4M12 2V10"/>
          </svg>
        </a>
      </div>

      <div className="about-side">

        <div>
          <h3 className="detail-h">Experience</h3>
          <ul className="exp-list">
            <li className="exp-item">
              <div className="ei-l">
                <span className="ei-co">LogicBrackets</span>
                <span className="ei-role">Software Developer Intern</span>
              </div>
              <span className="ei-yr">Jan 2026 - Present</span>
            </li>
            <li className="exp-item">
              <div className="ei-l">
                <span className="ei-co">Bapuji Inst. of Eng. and Tech.</span>
                <span className="ei-role">B.E. Computer Science</span>
              </div>
              <span className="ei-yr">2022 - 2026</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="detail-h">Achievements</h3>
          <ul className="awards-list">
            <li className="award-item">
              <div className="aw-l">
                <span className="aw-title">Project Funding (ARTPark, IISc)</span>
                <span className="aw-issuer">KSCST</span>
              </div>
              <span className="aw-yr">2025</span>
            </li>
            <li className="award-item">
              <div className="aw-l">
                <span className="aw-title">State Finalist (Manthan Business Plan)</span>
                <span className="aw-issuer">FKCCI</span>
              </div>
              <span className="aw-yr">2024</span>
            </li>
            <li className="award-item">
              <div className="aw-l">
                <span className="aw-title">3 Time Quiz Winner</span>
                <span className="aw-issuer">Davana Fest</span>
              </div>
              <span className="aw-yr">2023,2024,2025</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="detail-h">Languages & Tools</h3>
          <div className="skills-row">
            <span className="skill-pill">Python</span>
            <span className="skill-pill">SQL</span>
            <span className="skill-pill">PyTorch</span>
            <span className="skill-pill">OpenCV</span>
            <span className="skill-pill">Scikit-Learn</span>
            <span className="skill-pill">Large Language Models</span>
            <span className="skill-pill">FastAPI</span>
            <span className="skill-pill">Streamlit</span>
            <span className="skill-pill">PostgreSQL</span>
            <span className="skill-pill">Docker</span>
            <span className="skill-pill">Redis</span>
            <span className="skill-pill">Git</span>
            <span className="skill-pill">AWS</span>
            <span className="skill-pill">Celery</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section id="contact">
    <p className="s-label">Get in touch</p>

    <div className="contact-headline">
      <span className="tl"><span>So what's the plan?</span></span>
      <span className="tl">
        <span><a href="mailto:vigneshbhatn27@gmail.com" data-cursor="hi">Let's execute it<svg width="0.7em" height="0.7em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: "inline-block", verticalAlign: "middle", marginBottom: "0.12em"}}><path d="M3 15L15 3M15 3H5M15 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></a></span>
      </span>
    </div>

    <div className="contact-footer">
      <div className="cf-left">
        <div className="cf-email-row">
          <p>vigneshbhatn27@gmail.com</p>
          <button className="copy-btn" id="copyEmailBtn" aria-label="Copy email address" onClick={handleCopyEmail}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="4.5" width="7" height="7" rx="1.2"/>
              <path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6"/>
            </svg>
          </button>
        </div>
        <p>Bengaluru, Karnataka</p>
      </div>
      <div className="cf-right">
        <a href="mailto:vigneshbhatn27@gmail.com" data-cursor="hi">Email</a>
        <a href="https://github.com/vigneshbhatn" target="_blank" rel="noopener" data-cursor="hi">GitHub</a>
        <a href="https://www.linkedin.com/in/vignesh-bhat-n-701562259" target="_blank" rel="noopener" data-cursor="hi">LinkedIn</a>
      </div>
    </div>

    <p className="copy">© 2026 Vignesh Bhat N · Software Developer</p>
  </section>

  </main>
    </div>
  );
}