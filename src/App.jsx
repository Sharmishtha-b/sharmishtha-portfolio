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
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1200);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex));
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? spd / 2 : spd);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, spd]);
  return text;
}

function Particles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-400/20"
          style={{ left: p.x + "%", top: p.y + "%", width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CursorTrail({ mousePos }) {
  const [trail, setTrail] = useState([]);
  useEffect(() => {
    setTrail((t) => [...t.slice(-12), { x: mousePos.x, y: mousePos.y, id: Date.now() }]);
  }, [mousePos]);
  return (
    <div className="fixed inset-0 pointer-events-none z-[990]">
      {trail.map((point, i) => (
        <div
          key={point.id}
          className="absolute rounded-full bg-violet-500"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6,
            height: 6,
            opacity: (i / trail.length) * 0.4,
            transform: "scale(" + (i / trail.length) + ")",
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState("about");
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [flipped, setFlipped] = useState({});
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const typedText = useTypewriter(ROLES);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const sections = ["about", "experience", "projects", "skills", "certifications", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) { setEasterEgg(true); setLogoClicks(0); }
  };

  const toggleFlip = (i) => setFlipped((f) => ({ ...f, [i]: !f[i] }));

  const navLinks = ["about", "experience", "projects", "skills", "certifications", "contact"];

  const glowStyle = {
    background: "radial-gradient(800px at " + mousePos.x + "px " + mousePos.y + "px, rgba(120,119,198,0.12), transparent 70%)",
  };

  const projects = [
    { name: "Parkinsons Detection", desc: "Hybrid CNN-DNN model integrating image and tabular data to improve diagnostic performance.", back: "Achieved improved diagnostic accuracy by combining visual and clinical data streams using deep learning.", tags: ["Python", "CNN", "DNN", "ML"], status: "built", icon: "🧠" },
    { name: "Customer Churn Prediction", desc: "Classification models to identify high-risk customers and support retention strategies.", back: "Used ensemble methods to flag at-risk customers, enabling proactive retention with measurable business impact.", tags: ["Python", "XGBoost", "Sklearn"], status: "built", icon: "📉" },
    { name: "Drug Prescription Analysis", desc: "NLP pipeline extracting insights from consumer reviews using NLTK for decision support.", back: "Processed thousands of reviews to surface prescribing patterns and patient sentiment at scale.", tags: ["Python", "NLP", "NLTK"], status: "built", icon: "💊" },
    { name: "Diabetes Prediction", desc: "Comparative analysis of ML models with feature engineering and optimization.", back: "Benchmarked 6 classifiers with custom feature engineering, improving baseline accuracy significantly.", tags: ["Python", "ML", "Feature Engineering"], status: "built", icon: "🔬" },
    { name: "AI Data Profiler", desc: "LLM-powered tool to auto-profile datasets, detect anomalies and suggest transformations.", back: "Planning: Connect any dataset, ask questions in plain English, get instant quality insights and fix suggestions.", tags: ["LangChain", "Python", "LLMs"], status: "soon", icon: "🤖" },
    { name: "Conversational SQL Agent", desc: "Ask questions in plain English, get SQL back. Schema-aware context injection.", back: "Planning: Business users ask data questions naturally. The agent understands schema context and writes clean SQL.", tags: ["Claude API", "FastAPI", "SQL"], status: "soon", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-gray-100 font-sans transition-colors duration-500 overflow-x-hidden">

      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500 origin-left z-[200]" style={{ scaleX }} />

      <Particles />
      <CursorTrail mousePos={mousePos} />

      <div className="fixed w-5 h-5 rounded-full bg-violet-400 pointer-events-none z-[999] mix-blend-screen transition-all duration-75" style={{ left: mousePos.x - 10, top: mousePos.y - 10 }} />
      <div className="fixed w-10 h-10 rounded-full border border-violet-400/50 pointer-events-none z-[998] transition-all duration-200" style={{ left: mousePos.x - 20, top: mousePos.y - 20 }} />

      <div className="pointer-events-none fixed inset-0 z-0" style={glowStyle} />

      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,119,198,0.15), transparent)" }} />

      <AnimatePresence>
        {easterEgg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setEasterEgg(false)}>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }} className="bg-[#0e0e1a] border border-violet-500/40 rounded-3xl p-10 max-w-sm text-center shadow-2xl shadow-violet-500/20">
              <div className="text-6xl mb-4">👾</div>
              <h3 className="text-2xl font-bold mb-2">you found me!</h3>
              <p className="text-gray-400 text-sm leading-relaxed">okay you are clearly curious and detail-oriented.<br />hire me immediately.</p>
              <button onClick={() => setEasterEgg(false)} className="mt-6 px-6 py-2 bg-violet-600 rounded-full text-sm text-white hover:bg-violet-700 transition-all hover:scale-105">hehe okay 😄</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-[2px] left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-[#080810]/80 border-b border-white/5">
        <span onClick={handleLogoClick} className="font-bold text-lg tracking-tight cursor-pointer select-none">
          sb<span className="text-violet-400">.</span>
        </span>
        <div className="flex items-center gap-5 text-sm">
          {navLinks.map((link) => (
            <a key={link} href={"#" + link} className={activeSection === link ? "text-violet-400 font-medium" : "text-gray-500 hover:text-violet-400 transition-colors"}>
              {link}
            </a>
          ))}
          <button onClick={() => setDark(!dark)} className="ml-2 px-3 py-1 rounded-full border border-white/10 text-xs hover:bg-white/10 transition-all">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">

        <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="mb-32 min-h-[90vh] flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            open to opportunities
          </motion.div>
          <h1 className="text-7xl font-bold tracking-tight mb-2 leading-none">
            <span className="block">Sharmishtha</span>
            <span className="block bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">Bharti.</span>
          </h1>
          <div className="flex items-center gap-2 mt-6 mb-6 h-10">
            <span className="text-xl text-gray-400 font-medium">{typedText}</span>
            <span className="w-0.5 h-7 bg-violet-400 animate-pulse" />
          </div>
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            Data and Analytics Engineer at{" "}
            <span className="text-white font-semibold">PwC</span>.
            {" "}Incoming MSBA at{" "}
            <span className="text-white font-semibold">NUS Singapore</span>.
            {" "}I turn messy data into things that actually matter.
          </p>
          <div className="flex gap-4 mt-10 flex-wrap">
            <a href="#projects" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30">
              see my work ✦
            </a>
            <a href="#contact" className="px-6 py-3 border border-white/10 rounded-full text-sm hover:bg-white/5 hover:border-white/20 transition-all">
              get in touch
            </a>
            <a href="/resume.pdf" download className="px-6 py-3 border border-violet-500/30 text-violet-400 rounded-full text-sm hover:bg-violet-500/10 transition-all">
              ↓ resume
            </a>
          </div>
          <div className="flex gap-8 mt-16 pt-10 border-t border-white/5">
            {[{ num: "1+", label: "years at PwC" }, { num: "9.58", label: "CGPA" }, { num: "3", label: "Azure certs" }, { num: "∞", label: "curiosity" }].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.num}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="about" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />01 about</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">a little about me</h2>
              <p className="text-gray-400 leading-relaxed text-sm">I am a data engineer who loves building systems that actually work - pipelines, models, dashboards, the whole thing. Currently at PwC AC India in Bangalore, working with global clients on analytics solutions.</p>
              <p className="text-gray-400 leading-relaxed text-sm mt-4">This fall I am heading to NUS Singapore for my MSBA, and I am using this time to get back into building things from scratch - projects, tools, ideas that excite me.</p>
              <p className="text-gray-400 leading-relaxed text-sm mt-4">9.58 CGPA from SRM Chennai. McKinsey Forward alumni. Won a pitch competition for a mental health app. Amazon ML Summer School 2023.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "current role", value: "Associate @ PwC", icon: "💼" },
                { label: "location", value: "Bangalore, India", icon: "📍" },
                { label: "next chapter", value: "NUS Singapore", icon: "🎓" },
                { label: "cgpa", value: "9.58 / 10", icon: "⭐" },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ scale: 1.04, borderColor: "rgba(139,92,246,0.4)" }} className="p-4 rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm group cursor-default" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="experience" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />02 experience</p>
          <h2 className="text-3xl font-bold mb-10">where I have been</h2>
          <div className="space-y-6">
            {[
              {
                role: "Associate - Data and Analytics",
                company: "PwC AC India",
                period: "Aug 2024 - Present",
                location: "Bangalore",
                icon: "🏢",
                points: [
                  "Built scalable data models using DBT, Snowflake, AWS Glue for enterprise reporting",
                  "Designed ETL pipelines using Informatica IICS for cloud data integration",
                  "Led Teradata to Snowflake migration with zero downtime",
                  "Automated Power BI dashboards enabling faster data-driven decisions",
                  "Presented analytical insights to senior stakeholders globally",
                ],
              },
              {
                role: "Intern - Data and Analytics",
                company: "PwC AC India",
                period: "Apr 2024 - Aug 2024",
                location: "Bangalore",
                icon: "🚀",
                points: [
                  "Built sales forecasting models using ARIMA, Holt-Winters, Random Forest, XGBoost",
                  "Evaluated model performance and delivered actionable business recommendations",
                ],
              },
            ].map((job, i) => (
              <motion.div key={i} whileHover={{ x: 6 }} className="p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{job.icon}</span>
                    <div>
                      <h3 className="font-semibold text-base text-white">{job.role}</h3>
                      <p className="text-violet-400 text-sm">{job.company} · {job.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full">{job.period}</span>
                </div>
                <ul className="space-y-2 ml-11">
                  {job.points.map((p, j) => (
                    <li key={j} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-violet-400 mt-0.5 flex-shrink-0">›</span>{p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="projects" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />03 projects</p>
          <h2 className="text-3xl font-bold mb-2">things I have built</h2>
          <p className="text-gray-500 text-sm mb-10">click a card to flip it ✦</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <div key={i} className="h-48 cursor-pointer" style={{ perspective: "1000px" }} onClick={() => toggleFlip(i)}>
                <motion.div
                  animate={{ rotateY: flipped[i] ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}
                >
                  <div style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }} className="p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between" style={{ background: "rgba(255,255,255,0.02)", backfaceVisibility: "hidden" }}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{project.icon}</span>
                          <h3 className="font-semibold text-sm text-white">{project.name}</h3>
                        </div>
                        <span className={project.status === "soon" ? "text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"}>
                          {project.status === "soon" ? "coming soon" : "built"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }} className="p-6 rounded-2xl border border-violet-500/30 bg-violet-950/40 flex flex-col justify-center">
                    <div className="text-3xl mb-3">{project.icon}</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{project.back}</p>
                    <p className="text-xs text-violet-400 mt-4">click to flip back</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="skills" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />04 skills</p>
          <h2 className="text-3xl font-bold mb-10">what I work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: "Languages", items: ["Python 🐍", "SQL 🗃️"], color: "from-blue-500/10 to-violet-500/10" },
              { category: "Data and Cloud", items: ["Snowflake ❄️", "AWS ☁️", "Azure 🔷", "Databricks ⚡", "DBT 🔧", "Informatica IICS", "Teradata"], color: "from-violet-500/10 to-pink-500/10" },
              { category: "ML and AI", items: ["Scikit-learn 🤖", "XGBoost", "ARIMA", "TensorFlow", "NLTK 📝"], color: "from-pink-500/10 to-orange-500/10" },
              { category: "Visualization", items: ["Power BI 📊", "Tableau 📈"], color: "from-orange-500/10 to-yellow-500/10" },
            ].map((group) => (
              <motion.div key={group.category} whileHover={{ scale: 1.01 }} className={"p-6 rounded-2xl border border-white/5 hover:border-violet-500/20 transition-all bg-gradient-to-br " + group.color}>
                <p className="text-xs text-violet-400 tracking-widest uppercase mb-4 font-medium">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <motion.span key={item} whileHover={{ scale: 1.1 }} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 hover:bg-violet-500/20 hover:text-violet-300 transition-all cursor-default border border-white/5">
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="certifications" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-32">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />05 certifications and awards</p>
          <h2 className="text-3xl font-bold mb-10">credentials</h2>
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
              <motion.div key={i} whileHover={{ x: 6, borderColor: "rgba(139,92,246,0.3)" }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 transition-all" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-2xl">{cert.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
                <span className={cert.type === "cert" ? "text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0" : "text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0"}>
                  {cert.type === "cert" ? "certified" : "award"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="contact" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <p className="text-xs text-violet-400 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-8 h-px bg-violet-400" />06 contact</p>
          <h2 className="text-3xl font-bold mb-4">lets talk 💬</h2>
          <p className="text-gray-400 text-sm mb-10 max-w-md leading-relaxed">
            always up for a good conversation - a role, a collab, or just talking data. reach out!
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "email ✉️", href: "mailto:sharmishthabhar@gmail.com", value: "sharmishthabhar@gmail.com" },
              { label: "linkedin 💼", href: "https://linkedin.com/in/sharmishtha-bharti-8ab54b209", value: "sharmishtha-bharti" },
              { label: "github 🐙", href: "https://github.com/Sharmishtha-b", value: "Sharmishtha-b" },
            ].map((link) => (
              <motion.a key={link.label} href={link.href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div>
                  <div className="text-xs text-gray-500 group-hover:text-violet-400 transition-colors mb-0.5">{link.label}</div>
                  <div className="text-sm font-medium text-white">{link.value}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-xs text-gray-600">designed and built by sharmishtha bharti <span className="text-violet-400">✦</span> {new Date().getFullYear()}</p>
        <p className="text-xs text-gray-700 mt-1">hint: click sb. five times 👀</p>
      </footer>
    </div>
  );
}
