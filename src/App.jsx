import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const ROLES = ["Data Engineer", "Analytics Engineer", "ML Enthusiast", "NUS MSBA 2026", "Problem Solver"];

function useTypewriter(words, speed) {
  var spd = speed || 80;
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) { setTimeout(() => setDeleting(true), 1200); return; }
    if (subIndex === 0 && deleting) { setDeleting(false); setIndex((i) => (i + 1) % words.length); return; }
    const timeout = setTimeout(() => { setText(words[index].substring(0, subIndex)); setSubIndex((s) => s + (deleting ? -1 : 1)); }, deleting ? spd / 2 : spd);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, spd]);
  return text;
}

function Particles() {
  const particles = Array.from({ length: 35 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1, duration: Math.random() * 15 + 10, delay: Math.random() * 10 }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-violet-400/20" style={{ left: p.x + "%", top: p.y + "%", width: p.size, height: p.size }} animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1] }} transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

function SpaceCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ nodes: [], lines: [], selected: null, mouse: { x: 0, y: 0 }, t: 0 });
  const COLORS = [['#c084fc','#818cf8'],['#f472b6','#c084fc'],['#67e8f9','#818cf8'],['#a78bfa','#f9a8d4'],['#38bdf8','#c084fc']];

  function makeNodes() {
    return Array.from({ length: 18 }, () => ({ x: 40 + Math.random() * 520, y: 30 + Math.random() * 260, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 2.5 + Math.random() * 2, colors: COLORS[Math.floor(Math.random() * COLORS.length)], phase: Math.random() * Math.PI * 2 }));
  }

  function hexAlpha(hex, a) { return hex + Math.floor(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0'); }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 600, H = 320;
    canvas.width = W; canvas.height = H;
    const s = stateRef.current;
    s.nodes = makeNodes();
    function getNode(x, y) { return s.nodes.find(n => Math.hypot(n.x - x, n.y - y) < 14) || null; }
    function onMove(e) { const r = canvas.getBoundingClientRect(); const sc = W / r.width; s.mouse.x = (e.clientX - r.left) * sc; s.mouse.y = (e.clientY - r.top) * sc; }
    function onClick() { const n = getNode(s.mouse.x, s.mouse.y); if (!n) { s.selected = null; return; } if (!s.selected) { s.selected = n; } else if (s.selected !== n) { s.lines.push({ a: s.selected, b: n, colors: [...s.selected.colors], alpha: 0, age: 0 }); s.selected = n; } else { s.selected = null; } }
    function onRight(e) { e.preventDefault(); s.selected = null; }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', onRight);
    let raf;
    function draw() {
      s.t += 0.012; ctx.clearRect(0, 0, W, H);
      const neb = ctx.createRadialGradient(W*0.3,H*0.4,0,W*0.3,H*0.4,280); neb.addColorStop(0,'rgba(120,80,220,0.07)'); neb.addColorStop(1,'transparent'); ctx.fillStyle=neb; ctx.fillRect(0,0,W,H);
      const neb2 = ctx.createRadialGradient(W*0.75,H*0.6,0,W*0.75,H*0.6,200); neb2.addColorStop(0,'rgba(56,189,248,0.06)'); neb2.addColorStop(1,'transparent'); ctx.fillStyle=neb2; ctx.fillRect(0,0,W,H);
      for (let i=0;i<s.nodes.length;i++) for (let j=i+1;j<s.nodes.length;j++) { const d=Math.hypot(s.nodes[i].x-s.nodes[j].x,s.nodes[i].y-s.nodes[j].y); if(d<90){ctx.beginPath();ctx.moveTo(s.nodes[i].x,s.nodes[i].y);ctx.lineTo(s.nodes[j].x,s.nodes[j].y);ctx.strokeStyle='rgba(167,139,250,'+(1-d/90)*0.18+')';ctx.lineWidth=0.5;ctx.stroke();} }
      s.lines.forEach(l => { l.alpha=Math.min(1,l.alpha+0.05);l.age+=0.02; const sh=0.6+0.4*Math.sin(l.age*2+s.t); const g=ctx.createLinearGradient(l.a.x,l.a.y,l.b.x,l.b.y); g.addColorStop(0,hexAlpha(l.colors[0],l.alpha*sh)); g.addColorStop(0.5,hexAlpha(l.colors[1],l.alpha*sh*0.8)); g.addColorStop(1,hexAlpha(l.colors[0],l.alpha*sh)); ctx.beginPath();ctx.moveTo(l.a.x,l.a.y);ctx.lineTo(l.b.x,l.b.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.shadowColor=l.colors[0];ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0; });
      if(s.selected){ctx.beginPath();ctx.moveTo(s.selected.x,s.selected.y);ctx.lineTo(s.mouse.x,s.mouse.y);ctx.strokeStyle='rgba(167,139,250,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);}
      s.nodes.forEach(n => {
        n.x+=n.vx;n.y+=n.vy; if(n.x<8||n.x>W-8)n.vx*=-1; if(n.y<8||n.y>H-8)n.vy*=-1;
        const pulse=0.7+0.3*Math.sin(s.t*1.5+n.phase); const isSel=n===s.selected;
        if(isSel){const glow=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,20);glow.addColorStop(0,hexAlpha(n.colors[1],0.4));glow.addColorStop(1,hexAlpha(n.colors[1],0));ctx.fillStyle=glow;ctx.beginPath();ctx.arc(n.x,n.y,20,0,Math.PI*2);ctx.fill();}
        const sA=0.3+0.2*Math.sin(s.t*2+n.phase); const rg=ctx.createLinearGradient(n.x-8,n.y-8,n.x+8,n.y+8); rg.addColorStop(0,hexAlpha(n.colors[0],sA));rg.addColorStop(1,hexAlpha(n.colors[1],sA)); ctx.beginPath();ctx.arc(n.x,n.y,n.r+3,0,Math.PI*2);ctx.strokeStyle=rg;ctx.lineWidth=0.8;ctx.stroke();
        const cg=ctx.createRadialGradient(n.x-0.5,n.y-0.5,0,n.x,n.y,n.r); cg.addColorStop(0,'#ffffff');cg.addColorStop(0.4,n.colors[0]);cg.addColorStop(1,n.colors[1]); ctx.beginPath();ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);ctx.fillStyle=cg;ctx.shadowColor=n.colors[0];ctx.shadowBlur=isSel?12:5;ctx.fill();ctx.shadowBlur=0;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener('mousemove',onMove); canvas.removeEventListener('click',onClick); canvas.removeEventListener('contextmenu',onRight); };
  }, []);

  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ maxHeight: 320 }} />
      <div className="flex gap-2 mt-2 justify-end">
        <button onClick={() => { stateRef.current.lines = []; stateRef.current.selected = null; }} className="text-xs px-3 py-1 rounded-full border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">clear</button>
        <button onClick={() => { stateRef.current.lines = []; stateRef.current.selected = null; }} className="text-xs px-3 py-1 rounded-full border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">shuffle</button>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-right">click nodes to connect them</p>
    </div>
  );
}

