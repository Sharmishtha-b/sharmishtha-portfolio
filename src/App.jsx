import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const ROLES = ["Data Engineer", "Analytics Engineer", "ML Enthusiast", "NUS MSBA 2026", "Problem Solver"];

const HOLO = "linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #4facfe 60%, #a18cd1 80%, #667eea 100%)";
const HOLO_ANIM = { backgroundImage: HOLO, backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", animation: "holoShift 4s linear infinite" };
const HOLO_BORDER = { backgroundImage: HOLO, backgroundSize: "200% auto", animation: "holoShift 4s linear infinite" };

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
  const particles = Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1, duration: Math.random() * 15 + 10, delay: Math.random() * 10 }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-violet-400/10" style={{ left: p.x + "%", top: p.y + "%", width: p.size, height: p.size }} animate={{ y: [0, -40, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

function SpaceCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ nodes: [], lines: [], selected: null, mouse: { x: 0, y: 0 }, t: 0 });
  const COLORS = [['#c084fc','#818cf8'],['#f472b6','#c084fc'],['#67e8f9','#818cf8'],['#a78bfa','#f9a8d4'],['#38bdf8','#c084fc']];
  function makeNodes() { return Array.from({ length: 16 }, () => ({ x: 40 + Math.random() * 520, y: 30 + Math.random() * 260, vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35, r: 2.5+Math.random()*2, colors: COLORS[Math.floor(Math.random()*COLORS.length)], phase: Math.random()*Math.PI*2 })); }
  function hexAlpha(hex, a) { return hex + Math.floor(Math.max(0,Math.min(1,a))*255).toString(16).padStart(2,'0'); }
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const W=600,H=320; canvas.width=W; canvas.height=H;
    const s = stateRef.current; s.nodes = makeNodes();
    function getNode(x,y){return s.nodes.find(n=>Math.hypot(n.x-x,n.y-y)<14)||null;}
    function onMove(e){const r=canvas.getBoundingClientRect();const sc=W/r.width;s.mouse.x=(e.clientX-r.left)*sc;s.mouse.y=(e.clientY-r.top)*sc;}
    function onClick(){const n=getNode(s.mouse.x,s.mouse.y);if(!n){s.selected=null;return;}if(!s.selected){s.selected=n;}else if(s.selected!==n){s.lines.push({a:s.selected,b:n,colors:[...s.selected.colors],alpha:0,age:0});s.selected=n;}else{s.selected=null;}}
    function onRight(e){e.preventDefault();s.selected=null;}
    canvas.addEventListener('mousemove',onMove); canvas.addEventListener('click',onClick); canvas.addEventListener('contextmenu',onRight);
    let raf;
    function draw() {
      s.t+=0.012; ctx.clearRect(0,0,W,H);
      const neb=ctx.createRadialGradient(W*0.3,H*0.4,0,W*0.3,H*0.4,280); neb.addColorStop(0,'rgba(120,80,220,0.07)'); neb.addColorStop(1,'transparent'); ctx.fillStyle=neb; ctx.fillRect(0,0,W,H);
      const neb2=ctx.createRadialGradient(W*0.75,H*0.6,0,W*0.75,H*0.6,200); neb2.addColorStop(0,'rgba(56,189,248,0.06)'); neb2.addColorStop(1,'transparent'); ctx.fillStyle=neb2; ctx.fillRect(0,0,W,H);
      for(let i=0;i<s.nodes.length;i++)for(let j=i+1;j<s.nodes.length;j++){const d=Math.hypot(s.nodes[i].x-s.nodes[j].x,s.nodes[i].y-s.nodes[j].y);if(d<90){ctx.beginPath();ctx.moveTo(s.nodes[i].x,s.nodes[i].y);ctx.lineTo(s.nodes[j].x,s.nodes[j].y);ctx.strokeStyle='rgba(167,139,250,'+(1-d/90)*0.15+')';ctx.lineWidth=0.5;ctx.stroke();}}
      s.lines.forEach(l=>{l.alpha=Math.min(1,l.alpha+0.05);l.age+=0.02;const sh=0.6+0.4*Math.sin(l.age*2+s.t);const g=ctx.createLinearGradient(l.a.x,l.a.y,l.b.x,l.b.y);g.addColorStop(0,hexAlpha(l.colors[0],l.alpha*sh));g.addColorStop(0.5,hexAlpha(l.colors[1],l.alpha*sh*0.8));g.addColorStop(1,hexAlpha(l.colors[0],l.alpha*sh));ctx.beginPath();ctx.moveTo(l.a.x,l.a.y);ctx.lineTo(l.b.x,l.b.y);ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.shadowColor=l.colors[0];ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0;});
      if(s.selected){ctx.beginPath();ctx.moveTo(s.selected.x,s.selected.y);ctx.lineTo(s.mouse.x,s.mouse.y);ctx.strokeStyle='rgba(167,139,250,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);}
      s.nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<8||n.x>W-8)n.vx*=-1;if(n.y<8||n.y>H-8)n.vy*=-1;const pulse=0.7+0.3*Math.sin(s.t*1.5+n.phase);const isSel=n===s.selected;if(isSel){const glow=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,20);glow.addColorStop(0,hexAlpha(n.colors[1],0.4));glow.addColorStop(1,hexAlpha(n.colors[1],0));ctx.fillStyle=glow;ctx.beginPath();ctx.arc(n.x,n.y,20,0,Math.PI*2);ctx.fill();}const sA=0.3+0.2*Math.sin(s.t*2+n.phase);const rg=ctx.createLinearGradient(n.x-8,n.y-8,n.x+8,n.y+8);rg.addColorStop(0,hexAlpha(n.colors[0],sA));rg.addColorStop(1,hexAlpha(n.colors[1],sA));ctx.beginPath();ctx.arc(n.x,n.y,n.r+3,0,Math.PI*2);ctx.strokeStyle=rg;ctx.lineWidth=0.8;ctx.stroke();const cg=ctx.createRadialGradient(n.x-0.5,n.y-0.5,0,n.x,n.y,n.r);cg.addColorStop(0,'#ffffff');cg.addColorStop(0.4,n.colors[0]);cg.addColorStop(1,n.colors[1]);ctx.beginPath();ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);ctx.fillStyle=cg;ctx.shadowColor=n.colors[0];ctx.shadowBlur=isSel?12:5;ctx.fill();ctx.shadowBlur=0;});
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',onMove);canvas.removeEventListener('click',onClick);canvas.removeEventListener('contextmenu',onRight);};
  }, []);
  return (
    <div className="relative w-full">
      <canvas ref={canvasRef} className="w-full rounded-2xl" style={{maxHeight:320}} />
      <div className="flex gap-2 mt-2 justify-end">
        <button onClick={()=>{stateRef.current.lines=[];stateRef.current.selected=null;}} className="text-xs px-3 py-1 rounded-full border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">clear</button>
        <button onClick={()=>{stateRef.current.lines=[];stateRef.current.selected=null;}} className="text-xs px-3 py-1 rounded-full border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">shuffle</button>
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">click nodes to connect them</p>
    </div>
  );
}

