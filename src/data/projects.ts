export type Project = {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  github: string;
  demo?: string;
  image?: { src: string; alt: string };
  /** Optional second capture for the homepage showcase's crossfade (e.g. an
   *  empty state -> completed result). Purely additive — a project with no
   *  image2 just renders its single image normally, no other code changes
   *  needed to add one later. */
  image2?: { src: string; alt: string };
  /** Homepage-showcase-only background, naming a --color-panel-<n> token in globals.css. */
  panelColor?: string;
  /** Homepage-showcase-only one-liner — short enough to fit one line without
   *  clipping, unlike `description` which is written for the /work list and
   *  detail page where there's room to wrap. */
  tagline?: string;
};

export const projects: Project[] = [
  {
    slug: "plant-disease-detector",
    title: "Plant Disease Detector",
    tags: ["Computer Vision", "Agriculture"],
    description:
      "Leaf diagnosis across 38 disease classes that refuses to guess — a two-gate pipeline rejects non-plant images and low-confidence predictions instead of bluffing.",
    metrics: [
      { label: "Classes", value: "38" },
      { label: "Confidence gates", value: "2" },
      { label: "Inference", value: "ONNX" },
    ],
    stack: ["PyTorch", "EfficientNet-B0", "FastAPI", "React", "Docker"],
    github: "https://github.com/lowie03/plant-disease-detector",
    demo: "https://plant-disease-detector-q4nnvoiyk-praises-projects-e37ae29d.vercel.app/",
    image: { src: "/projects/plant-disease.png", alt: "Plant Disease Detector" },
    panelColor: "sage",
    tagline: "Leaf diagnosis that refuses to guess when it isn't sure.",
  },
  {
    slug: "pneumonia-detection",
    title: "Pneumonia Detection",
    tags: ["Medical Imaging", "Clinical ML"],
    description:
      "Chest X-ray screening tuned for clinical safety — a class-weighted EfficientNet-B0 runs at a calibrated threshold that pushes sensitivity to 99%, and the API discloses its own validation-to-test specificity gap instead of hiding it.",
    metrics: [
      { label: "AUC", value: "0.95" },
      { label: "Sensitivity", value: "99%" },
      { label: "Specificity", value: "70%" },
    ],
    stack: ["PyTorch", "EfficientNet-B0", "FastAPI"],
    github: "https://github.com/lowie03/Chest-xray",
    demo: "https://frontend-bay-phi-56.vercel.app/",
    image: { src: "/projects/chest-xray.png", alt: "Chest-Xray — empty state" },
    image2: { src: "/projects/chest-xray2.png", alt: "Chest-Xray — completed result" },
    panelColor: "navy",
    tagline: "Chest X-ray screening tuned for clinical safety.",
  },
  {
    slug: "academic-outcome-predictor",
    title: "Academic Outcome Predictor",
    tags: ["Explainable AI", "Education"],
    description:
      "Glass-box student risk prediction — an Explainable Boosting Machine sorts students into three risk tiers and explains every prediction in plain English, not feature weights.",
    metrics: [
      { label: "Model", value: "EBM" },
      { label: "Risk tiers", value: "3" },
      { label: "Deployed", value: "Render" },
    ],
    stack: ["InterpretML", "Flask", "scikit-learn", "React"],
    github: "https://github.com/lowie03/Academic_predictor_backend",
    demo: "https://academic-predictor-frontend.vercel.app/",
    image: { src: "/projects/academic-predictor.png", alt: "Academic Outcome Predictor" },
    panelColor: "slate",
    tagline: "Risk predictions explained in plain English, not scores.",
  },
  {
    slug: "corper-desk",
    title: "Corper Desk",
    tags: ["Semantic Search", "Civic Tech"],
    description:
      "Question-answering for NYSC corps members that retrieves straight from official documentation — every response is tiered ANSWER, PARTIAL, or REFUSE, and no LLM ever touches the output.",
    metrics: [
      { label: "Confidence tiers", value: "3" },
      { label: "Facilities indexed", value: "34,139" },
      { label: "LLM calls", value: "0" },
    ],
    stack: ["FastAPI", "sentence-transformers", "pandas", "React", "Docker"],
    github: "https://github.com/lowie03/nysc-chatbot",
    demo: "https://nysc-chatbot-delta.vercel.app",
    image: { src: "/projects/corper-desk-1.png", alt: "Corper Desk" },
    panelColor: "cream",
    tagline: "Answers sourced from official NYSC docs, honestly.",
  },
    {
    slug: "marketsabi",
    title: "MarketSabi",
    tags: ["AI Automation", "Financial Inclusion"],
    description:
      "A Telegram bot that turns photos of handwritten sales ledgers into structured financial records — AI vision extraction plus business coaching in Nigerian Pidgin, built for market traders.",
    metrics: [
      { label: "Interface", value: "Telegram" },
      { label: "Vision", value: "Gemini" },
      { label: "Users", value: "Live" },
    ],
    stack: ["n8n", "Gemini Vision", "Telegram API", "Google Sheets"],
    github: "https://github.com/lowie03/MarketSabi",
    demo: "https://t.me/Yamskibot",
  },
];