function LiveWidget() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    function tick() {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      setTime(ist.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(ist.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    tick(); const i = setInterval(tick, 1000); return () => clearInterval(i);
  }, []);
  return (
    <div className="flex flex-col gap-2 mt-6">
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs">
        <span>🕐</span><span className="text-gray-400">Bangalore</span><span className="text-gray-900 dark:text-white font-mono ml-auto">{time}</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs">
        <span>📅</span><span className="text-gray-400">Today</span><span className="text-gray-900 dark:text-white font-mono ml-auto">{date}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [easterEgg2, setEasterEgg2] = useState(false);
  const [easterEgg3, setEasterEgg3] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [typedKeys, setTypedKeys] = useState('');
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const typedText = useTypewriter(ROLES);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '@keyframes holoShift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const sections = ["about","experience","projects","skills","certifications","beyond","contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id); if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { threshold: 0.3 });
      obs.observe(el); return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (typeof e.key !== 'string') return;
      setTypedKeys(k => { const next = (k + e.key).slice(-6); if (next.toLowerCase().includes('data')) { setEasterEgg3(true); setTimeout(() => setEasterEgg3(false), 4000); } return next; });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const pieces = Array.from({ length: 20 }, (_, i) => ({ id: Date.now() + i, x: e.clientX, y: e.clientY, color: ['#c084fc','#f472b6','#67e8f9','#a78bfa','#fbbf24'][Math.floor(Math.random()*5)], dx: (Math.random()-0.5)*120, dy: (Math.random()-0.5)*120 }));
      setConfetti(c => [...c, ...pieces]);
      setTimeout(() => setConfetti(c => c.filter(p => !pieces.find(pp => pp.id === p.id))), 1000);
    };
    window.addEventListener('dblclick', handler);
    return () => window.removeEventListener('dblclick', handler);
  }, []);

  const handleLogoClick = () => { const next = logoClicks + 1; setLogoClicks(next); if (next >= 5) { setEasterEgg(true); setLogoClicks(0); } };
  const toggleFlip = (i) => setFlipped((f) => ({ ...f, [i]: !f[i] }));
  const navLinks = ["about","experience","projects","skills","certifications","beyond","contact"];

  const projects = [
    { name: "Parkinsons Detection", desc: "Hybrid CNN-DNN model integrating image and tabular data to improve diagnostic performance.", back: "Achieved improved diagnostic accuracy by combining visual and clinical data streams using deep learning.", tags: ["Python","CNN","DNN","ML"], icon: "🧠" },
    { name: "Customer Churn Prediction", desc: "Classification models to identify high-risk customers and support retention strategies.", back: "Used ensemble methods to flag at-risk customers, enabling proactive retention with measurable business impact.", tags: ["Python","XGBoost","Sklearn"], icon: "📉" },
    { name: "Drug Prescription Analysis", desc: "NLP pipeline extracting insights from consumer reviews using NLTK for decision support.", back: "Processed thousands of reviews to surface prescribing patterns and patient sentiment at scale.", tags: ["Python","NLP","NLTK"], icon: "💊" },
    { name: "Diabetes Prediction", desc: "Comparative analysis of ML models with feature engineering and optimization.", back: "Benchmarked 6 classifiers with custom feature engineering, improving baseline accuracy significantly.", tags: ["Python","ML","Feature Engineering"], icon: "🔬" },
  ];

  const card = "p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02]";
  const sL = "text-xs text-violet-500 tracking-widest uppercase mb-6 flex items-center gap-2";
  const sT = "text-4xl font-bold mb-10 text-gray-900 dark:text-white";
  const bT = "text-gray-600 dark:text-gray-400 leading-relaxed";

  const holoStyle = {
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #4facfe 60%, #764ba2 80%, #667eea 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "holoShift 4s linear infinite",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080f] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 overflow-x-hidden">

      <div className="fixed pointer-events-none z-[999]" style={{ left: mousePos.x - 4, top: mousePos.y - 4, width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }} />
      <div className="fixed pointer-events-none z-[998]" style={{ left: mousePos.x - 16, top: mousePos.y - 16, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(167,139,250,0.4)', transition: 'left 0.06s ease-out, top 0.06s ease-out' }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(800px at " + mousePos.x + "px " + mousePos.y + "px, rgba(120,119,198,0.08), transparent 70%)" }} />

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]" style={{ scaleX, backgroundImage: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #667eea)", backgroundSize: "200% auto", animation: "holoShift 3s linear infinite" }} />
      <Particles />

      {confetti.map(p => (
        <motion.div key={p.id} className="fixed pointer-events-none z-[600] w-2 h-2 rounded-full" style={{ left: p.x, top: p.y, background: p.color }} initial={{ scale: 1, x: 0, y: 0, opacity: 1 }} animate={{ x: p.dx, y: p.dy, scale: 0, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      ))}

      <AnimatePresence>
        {easterEgg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setEasterEgg(false)}>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8 }} className="bg-white dark:bg-[#0e0e1a] border border-violet-500/40 rounded-3xl p-10 max-w-sm text-center shadow-2xl">
              <div className="text-6xl mb-4">👾</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">you found me!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">okay you are clearly curious and detail-oriented. hire me immediately.</p>
              <button onClick={() => setEasterEgg(false)} className="mt-6 px-6 py-2 bg-violet-600 rounded-full text-sm text-white hover:bg-violet-700 transition-all">hehe okay</button>
            </motion.div>
          </motion.div>
        )}
        {easterEgg2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setEasterEgg2(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white dark:bg-[#0e0e1a] border border-green-500/40 rounded-3xl p-10 max-w-sm text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">psst!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">this 9.58 was not easy. late nights, early mornings, a lot of coffee. worth it though.</p>
              <button onClick={() => setEasterEgg2(false)} className="mt-6 px-6 py-2 bg-green-600 rounded-full text-sm text-white">respect 🫡</button>
            </motion.div>
          </motion.div>
        )}
        {easterEgg3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] bg-white dark:bg-[#0e0e1a] border border-cyan-500/40 rounded-2xl px-6 py-4 text-center shadow-xl">
            <p className="text-cyan-500 font-medium text-sm">you typed data - a person of culture i see</p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-[2px] left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-gray-50/80 dark:bg-[#08080f]/80 border-b border-gray-200 dark:border-white/5">
        <span onClick={handleLogoClick} className="font-bold text-lg tracking-tight cursor-pointer select-none text-gray-900 dark:text-white">sb<span className="text-violet-500">.</span></span>
        <div className="flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <a key={link} href={"#" + link} className={activeSection === link ? "text-violet-500 font-medium" : "text-gray-500 dark:text-gray-400 hover:text-violet-500 transition-colors"}>{link}</a>
          ))}
          <button onClick={() => setDark(d => !d)} className="ml-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-400">
            {dark ? "light" : "dark"}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">

        <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="mb-32 min-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-500 text-xs font-medium mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse cursor-pointer" onClick={() => setEasterEgg2(true)} />
              open to opportunities
            </motion.div>
            <h1 className="text-7xl font-bold tracking-tight mb-2 leading-none">
              <span className="block text-gray-900 dark:text-white">Sharmishtha</span>
              <span className="block" style={holoStyle}>Bharti.</span>
            </h1>
            <div className="flex items-center gap-2 mt-6 mb-6 h-10">
              <span className="text-xl text-gray-500 dark:text-gray-400 font-medium">{typedText}</span>
              <span className="w-0.5 h-7 bg-violet-500 animate-pulse" />
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              I grew up genuinely curious about why things work the way they do — turns out that curiosity found its home in data. From building my first ML model as an intern to working on enterprise-scale pipelines at <span className="text-gray-900 dark:text-white font-semibold">PwC</span>, I have always been drawn to the messy, interesting problems. Now heading to <span className="text-gray-900 dark:text-white font-semibold">NUS Singapore</span> to sharpen the business side of that brain.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <a href="#projects" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-sm font-medium transition-all hover:scale-105">see my work</a>
              <a href="#contact" className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-gray-300">get in touch</a>
              <a href="/resume.pdf" download className="px-6 py-3 border border-violet-500/30 text-violet-500 rounded-full text-sm hover:bg-violet-500/10 transition-all">resume</a>
            </div>
            <LiveWidget />
          </div>
          <div className="hidden md:block"><SpaceCanvas /></div>
        </motion.section>

        <motion.section id="about" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />01 about</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className={sT}>a little about me</h2>
              <p className={bT}>I am a data engineer and analyst who loves building things that actually work — pipelines, dashboards, models, the whole stack. Currently at PwC AC India in Bangalore, translating messy business problems into clean analytics solutions for global clients.</p>
              <p className={bT + " mt-4"}>Outside work I am getting back to building passion projects, exploring AI tools, and running a little Pinterest corner called Neo Pearl Pins. This fall I head to NUS Singapore for my MSBA — new city, new chapter.</p>
              <p className={bT + " mt-4"}>9.58 CGPA from SRM Chennai. McKinsey Forward alumni. Won a pitch competition for a mental health app. Amazon ML Summer School 2023. Basically always in the middle of something.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "current role", value: "Associate @ PwC", icon: "💼" },
                { label: "location", value: "Bangalore, India", icon: "📍" },
                { label: "next chapter", value: "NUS Singapore", icon: "🎓" },
                { label: "cgpa", value: "9.58 / 10", icon: "⭐", secret: true },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ scale: 1.04 }} onClick={() => item.secret && setEasterEgg2(true)} className={card + " hover:border-violet-300 dark:hover:border-violet-500/30 transition-all cursor-pointer"}>
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="experience" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />02 experience</p>
          <h2 className={sT}>where I have been</h2>
          <div className="space-y-6">
            {[
              { role: "Associate - Data and Analytics", company: "PwC AC India", period: "Aug 2024 - Present", location: "Bangalore", icon: "🏢", points: ["Partnered with global clients to translate business problems into scalable analytics solutions", "Built data models using DBT and Snowflake for enterprise-level reporting", "Designed and maintained ETL pipelines using Informatica IICS for cloud data integration", "Contributed to a Teradata to Snowflake migration initiative with zero downtime", "Developed automated Power BI dashboards using SQL for faster decision-making", "Supported transition to Databricks as part of broader cloud modernisation efforts", "Presented analytical insights and recommendations to senior stakeholders"] },
              { role: "Intern - Data and Analytics", company: "PwC AC India", period: "Apr 2024 - Aug 2024", location: "Bangalore", icon: "🚀", points: ["Built sales forecasting models using ARIMA, Holt-Winters, Random Forest and XGBoost", "Evaluated and benchmarked model performance across multiple approaches", "Delivered actionable business recommendations based on forecasting outputs"] },
            ].map((job, i) => (
              <motion.div key={i} whileHover={{ x: 6 }} className={card + " hover:border-violet-300 dark:hover:border-violet-500/30 transition-all"}>
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{job.icon}</span>
                    <div><h3 className="font-semibold text-gray-900 dark:text-white">{job.role}</h3><p className="text-violet-500 text-sm">{job.company} - {job.location}</p></div>
                  </div>
                  <span className="text-xs text-gray-400 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full">{job.period}</span>
                </div>
                <ul className="space-y-2 ml-11">{job.points.map((p, j) => (<li key={j} className={bT + " flex gap-2 text-sm"}><span className="text-violet-500 mt-0.5 flex-shrink-0">›</span>{p}</li>))}</ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="projects" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />03 projects</p>
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">things I have built</h2>
          <p className="text-gray-400 mb-10">click a card to flip it</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <div key={i} className="h-52 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => toggleFlip(i)}>
                <motion.div animate={{ rotateY: flipped[i] ? 180 : 0 }} transition={{ duration: 0.5, type: "spring" }} style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}>
                  <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }} className={card + " hover:border-violet-300 dark:hover:border-violet-500/30 transition-all flex flex-col justify-between"}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2"><span className="text-xl">{project.icon}</span><h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">built</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">{project.tags.map((tag) => (<span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">{tag}</span>))}</div>
                  </div>
                  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }} className="p-6 rounded-2xl border border-violet-500/30 bg-violet-50 dark:bg-violet-950/40 flex flex-col justify-center">
                    <div className="text-3xl mb-3">{project.icon}</div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.back}</p>
                    <p className="text-xs text-violet-500 mt-4">click to flip back</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="skills" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />04 skills</p>
          <h2 className={sT}>what I work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: "Languages", items: ["Python", "SQL", "R", "Bash"], color: "from-blue-500/10 to-violet-500/10" },
              { category: "Data and Cloud", items: ["Snowflake", "AWS", "Azure", "Databricks", "DBT", "Informatica IICS", "Teradata", "BigQuery", "Redshift"], color: "from-violet-500/10 to-pink-500/10" },
              { category: "ML and AI", items: ["Scikit-learn", "XGBoost", "ARIMA", "TensorFlow", "NLTK", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"], color: "from-pink-500/10 to-orange-500/10" },
              { category: "Tools and Viz", items: ["Power BI", "Tableau", "Excel", "Git", "VS Code", "Streamlit", "FastAPI"], color: "from-cyan-500/10 to-violet-500/10" },
            ].map((group) => (
              <motion.div key={group.category} whileHover={{ scale: 1.01 }} className={"p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-violet-300 dark:hover:border-violet-500/20 transition-all bg-gradient-to-br " + group.color}>
                <p className="text-xs text-violet-500 tracking-widest uppercase mb-4 font-medium">{group.category}</p>
                <div className="flex flex-wrap gap-2">{group.items.map((item) => (<motion.span key={item} whileHover={{ scale: 1.1 }} className="text-sm px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-700 dark:hover:text-violet-300 transition-all cursor-default border border-gray-200 dark:border-white/5">{item}</motion.span>))}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="certifications" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />05 certifications and awards</p>
          <h2 className={sT}>credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Microsoft Azure AZ-900", issuer: "Microsoft", type: "cert", icon: "☁️" },
              { name: "Microsoft Azure AI-900", issuer: "Microsoft", type: "cert", icon: "🤖" },
              { name: "Microsoft Azure DP-900", issuer: "Microsoft", type: "cert", icon: "📊" },
              { name: "AWS Machine Learning", issuer: "Amazon Web Services", type: "cert", icon: "🧠" },
              { name: "McKinsey Forward Program", issuer: "McKinsey and Company", type: "award", icon: "🏆" },
              { name: "Amazon ML Summer School 2023", issuer: "Amazon", type: "award", icon: "🌟" },
              { name: "Pitch Craft - 1st Prize", issuer: "Mental Health App", type: "award", icon: "🥇" },
              { name: "Academic Scholarship 2020-21", issuer: "SRM Institute", type: "award", icon: "🎓" },
            ].map((cert, i) => (
              <motion.div key={i} whileHover={{ x: 6 }} className={card + " flex items-center gap-4 hover:border-violet-300 dark:hover:border-violet-500/20 transition-all"}>
                <span className="text-2xl">{cert.icon}</span>
                <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 dark:text-white">{cert.name}</p><p className="text-sm text-gray-400">{cert.issuer}</p></div>
                <span className={cert.type === "cert" ? "text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex-shrink-0" : "text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex-shrink-0"}>{cert.type === "cert" ? "certified" : "award"}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="beyond" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />06 beyond data</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">not just a data person</h2>
          <p className={bT + " mb-10 max-w-lg"}>there is a whole other side to me outside of pipelines and models.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.a href="https://pinterest.com/neopearlpins" target="_blank" rel="noreferrer" whileHover={{ y: -4 }} className={card + " hover:border-pink-300 dark:hover:border-pink-500/30 transition-all group block"}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-xl">📌</div>
                <div><p className="font-semibold text-gray-900 dark:text-white">Neo Pearl Pins</p><p className="text-xs text-pink-400">Pinterest - @neopearlpins</p></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Digital lifestyle and productivity content with a twist. Aesthetic visuals, handy product picks and digital products. Because life is not just about data.</p>
              <p className="text-xs text-pink-400 mt-4 group-hover:text-pink-300 transition-colors">visit pinterest</p>
            </motion.a>
            <motion.div whileHover={{ y: -4 }} className={card + " hover:border-violet-300 dark:hover:border-violet-500/20 transition-all"}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">🌏</div>
                <div><p className="font-semibold text-gray-900 dark:text-white">next adventure</p><p className="text-xs text-violet-500">Singapore - Fall 2026</p></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Heading to NUS Singapore for my MSBA. New city, new chapter, probably discovering the best hawker centres while debugging code at odd hours.</p>
              <div className="flex gap-2 mt-4 flex-wrap">{["NUS MSBA", "Singapore", "Fall 2026"].map(t => (<span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">{t}</span>))}</div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="contact" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <p className={sL}><span className="w-8 h-px bg-violet-500" />07 contact</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">lets talk</h2>
          <p className={bT + " mb-10 max-w-md"}>always up for a good conversation — a role, a collab, or just talking data. reach out!</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "email", href: "mailto:sharmishthabhar@gmail.com", value: "sharmishthabhar@gmail.com" },
              { label: "linkedin", href: "https://linkedin.com/in/sharmishtha-bharti-8ab54b209", value: "sharmishtha-bharti" },
              { label: "github", href: "https://github.com/Sharmishtha-b", value: "Sharmishtha-b" },
            ].map((link) => (
              <motion.a key={link.label} href={link.href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} className={card + " flex items-center gap-3 px-5 py-4 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group"}>
                <div>
                  <div className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors mb-0.5">{link.label}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{link.value}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

      </main>

      <footer className="relative z-10 border-t border-gray-200 dark:border-white/5 py-8 text-center">
        <p className="text-sm text-gray-400">designed and built by sharmishtha bharti {new Date().getFullYear()}</p>
        <p className="text-xs text-gray-300 dark:text-gray-700 mt-2">double click anywhere - type data - click sb. five times</p>
      </footer>

    </div>
  );
}
