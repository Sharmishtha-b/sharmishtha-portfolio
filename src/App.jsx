import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [dark, setDark] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e10] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
      
      {/* glow that follows cursor */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(120,119,198,0.08), transparent 80%)`,
        }}
      />

      {/* navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/70 dark:bg-[#0e0e10]/70 border-b border-gray-200 dark:border-white/10">
        <span className="font-bold text-lg tracking-tight">sb<span className="text-violet-500">.</span></span>
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <a href="#about" className="hover:text-violet-500 transition-colors">about</a>
          <a href="#experience" className="hover:text-violet-500 transition-colors">experience</a>
          <a href="#projects" className="hover:text-violet-500 transition-colors">projects</a>
          <a href="#skills" className="hover:text-violet-500 transition-colors">skills</a>
          <a href="#contact" className="hover:text-violet-500 transition-colors">contact</a>
          <button
            onClick={() => setDark(!dark)}
            className="ml-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">

        {/* intro */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-32"
        >
          <p className="text-violet-500 text-sm font-medium tracking-widest uppercase mb-4">hey, I'm</p>
          <h1 className="text-6xl font-bold tracking-tight mb-4 leading-none">
            Sharmishtha<br />
            <span className="text-gray-400 dark:text-gray-600">Bharti.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mt-6 leading-relaxed">
            Data & Analytics Engineer at <span className="text-gray-800 dark:text-gray-200 font-medium">PwC</span>. 
            Incoming MSBA @ <span className="text-gray-800 dark:text-gray-200 font-medium">NUS Singapore</span>. 
            I turn messy data into things that actually matter.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#projects" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-sm font-medium transition-all hover:scale-105">
              see my work
            </a>
            <a href="#contact" className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              get in touch
            </a>
          </div>
        </motion.section>

        {/* about */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <p className="text-xs text-violet-500 tracking-widest uppercase mb-6">01 — about</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">a little about me</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                I'm a data engineer who loves building systems that actually work — pipelines, models, dashboards, the whole thing. 
                Currently at PwC AC India in Bangalore, working with global clients on analytics solutions.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mt-4">
                This fall I'm heading to NUS Singapore for my MSBA, and I'm using this time to get back into building things from scratch — 
                projects, tools, ideas that excite me.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mt-4">
                9.58 CGPA from SRM Chennai. McKinsey Forward alumni. Won a pitch competition for a mental health app. 
                Amazon ML Summer School 2023. Basically can't sit still. 😄
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "current role", value: "Associate @ PwC" },
                { label: "location", value: "Bangalore, India" },
                { label: "next chapter", value: "NUS Singapore" },
                { label: "cgpa", value: "9.58 / 10" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group">
                  <p className="text-xs text-gray-400 mb-1 group-hover:text-violet-400 transition-colors">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* experience */}
        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <p className="text-xs text-violet-500 tracking-widest uppercase mb-6">02 — experience</p>
          <h2 className="text-3xl font-bold mb-10">where I've been</h2>
          <div className="space-y-8">
            {[
              {
                role: "Associate – Data & Analytics",
                company: "PwC AC India",
                period: "Aug 2024 – Present",
                location: "Bangalore",
                points: [
                  "Built scalable data models using DBT, Snowflake, AWS Glue for enterprise reporting",
                  "Designed ETL pipelines using Informatica IICS for cloud data integration",
                  "Led Teradata → Snowflake migration with zero downtime",
                  "Automated Power BI dashboards enabling faster data-driven decisions",
                ],
              },
              {
                role: "Intern – Data & Analytics",
                company: "PwC AC India",
                period: "Apr 2024 – Aug 2024",
                location: "Bangalore",
                points: [
                  "Built sales forecasting models using ARIMA, Holt-Winters, Random Forest, XGBoost",
                  "Evaluated model performance and delivered actionable business recommendations",
                ],
              },
            ].map((job, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                className="p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-base">{job.role}</h3>
                    <p className="text-violet-500 text-sm">{job.company} · {job.location}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full">{job.period}</span>
                </div>
                <ul className="space-y-1">
                  {job.points.map((p, j) => (
                    <li key={j} className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                      <span className="text-violet-400 mt-0.5">›</span>{p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* projects */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <p className="text-xs text-violet-500 tracking-widest uppercase mb-6">03 — projects</p>
          <h2 className="text-3xl font-bold mb-10">things I've built</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Parkinson's Detection",
                desc: "Hybrid CNN-DNN model integrating image and tabular data to improve diagnostic performance.",
                tags: ["Python", "CNN", "DNN", "ML"],
                status: "built",
              },
              {
                name: "Customer Churn Prediction",
                desc: "Classification models to identify high-risk customers and support retention strategies.",
                tags: ["Python", "XGBoost", "Sklearn"],
                status: "built",
              },
              {
                name: "Drug Prescription Analysis",
                desc: "NLP pipeline extracting insights from consumer reviews using NLTK for decision support.",
                tags: ["Python", "NLP", "NLTK"],
                status: "built",
              },
              {
                name: "Diabetes Prediction",
                desc: "Comparative analysis of ML models with feature engineering and optimization.",
                tags: ["Python", "ML", "Feature Engineering"],
                status: "built",
              },
              {
                name: "AI Data Profiler",
                desc: "LLM-powered tool to auto-profile datasets, detect anomalies and suggest transformations.",
                tags: ["LangChain", "Python", "LLMs"],
                status: "soon",
              },
              {
                name: "Conversational SQL Agent",
                desc: "Ask questions in plain English, get SQL back. Schema-aware context injection.",
                tags: ["Claude API", "FastAPI", "SQL"],
                status: "soon",
              },
            ].map((project, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === "soon" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" : "bg-green-50 dark:bg-green-500/10 text-green-500"}`}>
                    {project.status === "soon" ? "coming soon" : "built"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 group-hover:text-violet-500 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* skills */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <p className="text-xs text-violet-500 tracking-widest uppercase mb-6">04 — skills</p>
          <h2 className="text-3xl font-bold mb-10">what I work with</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: "Languages", items: ["Python", "SQL"] },
              { category: "Data & Cloud", items: ["Snowflake", "AWS", "Azure", "Databricks", "DBT", "Informatica IICS", "Teradata"] },
              { category: "ML & AI", items: ["Scikit-learn", "XGBoost", "ARIMA", "TensorFlow", "NLTK"] },
              { category: "Visualization", items: ["Power BI", "Tableau"] },
            ].map((group) => (
              <div key={group.category} className="p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all">
                <p className="text-xs text-violet-500 tracking-widest uppercase mb-4">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="text-xs px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-xs text-violet-500 tracking-widest uppercase mb-6">05 — contact</p>
          <h2 className="text-3xl font-bold mb-4">let's talk</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-md">
            always up for a good conversation — a role, a collab, or just talking data. reach out! 🙌
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "email", href: "mailto:sharmishthabhar@gmail.com", value: "sharmishthabhar@gmail.com" },
              { label: "linkedin", href: "https://linkedin.com/in/sharmishtha-bharti-8ab54b209", value: "sharmishtha-bharti" },
              { label: "github", href: "https://github.com/Sharmishtha-b", value: "Sharmishtha-b" },
            ].map((link) => (<a
              
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group hover:scale-105"
              >
                <span className="text-xs text-gray-400 group-hover:text-violet-400 transition-colors">{link.label}</span>
                <span className="text-sm font-medium">{link.value}</span>
              </a>
            ))}
          </div>
        </motion.section>

      </main>

      <footer className="relative z-10 border-t border-gray-100 dark:border-white/10 py-6 text-center text-xs text-gray-400">
        designed & built by sharmishtha bharti ✦ {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;