function LiveWidget({ onClockClick }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    function tick() {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
      setTime(ist.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}));
      setDate(ist.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}));
    }
    tick(); const i=setInterval(tick,1000); return ()=>clearInterval(i);
  },[]);
  return (
    <div className="flex flex-col gap-2 mt-6">
      <div onClick={onClockClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group">
        <span>🕐</span><span className="text-gray-400 group-hover:text-violet-400 transition-colors">Bangalore</span><span className="text-gray-900 dark:text-white font-mono ml-auto">{time}</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs">
        <span>📅</span><span className="text-gray-400">Today</span><span className="text-gray-900 dark:text-white font-mono ml-auto">{date}</span>
      </div>
    </div>
  );
}

function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const items = [
    { label: 'About me', icon: '👋', href: '#about' },
    { label: 'Experience at PwC', icon: '🏢', href: '#experience' },
    { label: 'My projects', icon: '🔬', href: '#projects' },
    { label: 'Skills and tools', icon: '⚡', href: '#skills' },
    { label: 'Certifications', icon: '🏆', href: '#certifications' },
    { label: 'Beyond data', icon: '✨', href: '#beyond' },
    { label: 'Contact me', icon: '💬', href: '#contact' },
    { label: 'Email Sharmishtha', icon: '✉️', href: 'mailto:sharmishthabhar@gmail.com' },
    { label: 'LinkedIn profile', icon: '💼', href: 'https://linkedin.com/in/sharmishtha-bharti-8ab54b209' },
    { label: 'GitHub profile', icon: '🐙', href: 'https://github.com/Sharmishtha-b' },
    { label: 'Neo Pearl Pins (Pinterest)', icon: '📌', href: 'https://pinterest.com/neopearlpins' },
  ];
  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-start justify-center pt-32 bg-black/60 backdrop-blur-md px-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} className="w-full max-w-lg bg-white dark:bg-[#0e0e18] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/5">
          <span className="text-gray-400 text-sm">⌘</span>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm outline-none placeholder-gray-400" />
          <kbd className="text-xs text-gray-400 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded">esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.map((item, i) => (
            <a key={i} href={item.href} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-violet-500 transition-colors">{item.label}</span>
              <span className="ml-auto text-xs text-gray-400">↵</span>
            </a>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-8">nothing found for "{query}"</p>}
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 flex items-center gap-4 text-xs text-gray-400">
          <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TimezoneModal({ onClose }) {
  const zones = [
    { city: 'Bangalore', tz: 'Asia/Kolkata', flag: '🇮🇳' },
    { city: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬' },
    { city: 'London', tz: 'Europe/London', flag: '🇬🇧' },
    { city: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
    { city: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  ];
  const [times, setTimes] = useState({});
  useEffect(() => {
    function tick() {
      const now = new Date();
      const t = {};
      zones.forEach(z => { t[z.city] = new Date(now.toLocaleString('en-US',{timeZone:z.tz})).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}); });
      setTimes(t);
    }
    tick(); const i = setInterval(tick,1000); return ()=>clearInterval(i);
  },[]);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9}} className="bg-white dark:bg-[#0e0e18] border border-gray-200 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl" onClick={e=>e.stopPropagation()}>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">world clock</h3>
        <p className="text-xs text-gray-400 mb-6">where is sharmishtha right now? bangalore. where is she headed? singapore.</p>
        <div className="space-y-3">
          {zones.map(z => (
            <div key={z.city} className={"flex items-center justify-between p-3 rounded-xl " + (z.city==='Bangalore'||z.city==='Singapore' ? "bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20" : "bg-gray-50 dark:bg-white/5")}>
              <div className="flex items-center gap-2">
                <span>{z.flag}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{z.city}</span>
                {z.city==='Singapore' && <span className="text-xs text-violet-500 bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 rounded-full">soon</span>}
              </div>
              <span className="text-sm font-mono text-gray-900 dark:text-white">{times[z.city]||'--:--'}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-2 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">close</button>
      </motion.div>
    </motion.div>
  );
}

function ScreenSaver({ onDismiss }) {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [vel, setVel] = useState({ x: 1.5, y: 1.2 });
  useEffect(() => {
    const i = setInterval(() => {
      setPos(p => {
        setVel(v => {
          const nx = v.x * (p.x<=0||p.x>=window.innerWidth-200 ? -1 : 1);
          const ny = v.y * (p.y<=0||p.y>=window.innerHeight-80 ? -1 : 1);
          return { x: nx, y: ny };
        });
        return { x: Math.max(0,Math.min(window.innerWidth-200,p.x+vel.x*2)), y: Math.max(0,Math.min(window.innerHeight-80,p.y+vel.y*2)) };
      });
    }, 16);
    const k = (e) => { if(e.key||e.type==='click') onDismiss(); };
    window.addEventListener('keydown', k); window.addEventListener('click', k);
    return () => { clearInterval(i); window.removeEventListener('keydown',k); window.removeEventListener('click',k); };
  },[vel, onDismiss]);
  return (
    <div className="fixed inset-0 z-[600] bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-800 text-sm">press any key to wake up</p>
      </div>
      <div className="absolute transition-none" style={{left:pos.x,top:pos.y}}>
        <div className="px-6 py-3 rounded-2xl text-white font-bold text-lg" style={{background:HOLO,backgroundSize:'200% auto',animation:'holoShift 3s linear infinite'}}>
          sb.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEaster1, setShowEaster1] = useState(false);
  const [showEaster2, setShowEaster2] = useState(false);
  const [showEaster3, setShowEaster3] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showCmd, setShowCmd] = useState(false);
  const [showScreenSaver, setShowScreenSaver] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [typedKeys, setTypedKeys] = useState('');
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [hoveredNav, setHoveredNav] = useState(null);
  const idleTimer = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const typedText = useTypewriter(ROLES);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '@keyframes holoShift{0%{background-position:0% center}100%{background-position:200% center}}';
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setShowScreenSaver(true), 30000);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    return () => { window.removeEventListener('mousemove', resetIdle); window.removeEventListener('keydown', resetIdle); clearTimeout(idleTimer.current); };
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
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setShowCmd(c => !c); return; }
      if (typeof e.key !== 'string') return;
      setTypedKeys(k => {
        const next = (k + e.key).slice(-10);
        if (next.toLowerCase().includes('data')) { setShowEaster3(true); setTimeout(() => setShowEaster3(false), 4000); }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const pieces = Array.from({length:18},(_,i)=>({id:Date.now()+i,x:e.clientX,y:e.clientY,color:['#c084fc','#f472b6','#67e8f9','#a78bfa','#fbbf24'][Math.floor(Math.random()*5)],dx:(Math.random()-0.5)*120,dy:(Math.random()-0.5)*120}));
      setConfetti(c=>[...c,...pieces]);
      setTimeout(()=>setConfetti(c=>c.filter(p=>!pieces.find(pp=>pp.id===p.id))),1000);
    };
    window.addEventListener('dblclick', handler);
    return () => window.removeEventListener('dblclick', handler);
  }, []);

  const handleLogoClick = () => { const next = logoClicks+1; setLogoClicks(next); if (next>=5){setShowEaster1(true);setLogoClicks(0);} };
  const toggleFlip = (i) => setFlipped(f=>({...f,[i]:!f[i]}));
  const navLinks = ["about","experience","projects","skills","certifications","beyond","contact"];

  const projects = [
    { name: "Parkinsons Detection", desc: "Hybrid CNN-DNN model integrating image and tabular data to improve diagnostic performance.", back: "Combined visual MRI data with clinical tabular features — two completely different data types feeding one model. Genuinely interesting problem.", tags: ["Python","CNN","DNN","ML"], icon: "🧠" },
    { name: "Customer Churn Prediction", desc: "Classification models to identify high-risk customers and support retention strategies.", back: "The interesting part was not the model — it was figuring out which features actually mattered for a business decision, not just accuracy.", tags: ["Python","XGBoost","Sklearn"], icon: "📉" },
    { name: "Drug Prescription Analysis", desc: "NLP pipeline extracting insights from consumer reviews using NLTK for decision support.", back: "Real messy text data, real messy opinions. Cleaning it and making sense of patterns across thousands of reviews was the actual challenge.", tags: ["Python","NLP","NLTK"], icon: "💊" },
    { name: "Diabetes Prediction", desc: "Comparative analysis of ML models with feature engineering and optimization.", back: "Ran 6 different classifiers, spent more time on feature engineering than modelling. That is usually where the real work is.", tags: ["Python","ML","Feature Engineering"], icon: "🔬" },
  ];

  const card = "rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02]";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080f] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500 overflow-x-hidden">

      <div className="fixed pointer-events-none z-[999]" style={{left:mousePos.x-4,top:mousePos.y-4,width:8,height:8,borderRadius:'50%',background:'#a78bfa',position:'fixed'}} />
      <div className="fixed pointer-events-none z-[998]" style={{left:mousePos.x-16,top:mousePos.y-16,width:32,height:32,borderRadius:'50%',border:'1px solid rgba(167,139,250,0.4)',position:'fixed',transition:'left 0.06s ease-out,top 0.06s ease-out'}} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{background:"radial-gradient(800px at "+mousePos.x+"px "+mousePos.y+"px, rgba(120,119,198,0.07), transparent 70%)"}} />
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200]" style={{scaleX,backgroundImage:HOLO,backgroundSize:'200% auto',animation:'holoShift 3s linear infinite'}} />
      <Particles />

      {confetti.map(p=>(
        <motion.div key={p.id} className="fixed pointer-events-none z-[600] w-2 h-2 rounded-full" style={{left:p.x,top:p.y,background:p.color}} initial={{scale:1,x:0,y:0,opacity:1}} animate={{x:p.dx,y:p.dy,scale:0,opacity:0}} transition={{duration:0.9,ease:"easeOut"}} />
      ))}

      <AnimatePresence>
        {showEaster1 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={()=>setShowEaster1(false)}>
            <motion.div initial={{scale:0.8,y:30}} animate={{scale:1,y:0}} exit={{scale:0.8}} className="bg-white dark:bg-[#0e0e18] border border-violet-500/30 rounded-3xl p-10 max-w-sm text-center shadow-2xl">
              <div className="text-6xl mb-4">👾</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">you found me!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">okay you clicked sb. five times. you are clearly a very thorough person. that is a green flag in data engineering.</p>
              <button onClick={()=>setShowEaster1(false)} className="mt-6 px-6 py-2 rounded-full text-sm text-white transition-all" style={{background:HOLO,backgroundSize:'200% auto',animation:'holoShift 3s linear infinite'}}>noted, hire her</button>
            </motion.div>
          </motion.div>
        )}
        {showEaster2 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={()=>setShowEaster2(false)}>
            <motion.div initial={{scale:0.8}} animate={{scale:1}} exit={{scale:0.8}} className="bg-white dark:bg-[#0e0e18] border border-green-500/30 rounded-3xl p-10 max-w-sm text-center shadow-2xl">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">about this 9.58</h3>
              <p className="text-gray-500 text-sm leading-relaxed">late nights, terrible hostel food, bad wifi, and a stubborn refusal to get anything less than an A. was it worth it? ask me in singapore.</p>
              <button onClick={()=>setShowEaster2(false)} className="mt-6 px-6 py-2 bg-green-600 rounded-full text-sm text-white">respect honestly</button>
            </motion.div>
          </motion.div>
        )}
        {showEaster3 && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] bg-white dark:bg-[#0e0e18] border border-cyan-500/30 rounded-2xl px-6 py-4 text-center shadow-xl">
            <p className="text-cyan-500 font-medium text-sm">you typed data. you belong here.</p>
          </motion.div>
        )}
        {showClock && <TimezoneModal onClose={()=>setShowClock(false)} />}
        {showCmd && <CommandPalette onClose={()=>setShowCmd(false)} />}
        {showScreenSaver && <ScreenSaver onDismiss={()=>setShowScreenSaver(false)} />}
      </AnimatePresence>

      <nav className="fixed top-[2px] left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-gray-50/80 dark:bg-[#08080f]/80 border-b border-gray-200 dark:border-white/5">
        <span onClick={handleLogoClick} className="font-bold text-lg tracking-tight cursor-pointer select-none" style={HOLO_ANIM}>sb.</span>
        <div className="flex items-center gap-5 text-sm">
          {navLinks.map((link) => (
            <a key={link} href={"#"+link} onMouseEnter={()=>setHoveredNav(link)} onMouseLeave={()=>setHoveredNav(null)}
              className="transition-all relative"
              style={hoveredNav===link ? {...HOLO_ANIM,fontWeight:500} : activeSection===link ? {...HOLO_ANIM,fontWeight:500} : {color:'rgb(107,114,128)'}}>
              {link}
            </a>
          ))}
          <button onClick={()=>setShowCmd(true)} className="text-xs text-gray-400 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-lg hover:border-violet-400 transition-all">⌘K</button>
          <button onClick={()=>setDark(d=>!d)} className="px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-400">{dark?"light":"dark"}</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">

        <motion.section initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.9}} className="mb-32 min-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-500 text-xs font-medium mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse cursor-pointer" onClick={()=>setShowEaster2(true)} />
              open to opportunities
            </motion.div>
            <h1 className="text-7xl font-bold tracking-tight mb-2 leading-none">
              <span className="block text-gray-900 dark:text-white">Sharmishtha</span>
              <span className="block" style={HOLO_ANIM}>Bharti.</span>
            </h1>
            <div className="flex items-center gap-2 mt-6 mb-6 h-10">
              <span className="text-xl font-medium" style={HOLO_ANIM}>{typedText}</span>
              <span className="w-0.5 h-7 bg-violet-500 animate-pulse" />
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              The kind of person who is quietly observing in the corner at parties but loudly debugging pipelines at work.
              I ended up in data because I cannot stop asking <span className="text-gray-900 dark:text-white font-medium">why things work the way they do</span> — and data is the closest thing to an honest answer.
              Currently at <span className="text-gray-900 dark:text-white font-medium">PwC</span>, heading to <span className="text-gray-900 dark:text-white font-medium">NUS Singapore</span> this fall.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <a href="#projects" className="px-6 py-3 text-white rounded-full text-sm font-medium transition-all hover:scale-105 hover:opacity-90" style={{background:HOLO,backgroundSize:'200% auto',animation:'holoShift 4s linear infinite'}}>see my work</a>
              <a href="#contact" className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-gray-300">get in touch</a>
              <a href="/resume.pdf" download className="px-6 py-3 border border-violet-500/30 text-violet-500 rounded-full text-sm hover:bg-violet-500/10 transition-all">resume</a>
            </div>
            <LiveWidget onClockClick={()=>setShowClock(true)} />
          </div>
          <div className="hidden md:block"><SpaceCanvas /></div>
        </motion.section>

        <motion.section id="about" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />01 about</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">a little about me</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">I am a data engineer at PwC AC India, which in practice means my day is a mix of figuring out why a pipeline broke, building something that hopefully does not break, and translating what the data is actually saying to people who need to make decisions with it.</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">I chose NUS Singapore for my MSBA partly because Singapore made more sense to me than the US or Germany — closer in culture, closer in distance, and NUS is genuinely a great school. Also shifting from pure CS to business analytics felt like the right move. I want to understand the business side of data, not just the technical side.</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">9.58 CGPA from SRM Chennai. McKinsey Forward alumni. Amazon ML Summer School 2023. And yes I know that sounds very CV-ish — click the star below for the human version.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {label:"current role",value:"Associate @ PwC",icon:"💼"},
                {label:"location",value:"Bangalore, India",icon:"📍"},
                {label:"next chapter",value:"NUS Singapore",icon:"🎓"},
                {label:"cgpa",value:"9.58 / 10",icon:"⭐",secret:true},
              ].map((item)=>(
                <motion.div key={item.label} whileHover={{scale:1.04}} onClick={()=>item.secret&&setShowEaster2(true)} className={"p-4 "+card+" hover:border-violet-300 dark:hover:border-violet-500/30 transition-all "+(item.secret?"cursor-pointer":"")}>
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="experience" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />02 experience</p>
          <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">where I have been</h2>
          <div className="space-y-6">
            {[
              {role:"Associate - Data and Analytics",company:"PwC AC India",period:"Aug 2024 - Present",location:"Bangalore",icon:"🏢",points:["Partner with global clients to translate messy business problems into actual analytics solutions","Build data models in DBT and Snowflake for enterprise reporting","Design and maintain ETL pipelines using Informatica IICS for cloud data integration","Contributed to a Teradata to Snowflake migration with zero downtime","Build automated Power BI dashboards with SQL so teams stop waiting on manual reports","Supporting move to Databricks as part of a broader cloud shift","Present findings and recommendations to senior stakeholders — learning to make data land in a room"]},
              {role:"Intern - Data and Analytics",company:"PwC AC India",period:"Apr 2024 - Aug 2024",location:"Bangalore",icon:"🚀",points:["Built sales forecasting models using ARIMA, Holt-Winters, Random Forest and XGBoost","Spent more time validating and comparing models than building them — which is how it should be","Delivered business recommendations based on the forecasting outputs, not just the numbers"]},
            ].map((job,i)=>(
              <motion.div key={i} whileHover={{x:6}} className={"p-6 "+card+" hover:border-violet-300 dark:hover:border-violet-500/30 transition-all"}>
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{job.icon}</span>
                    <div><h3 className="font-semibold text-gray-900 dark:text-white">{job.role}</h3><p className="text-violet-500 text-sm">{job.company} · {job.location}</p></div>
                  </div>
                  <span className="text-xs text-gray-400 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full">{job.period}</span>
                </div>
                <ul className="space-y-2 ml-11">{job.points.map((p,j)=>(<li key={j} className="text-gray-600 dark:text-gray-400 flex gap-2 text-sm leading-relaxed"><span className="text-violet-500 mt-0.5 flex-shrink-0">›</span>{p}</li>))}</ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="projects" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />03 projects</p>
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">things I have built</h2>
          <p className="text-gray-400 mb-10 text-sm">click a card to flip it — the back is the part they do not put in the abstract</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project,i)=>(
              <div key={i} className="h-56 cursor-pointer" style={{perspective:'1000px'}} onClick={()=>toggleFlip(i)}>
                <motion.div animate={{rotateY:flipped[i]?180:0}} transition={{duration:0.5,type:"spring"}} style={{transformStyle:'preserve-3d',position:'relative',width:'100%',height:'100%'}}>
                  <div style={{backfaceVisibility:'hidden',position:'absolute',inset:0}} className={"p-6 "+card+" hover:border-violet-300 dark:hover:border-violet-500/30 transition-all flex flex-col justify-between"}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2"><span className="text-xl">{project.icon}</span><h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">built</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">{project.tags.map((tag)=>(<span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">{tag}</span>))}</div>
                  </div>
                  <div style={{backfaceVisibility:'hidden',transform:'rotateY(180deg)',position:'absolute',inset:0}} className="p-6 rounded-2xl border border-violet-500/30 bg-violet-50 dark:bg-violet-950/40 flex flex-col justify-center">
                    <div className="text-3xl mb-3">{project.icon}</div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{project.back}</p>
                    <p className="text-xs text-violet-500 mt-4">click to flip back</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="skills" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />04 skills</p>
          <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">what I work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {category:"Languages",items:["Python","SQL","R","Bash"],color:"from-blue-500/10 to-violet-500/10"},
              {category:"Data and Cloud",items:["Snowflake","AWS","Azure","Databricks","DBT","Informatica IICS","Teradata","BigQuery","Redshift"],color:"from-violet-500/10 to-pink-500/10"},
              {category:"ML and AI",items:["Scikit-learn","XGBoost","ARIMA","TensorFlow","NLTK","Pandas","NumPy","Matplotlib","Seaborn","Jupyter"],color:"from-pink-500/10 to-orange-500/10"},
              {category:"Tools and Viz",items:["Power BI","Tableau","Excel","Git","VS Code","Streamlit","FastAPI"],color:"from-cyan-500/10 to-violet-500/10"},
            ].map((group)=>(
              <motion.div key={group.category} whileHover={{scale:1.01}} className={"p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-violet-300 dark:hover:border-violet-500/20 transition-all bg-gradient-to-br "+group.color}>
                <p className="text-xs tracking-widest uppercase mb-4 font-medium" style={HOLO_ANIM}>{group.category}</p>
                <div className="flex flex-wrap gap-2">{group.items.map((item)=>(<motion.span key={item} whileHover={{scale:1.1}} className="text-sm px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-violet-700 dark:hover:text-violet-300 transition-all cursor-default border border-gray-200/50 dark:border-white/5">{item}</motion.span>))}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="certifications" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />05 certifications and awards</p>
          <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {name:"Microsoft Azure AZ-900",issuer:"Microsoft",type:"cert",icon:"☁️"},
              {name:"Microsoft Azure AI-900",issuer:"Microsoft",type:"cert",icon:"🤖"},
              {name:"Microsoft Azure DP-900",issuer:"Microsoft",type:"cert",icon:"📊"},
              {name:"AWS Machine Learning",issuer:"Amazon Web Services",type:"cert",icon:"🧠"},
              {name:"McKinsey Forward Program",issuer:"McKinsey and Company",type:"award",icon:"🏆"},
              {name:"Amazon ML Summer School 2023",issuer:"Amazon",type:"award",icon:"🌟"},
              {name:"Academic Scholarship 2020-21",issuer:"SRM Institute",type:"award",icon:"🎓"},
            ].map((cert,i)=>(
              <motion.div key={i} whileHover={{x:6}} className={"p-4 flex items-center gap-4 "+card+" hover:border-violet-300 dark:hover:border-violet-500/20 transition-all"}>
                <span className="text-2xl">{cert.icon}</span>
                <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 dark:text-white">{cert.name}</p><p className="text-sm text-gray-400">{cert.issuer}</p></div>
                <span className={cert.type==="cert"?"text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex-shrink-0":"text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex-shrink-0"}>{cert.type==="cert"?"certified":"award"}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="beyond" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-32">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />06 beyond data</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">not just a data person</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">I claim to be a very boring person. my friends disagree. here is the evidence either way.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.a href="https://pinterest.com/neopearlpins" target="_blank" rel="noreferrer" whileHover={{y:-4}} className={"p-6 "+card+" hover:border-pink-300 dark:hover:border-pink-500/30 transition-all group block"}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-xl">📌</div>
                <div><p className="font-semibold text-gray-900 dark:text-white">Neo Pearl Pins</p><p className="text-xs text-pink-400">@neopearlpins</p></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Digital lifestyle and aesthetic content. Started it because I spend too much time on Pinterest anyway.</p>
              <p className="text-xs text-pink-400 mt-4 group-hover:text-pink-300 transition-colors">visit</p>
            </motion.a>
            <motion.div whileHover={{y:-4}} className={"p-6 "+card+" hover:border-violet-300 dark:hover:border-violet-500/20 transition-all"}>
              <div className="text-2xl mb-3">🎬</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">movies and shows</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">I watch a lot. I have opinions. Do not ask me to pick a favourite because I will genuinely overthink it.</p>
            </motion.div>
            <motion.div whileHover={{y:-4}} className={"p-6 "+card+" hover:border-orange-300 dark:hover:border-orange-500/20 transition-all"}>
              <div className="text-2xl mb-3">🍳</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">cooking and food</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">I cook when I need to think. Also very excited about Singapore hawker food — that is honestly a big part of the appeal.</p>
            </motion.div>
            <motion.div whileHover={{y:-4}} className={"p-6 "+card+" hover:border-green-300 dark:hover:border-green-500/20 transition-all"}>
              <div className="text-2xl mb-3">✈️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">travel</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Love it, do not do it enough. Singapore is already making this easier — central location, good flights everywhere.</p>
            </motion.div>
            <motion.div whileHover={{y:-4}} className={"p-6 "+card+" hover:border-blue-300 dark:hover:border-blue-500/20 transition-all"}>
              <div className="text-2xl mb-3">🏀</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">basketball</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">I play when I can. Good at passing, working on everything else. Team sport energy is different from solo debugging energy.</p>
            </motion.div>
            <motion.div whileHover={{y:-4}} className={"p-6 "+card+" hover:border-purple-300 dark:hover:border-purple-500/20 transition-all"}>
              <div className="text-2xl mb-3">💃</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">dance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">I dance. This one surprises people who have only seen me in work mode. There are two versions of me.</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="contact" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}} className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-6 flex items-center gap-2" style={HOLO_ANIM}><span className="w-8 h-px" style={{background:HOLO}} />07 contact</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">lets talk</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md leading-relaxed">a role, a collab, a recommendation for what to watch, or just talking data — reach out.</p>
          <div className="flex flex-wrap gap-4">
            {[
              {label:"email",href:"mailto:sharmishthabhar@gmail.com",value:"sharmishthabhar@gmail.com"},
              {label:"linkedin",href:"https://linkedin.com/in/sharmishtha-bharti-8ab54b209",value:"sharmishtha-bharti"},
              {label:"github",href:"https://github.com/Sharmishtha-b",value:"Sharmishtha-b"},
            ].map((link)=>(
              <motion.a key={link.label} href={link.href} target="_blank" rel="noreferrer" whileHover={{scale:1.04}} className={"p-4 flex items-center gap-3 px-5 py-4 "+card+" hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group"}>
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
        <p className="text-xs text-gray-300 dark:text-gray-700 mt-2">⌘K for commands · double click for confetti · type "data" · click sb. five times · idle for 30s</p>
      </footer>

    </div>
  );
}
