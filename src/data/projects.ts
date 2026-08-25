export type Project = {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  github: string;
  demo?: string;
  images?: { src: string; alt: string }[];
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
    images: [
      { src: "/projects/plant-disease-1.png", alt: "Plant Disease Detector" },
    ]
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
  },
  {
    slug: "cervical-cancer-triage",
    title: "Cervical Cancer Risk Triage",
    tags: ["Clinical ML", "Tabular"],
    description:
      "Screening API that sorts patients into three referral tiers — a sensitivity-first decision threshold catches high-risk cases a default 0.5 cutoff would miss.",
    metrics: [
      { label: "Risk tiers", value: "3" },
      { label: "Threshold", value: "0.03" },
      { label: "Model", value: "Random Forest" },
    ],
    stack: ["scikit-learn", "FastAPI", "Pydantic", "pandas"],
    github: "https://github.com/lowie03/Cervical-cancer",
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
  {
    slug: "sentiment-analysis",
    title: "Sentiment Analysis",
    tags: ["NLP"],
    description:
      "Three-class sentiment classifier over 113k reviews using TF-IDF and classical ML — full preprocessing pipeline from raw text to evaluation.",
    metrics: [
      { label: "Accuracy", value: "87%" },
      { label: "Samples", value: "113k" },
    ],
    stack: ["scikit-learn", "TF-IDF", "NLTK"],
    github: "https://github.com/lowie03/Sentiment-Analysis",
  },
];