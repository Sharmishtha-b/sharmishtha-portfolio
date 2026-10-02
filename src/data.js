// ─────────────────────────────────────────────────────────────
// All the words on the site live here. Edit this file to update
// projects, side quests, experience, links etc. — no need to
// touch App.jsx for content changes.
// ─────────────────────────────────────────────────────────────

export const links = {
  email: "sharmishthabhar@gmail.com",
  linkedin: "https://linkedin.com/in/sharmishtha-bharti-8ab54b209",
  github: "https://github.com/Sharmishtha-b",
  resume: "/resume.pdf",
};

export const tools = [
  "Python", "SQL", "Snowflake", "Databricks", "dbt", "Informatica IICS",
  "AWS", "Azure", "Power BI", "Tableau",
];

// 01 — PROJECTS (the big builds)
// - tag:    small label on the cover
// - image:  optional. Drop a screenshot in /public/projects/ and write
//           e.g. "/projects/pipeline.png". Empty = gradient cover + drawing.
// - art:    drawing used when there's no image: "curve" | "spiral" | "words" | "scatter"
// - colors: [blob 1, blob 2, background] for the gradient cover
// - href:   where the card links to (GitHub, demo, write-up). "" = not clickable.
export const projects = [
  {
    name: "Customer churn prediction",
    blurb: "More time on features and business meaning than the model. That’s where the work is.",
    tag: "classification · python",
    href: "https://github.com/Sharmishtha-b/Customer-Churn-Prediction---Project",
    image: "",
    art: "curve",
    colors: ["#7B61FF", "#F3A6D8", "#1A1430"],
  },
  {
    name: "Parkinson’s detection",
    blurb: "Two very different data types, one model. Not a standard setup.",
    tag: "cnn-dnn · health",
    href: "",
    image: "",
    art: "spiral",
    colors: ["#8FD3F4", "#7B61FF", "#0F1C28"],
  },
  {
    name: "Drug review analysis",
    blurb: "Messy real-world text. Cleaning it was the actual challenge.",
    tag: "nlp · nltk",
    href: "https://github.com/Sharmishtha-b/Drug-Prescription-based-on-Consumer-Reviews",
    image: "",
    art: "words",
    colors: ["#F3A6D8", "#FFB89E", "#2A1424"],
  },
  {
    name: "Diabetes prediction",
    blurb: "Six classifiers side by side. The point was understanding why one won.",
    tag: "ml · feature eng.",
    href: "https://github.com/Sharmishtha-b/Diabetes-Prediction",
    image: "",
    art: "scatter",
    colors: ["#9FE3C1", "#7B61FF", "#0F2420"],
  },
];

// 02 — SIDE QUESTS (small weekend builds). Each line in the terminal.
// muted: true greys it out (handy for a "coming soon" line)
export const sideQuests = [
  { name: "n8n-automation/", status: "▸ in progress", href: "#", muted: false },
  { name: "[next-weekend-build]/", status: "▸ soon", href: "#", muted: true },
];

// 03 — EXPERIENCE
export const experience = [
  { role: "MSBA candidate", org: "National University of Singapore", dates: "2026 — 2027", current: true },
  {
    role: "Associate, Data & Analytics",
    org: "PwC AC India · Bangalore",
    dates: "2024 — 2026",
    text: "Migrated a 30-year-old platform onto Snowflake with DBT and AWS Glue, moved Teradata jobs to Databricks, and replaced manual reporting with Power BI.",
  },
  {
    role: "Intern, Data & Analytics",
    org: "PwC AC India · Bangalore",
    dates: "2024",
    text: "Benchmarked ARIMA and Holt-Winters against Random Forest and XGBoost for SKU-level demand. The statistical models won.",
  },
];

export const credentials = [
  "Azure AZ-900", "Azure AI-900", "Azure DP-900", "AWS Machine Learning",
  "McKinsey Forward", "Amazon ML Summer School ’23",
];

// 04 — BEYOND DATA. icon: "film" | "pan" | "music"
export const hobbies = [
  { icon: "film", color: "#C4B5FD", title: "movies and shows", text: "I watch a lot. I have opinions. don’t ask me to pick a favourite, I will overthink it." },
  { icon: "pan", color: "#F3A6D8", title: "cooking and food", text: "I cook when I need to think. hawker food is genuinely part of the appeal of Singapore." },
  { icon: "music", color: "#9FE3C1", title: "dance", text: "surprises people who’ve only seen me in work mode. there are two versions of me." },
];
export const hobbiesAlso = "also: basketball whenever I can find a game, and travel (love it, don’t do it enough).";
