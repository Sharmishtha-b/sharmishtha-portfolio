import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from "framer-motion";
import { links, tools, projects, sideQuests, experience, credentials, hobbies, hobbiesAlso } from "./data";

const EASE = [0.2, 0.8, 0.2, 1];

/* fades + rises into place when scrolled into view */
function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }} className={className} {...rest}>
      {children}
    </M>
  );
}

/* hero bits: ease in from a slight blur on load */
function Enter({ children, delay = 0, className = "" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── node graph ("connect the dots") ─────────────────────── */
function rng(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

function NodeGraph() {
  const [seed, setSeed] = useState(7);
  const [on, setOn] = useState(false);
  const [m, setM] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setM({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }));
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  const { nodes, lines } = useMemo(() => {
    const r = rng(seed);
    const cols = ["#C4B5FD", "#F0ABFC", "#7DD3FC", "#EEEAF6", "#C6F36B"];
    const nodes = [];
    for (let i = 0; i < 18; i++) {
      const a = r() * Math.PI * 2, d = 30 + Math.sqrt(r()) * 165;
      const rad = 3.2 + r() * 3.6;
      nodes.push({ x: 235 + Math.cos(a) * d, y: 235 + Math.sin(a) * d, r: rad, halo: rad * 2.8, c: cols[i % 5], d: r() * 3 });
    }
    const seen = new Set(), lines = [];
    nodes.forEach((n, i) => {
      nodes.map((o, j) => ({ j, dist: Math.hypot(o.x - n.x, o.y - n.y) }))
        .filter((o) => o.j !== i).sort((p, q) => p.dist - q.dist).slice(0, 2)
        .forEach((o) => {
          const key = Math.min(i, o.j) + "-" + Math.max(i, o.j);
          if (seen.has(key)) return;
          seen.add(key);
          lines.push({ a: n, b: nodes[o.j], len: Math.ceil(o.dist), delay: lines.length * 0.05 });
        });
    });
    return { nodes, lines };
  }, [seed]);

  return (
    <div className="flex flex-col items-center gap-[18px] w-full">
      <div className="graph-wrap" style={{ perspective: 900 }}>
        <div className="absolute inset-0" style={{ transform: `translate(${m.x * 16}px, ${m.y * 16}px)`, transition: "transform .6s cubic-bezier(.2,.8,.2,1)" }}>
          <div className="graph-disc" />
          <div className="graph-ring">
            <span className="absolute rounded-full" style={{ left: "50%", top: -5, width: 10, height: 10, marginLeft: -5, background: "#EEEAF6", boxShadow: "0 0 14px #fff" }} />
            <span className="absolute rounded-full" style={{ right: -4, top: "50%", width: 8, height: 8, marginTop: -4, background: "#C6F36B" }} />
          </div>
          <svg viewBox="0 0 470 470" className="absolute inset-0 w-full h-full" role="img" aria-label="A constellation of data points you can connect">
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#A78BFA" /><stop offset="0.5" stopColor="#F0ABFC" /><stop offset="1" stopColor="#7DD3FC" />
              </linearGradient>
            </defs>
            {lines.map((l, i) => (
              <line key={i} className="graph-line" x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} stroke="url(#lg)" strokeWidth="2" strokeLinecap="round"
                style={{ strokeDasharray: l.len, strokeDashoffset: on ? 0 : l.len, transitionDelay: `${l.delay}s` }} />
            ))}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle className="twinkle" cx={n.x} cy={n.y} r={n.halo} fill={n.c} fillOpacity="0.18" style={{ animationDelay: `${n.d}s` }} />
                <circle cx={n.x} cy={n.y} r={n.r} fill={n.c} />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="mono text-xs text-[var(--ink-2)] text-center" aria-live="polite">
          {on ? "you just drew a network graph. that’s basically my job." : "a constellation of data points, waiting for someone to connect them"}
        </span>
        <div className="flex gap-2">
          <button className="mini" onClick={() => setOn((v) => !v)}>{on ? "disconnect" : "connect the dots"}</button>
          <button className="mini" onClick={() => { setSeed((s) => s + 13); setOn(false); }}>shuffle</button>
        </div>
      </div>
    </div>
  );
}

/* ── project cover drawings (used until a screenshot is added) ── */
function CoverArt({ art }) {
  if (art === "curve")
    return (
      <svg width="420" height="190" viewBox="0 0 420 190" fill="none" style={{ maxWidth: "88%" }} aria-hidden="true">
        <path d="M10 40 C110 44 150 58 210 96 S320 170 410 178" stroke="#fff" strokeWidth="3" />
        <path d="M10 40 C110 40 170 46 230 52 S340 62 410 66" stroke="#fff" strokeOpacity=".45" strokeDasharray="5 7" />
        <circle cx="210" cy="96" r="7" fill="#fff" />
      </svg>
    );
  if (art === "spiral")
    return (
      <svg width="220" height="220" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <path d="M100 100 m0 -6 a6 6 0 1 1 -6 6 a14 14 0 1 1 20 -4 a24 24 0 1 1 -34 -10 a36 36 0 1 1 52 6 a50 50 0 1 1 -72 -20 a64 64 0 1 1 96 10" stroke="#fff" strokeWidth="2.4" />
      </svg>
    );
  if (art === "words")
    return (
      <div className="flex flex-wrap justify-center gap-2.5 max-w-[360px] px-4" aria-hidden="true">
        <span className="glass rounded-full px-4 py-2 text-[15px]">side effects</span>
        <span className="rounded-full px-4 py-2 text-[20px] font-medium bg-white text-[#2A1424]">effective</span>
        <span className="glass rounded-full px-4 py-2 text-[13px]">dosage</span>
        <span className="glass rounded-full px-4 py-2 text-[16px]">sleep</span>
      </div>
    );
  return (
    <svg width="320" height="190" viewBox="0 0 320 190" style={{ maxWidth: "88%" }} aria-hidden="true">
      <g fill="#fff" fillOpacity=".5">{[[34, 160], [62, 146], [88, 152], [112, 126]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" />)}</g>
      <g fill="#fff">{[[178, 92], [206, 72], [262, 48], [290, 36]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="6.5" />)}</g>
      <path d="M20 172 L300 26" stroke="#fff" strokeOpacity=".5" strokeDasharray="4 6" />
    </svg>
  );
}

function ProjectCard({ p, delay }) {
  const [a, b, bg] = p.colors || ["#7B61FF", "#F3A6D8", "#1A1430"];
  const external = p.href && p.href.startsWith("http");
  return (
    <Reveal as="a" delay={delay} href={p.href || undefined} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
      className="card" style={{ cursor: p.href ? "pointer" : "default" }}>
      <div className="cover">
        <div className="cover-art" style={p.image ? undefined : { background: `radial-gradient(circle at 18% 22%, ${a} 0%, transparent 55%), radial-gradient(circle at 85% 85%, ${b} 0%, transparent 50%), ${bg}` }}>
          {p.image ? <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" /> : <CoverArt art={p.art} />}
        </div>
        <span className="glass mono absolute left-[18px] top-[18px] rounded-full px-3 py-2 text-[11px]">{p.tag}</span>
      </div>
      <div className="flex items-center justify-between gap-4 px-6 pt-[22px] pb-6">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[22px] font-medium">{p.name}</span>
          <span className="text-[15px] text-[var(--muted)]">{p.blurb}</span>
        </div>
        <span className="go" aria-hidden="true">→</span>
      </div>
    </Reveal>
  );
}

function HobbyIcon({ name, color }) {
  const s = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, "aria-hidden": true };
  if (name === "film") return <svg {...s}><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M7 6l2 4M12 6l2 4M17 6l2 4" /></svg>;
  if (name === "pan") return <svg {...s}><circle cx="10" cy="13" r="6" /><path d="M16 13h6" /></svg>;
  return <svg {...s}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>;
}

/* ── ⌘K command palette ───────────────────────────────────── */
function CommandPalette({ onClose }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const items = [
    { label: "Projects", href: "#work" },
    { label: "Side quests", href: "#side" },
    { label: "Experience", href: "#experience" },
    { label: "Beyond data", href: "#beyond" },
    { label: "Contact", href: "#contact" },
    { label: "Résumé (PDF)", href: links.resume },
    { label: "Email me", href: `mailto:${links.email}` },
    { label: "LinkedIn", href: links.linkedin },
    { label: "GitHub", href: links.github },
  ];
  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[500] flex items-start justify-center pt-32 px-4 bg-black/60 backdrop-blur-md">
      <motion.div initial={{ scale: 0.96, y: -12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: -12 }} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#121019] shadow-2xl overflow-hidden" role="dialog" aria-label="Command menu">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <span className="mono text-[var(--muted)] text-sm">⌘</span>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="search anything…" aria-label="Search the site"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[var(--muted)]" />
          <kbd className="mono text-[11px] text-[var(--muted)] border border-white/10 rounded px-2 py-0.5">esc</kbd>
        </div>
        <div className="py-2 max-h-80 overflow-y-auto">
          {shown.map((i) => (
            <a key={i.label} href={i.href} onClick={onClose} className="flex items-center justify-between px-5 py-3 text-[15px] text-[var(--ink-2)] hover:bg-white/5 hover:text-white">
              {i.label}<span className="mono text-xs text-[var(--muted)]">↵</span>
            </a>
          ))}
          {shown.length === 0 && <p className="text-center text-sm text-[var(--muted)] py-8">nothing found</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── page ─────────────────────────────────────────────────── */
export default function App() {
  const [showCmd, setShowCmd] = useState(false);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const [active, setActive] = useState("top");
  const logoClicks = useRef(0);
  const toastTimer = useRef(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const say = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  };

  // ⌘K, and typing "data"
  useEffect(() => {
    let typed = "";
    const h = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setShowCmd((c) => !c); return; }
      if (typeof e.key !== "string" || e.key.length !== 1) return;
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      typed = (typed + e.key).slice(-10).toLowerCase();
      if (typed.includes("data")) { typed = ""; say("you typed data. you belong here."); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // double click for confetti
  useEffect(() => {
    const h = (e) => {
      const pieces = Array.from({ length: 18 }, (_, i) => ({
        id: `${Date.now()}-${i}`, x: e.clientX, y: e.clientY,
        c: ["#A78BFA", "#F0ABFC", "#7DD3FC", "#EEEAF6", "#C6F36B"][i % 5],
        dx: (Math.random() - 0.5) * 140, dy: (Math.random() - 0.5) * 140,
      }));
      setConfetti((c) => [...c, ...pieces]);
      setTimeout(() => setConfetti((c) => c.filter((p) => !pieces.includes(p))), 1000);
    };
    window.addEventListener("dblclick", h);
    return () => window.removeEventListener("dblclick", h);
  }, []);

  // highlight the nav link for the section on screen
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ["top", "work", "side", "experience", "beyond", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const onLogo = () => {
    logoClicks.current += 1;
    if (logoClicks.current >= 5) { logoClicks.current = 0; say("clicked five times. thorough, detail-oriented, clearly bored. all green flags honestly."); }
  };

  const wrap = "max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12";
  const navActive = (id) => (active === id || (id === "work" && active === "side") ? " active" : "");

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-bg min-h-screen overflow-x-hidden">
        <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]" style={{ scaleX: progress, background: "linear-gradient(90deg,#a78bfa,#f0abfc,#7dd3fc)" }} />

        {confetti.map((p) => (
          <motion.span key={p.id} className="fixed pointer-events-none z-[600] w-2 h-2 rounded-full" style={{ left: p.x, top: p.y, background: p.c }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} />
        ))}

        <AnimatePresence>
          {showCmd && <CommandPalette onClose={() => setShowCmd(false)} />}
          {toast && (
            <motion.div key="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} role="status"
              className="glass fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] rounded-2xl px-6 py-4 text-sm text-center max-w-[90vw]">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* floating nav */}
        <div className="sticky top-4 z-50 flex justify-center px-4">
          <nav className="glass flex items-center gap-4 sm:gap-7 rounded-full py-2 pr-2 pl-5 text-sm">
            <button onClick={onLogo} className="holo font-semibold text-[18px] tracking-[-0.02em]" aria-label="sb. (logo)">sb.</button>
            <a href="#work" className={"navlink" + navActive("work")}>projects</a>
            <a href="#experience" className={"navlink" + navActive("experience")}>experience</a>
            <a href="#beyond" className={"navlink hidden sm:inline" + navActive("beyond")}>beyond</a>
            <button onClick={() => setShowCmd(true)} className="navlink mono text-xs hidden sm:inline" aria-label="Open command menu">⌘K</button>
            <a href="#contact" className="rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium px-4 py-2.5">say hi</a>
          </nav>
        </div>

        {/* hero */}
        <section id="top" className={wrap + " flex flex-col lg:flex-row items-center gap-12 pt-14 sm:pt-24 pb-[72px]"}>
          <div className="flex-[1.1] flex flex-col gap-[26px] min-w-0 w-full">
            <Enter className="self-start">
              <span className="mono inline-flex items-center gap-2.5 text-xs text-[var(--ink-2)] px-3.5 py-2 border border-white/10 rounded-full">
                <span className="live" />open to opportunities · singapore
              </span>
            </Enter>
            <Enter delay={0.1}>
              <h1 className="m-0 font-semibold text-[clamp(56px,7vw,100px)] leading-[0.95] tracking-[-0.045em]">
                Sharmishtha<br /><span className="holo">Bharti.</span>
              </h1>
            </Enter>
            <Enter delay={0.2}>
              <p className="m-0 max-w-[520px] text-[19px] sm:text-[20px] leading-[1.55] text-[var(--ink-2)]">
                The kind of person who is quietly observing in the corner but loudly debugging at work. I ended up in data because I can’t stop asking{" "}
                <span className="text-[var(--ink)] font-medium">why things work the way they do</span> — and data tends to have the most honest answers.
              </p>
            </Enter>
            <Enter delay={0.3} className="flex gap-3 flex-wrap">
              <a className="btn btn-light" href="#work">see my work <span aria-hidden="true">→</span></a>
              <a className="btn glass" href={links.resume} target="_blank" rel="noreferrer">résumé</a>
            </Enter>
            <Enter delay={0.42} className="flex flex-wrap mt-2.5">
              <div className="flex flex-col gap-1 pr-6 sm:pr-[26px]">
                <span className="text-[28px] font-medium tracking-[-0.03em]">2 yrs</span>
                <span className="mono text-xs text-[var(--muted)]">at PwC AC India</span>
              </div>
              <div className="flex flex-col gap-1 px-6 sm:px-[26px] border-l border-white/10">
                <span className="text-[28px] font-medium tracking-[-0.03em]">MSBA</span>
                <span className="mono text-xs text-[var(--muted)]">NUS, 2026–27</span>
              </div>
              <div className="flex flex-col gap-1 pl-6 sm:pl-[26px] border-l border-white/10">
                <button className="text-left text-[28px] font-medium tracking-[-0.03em]"
                  onClick={() => say("the 9.58: terrible hostel food, bad wifi, a lot of late nights, and a stubborn refusal to accept anything less than an A. worth it? ask me later.")}>
                  9.58
                </button>
                <span className="mono text-xs text-[var(--muted)]">CGPA · click it</span>
              </div>
            </Enter>
          </div>
          <Enter delay={0.2} className="flex-1 flex justify-center w-full min-w-0">
            <NodeGraph />
          </Enter>
        </section>

        {/* tools ticker */}
        <div className="ticker" aria-label="Tools I work with">
          <div className="ticker-track mono text-sm text-[var(--muted)]">
            {[...tools, ...tools].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-12 pr-12 whitespace-nowrap" aria-hidden={i >= tools.length}>
                {t}<span className="text-[#4b4560]">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* 01 — projects */}
        <section id="work" className={wrap + " pt-[104px] pb-8 scroll-mt-24"}>
          <Reveal className="flex justify-between items-end gap-6 flex-wrap mb-10">
            <div className="flex flex-col gap-3">
              <span className="mono text-xs text-[var(--violet)]">01 — projects</span>
              <h2 className="m-0 font-semibold text-[clamp(38px,4.6vw,58px)] tracking-[-0.04em] leading-none">things I’ve built</h2>
            </div>
            <span className="mono text-[13px] text-[var(--muted)]">the big builds · undergrad ones hold the spot for now</span>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => <ProjectCard key={p.name} p={p} delay={(i % 2) * 0.1} />)}
          </div>
        </section>

        {/* 02 — side quests */}
        <section id="side" className={wrap + " flex flex-col lg:flex-row gap-8 pt-[72px] pb-8 scroll-mt-24"}>
          <Reveal className="flex-1 flex flex-col gap-3.5">
            <span className="mono text-xs text-[var(--pink)]">02 — the ones nobody assigned me</span>
            <h2 className="m-0 font-semibold text-[clamp(30px,3.4vw,42px)] tracking-[-0.035em] leading-[1.05]">small builds, side quests, and ideas that wouldn’t leave me alone.</h2>
            <p className="m-0 text-base text-[var(--muted)]">quick weekend things. click any of them to try it or see the code.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex-[1.2] rounded-[20px] border border-white/[0.08] bg-[#0C0B12] px-[26px] py-[22px] mono text-sm leading-[2.1] text-[var(--ink-2)]">
            <div className="text-[var(--muted)]">~/sharmishtha $ ls side-quests</div>
            {sideQuests.map((q) => (
              <a key={q.name} href={q.href || undefined} className="flex justify-between gap-4 hover:text-white" style={{ color: q.muted ? "#8C86A6" : "var(--ink)" }}>
                <span>{q.name}  <span style={{ color: q.muted ? undefined : "var(--lime)" }}>{q.status}</span></span>
                <span className="text-[var(--muted)]" aria-hidden="true">↗</span>
              </a>
            ))}
            <div>~/sharmishtha $ <span className="cursor text-[var(--lime)]">█</span></div>
          </Reveal>
        </section>

        {/* 03 — experience */}
        <section id="experience" className={wrap + " flex flex-col lg:flex-row gap-12 pt-[88px] pb-8 scroll-mt-24"}>
          <Reveal className="flex-[0.8] flex flex-col gap-3.5">
            <span className="mono text-xs text-[var(--violet)]">03 — experience</span>
            <h2 className="m-0 font-semibold text-[clamp(38px,4.6vw,58px)] tracking-[-0.04em] leading-none">where I’ve been</h2>
            <p className="m-0 text-[17px] leading-relaxed text-[var(--muted)] max-w-[380px]">the technical side I already trust myself with. the “so what does this mean for the business” part is why I’m at NUS.</p>
          </Reveal>
          <div className="flex-[1.2] flex flex-col">
            {experience.map((x, i) => (
              <Reveal key={x.role} className={"tl" + (i === experience.length - 1 ? " tl-last" : "")}>
                <span className="absolute rounded-full" style={x.current
                  ? { left: -6, top: 4, width: 11, height: 11, background: "var(--lime)", boxShadow: "0 0 0 5px rgba(198,243,107,.15)" }
                  : { left: -5, top: 5, width: 9, height: 9, background: "#3a3550" }} />
                <div className="flex justify-between gap-4 flex-wrap">
                  <span className="text-[20px] font-medium">{x.role}</span>
                  <span className="mono text-xs text-[var(--muted)]">{x.dates}</span>
                </div>
                <span className="text-[15px] text-[var(--muted)]">{x.org}</span>
                {x.text && <p className="mt-3 mb-0 text-base leading-relaxed text-[var(--ink-2)]">{x.text}</p>}
              </Reveal>
            ))}
            <Reveal className="flex flex-wrap gap-2 mt-9">
              {credentials.map((c) => <span key={c} className="mono text-xs rounded-full border border-white/10 px-3 py-2 text-[var(--ink-2)]">{c}</span>)}
            </Reveal>
          </div>
        </section>

        {/* 04 — beyond data */}
        <section id="beyond" className={wrap + " pt-[88px] pb-8 flex flex-col gap-7 scroll-mt-24"}>
          <Reveal className="flex flex-col gap-3">
            <span className="mono text-xs text-[var(--cyan)]">04 — beyond data</span>
            <h2 className="m-0 font-semibold text-[clamp(38px,4.6vw,58px)] tracking-[-0.04em] leading-none">not just a data person</h2>
            <p className="m-0 text-[17px] text-[var(--muted)]">I claim to be a very boring person. the evidence suggests otherwise.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hobbies.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.06} className="hob glass">
                <HobbyIcon name={h.icon} color={h.color} />
                <span className="text-lg font-medium">{h.title}</span>
                <span className="text-[15px] leading-[1.55] text-[var(--muted)]">{h.text}</span>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="m-0 mono text-[13px] text-[var(--muted)]">{hobbiesAlso}</Reveal>
        </section>

        {/* contact */}
        <section id="contact" className={wrap + " pt-[88px] pb-12 scroll-mt-24"}>
          <Reveal className="contact-card rounded-[32px] px-6 sm:px-16 py-11 sm:py-[84px] flex flex-col gap-6">
            <h2 className="m-0 font-semibold text-[clamp(48px,7vw,96px)] tracking-[-0.045em] leading-[0.95]">let’s <span className="holo">talk.</span></h2>
            <p className="m-0 text-lg text-[var(--ink-2)] max-w-[520px]">a role, a collab, a show recommendation, or just talking data — reach out.</p>
            <div className="flex gap-3 flex-wrap">
              <a className="btn btn-light" href={`mailto:${links.email}`}>{links.email}</a>
              <a className="btn glass" href={links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
              <a className="btn glass" href={links.github} target="_blank" rel="noreferrer">github</a>
            </div>
          </Reveal>
          <div className="mono flex justify-between flex-wrap gap-3 pt-8 text-xs text-[var(--muted)]">
            <span>designed and built by sharmishtha bharti · {new Date().getFullYear()}</span>
            <span>⌘K for commands · double click for confetti · type “data” · click sb. five times</span>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
