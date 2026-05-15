import { FormEvent, lazy, Suspense, useMemo, useState } from "react";

type Section = "discover" | "templates" | "studio" | "upload" | "earnings" | "settings";
type CreatorMode = "Human Creator" | "AI Digital Human" | "Brand Account";
type Tone = "Bold" | "Friendly" | "Funny" | "Expert" | "Luxury";

type Template = {
  id: string;
  title: string;
  category: string;
  creator: string;
  creatorRole: string;
  price: number;
  downloads: number;
  viralScore: number;
  difficulty: string;
  tags: string[];
  color: string;
  logic: {
    hook: string;
    setup: string;
    tension: string;
    payoff: string;
    cta: string;
  };
  inputs: string[];
  example: string;
};

type Draft = {
  title: string;
  hook: string[];
  script: string[];
  shotList: string[];
  caption: string;
  hashtags: string[];
  soundMood: string;
  cutRhythm: string;
  postingTips: string[];
};

const initialTemplates: Template[] = [
  {
    id: "tpl_story_001",
    title: "3-Second Curiosity Hook",
    category: "Storytime",
    creator: "Mia Chen",
    creatorRole: "2.4M lifestyle creator",
    price: 4.99,
    downloads: 12840,
    viralScore: 96,
    difficulty: "Beginner",
    tags: ["Hook", "Storytelling", "Retention"],
    color: "pink-purple",
    logic: {
      hook: "Open with an unfinished sentence or surprising contradiction.",
      setup: "Introduce the normal situation in one short line.",
      tension: "Reveal the hidden problem or unexpected twist.",
      payoff: "Give the lesson, result, or reveal.",
      cta: "Ask viewers to comment their guess or experience."
    },
    inputs: ["Topic", "Personal angle", "Audience pain point", "Final reveal"],
    example: "I thought this was killing my productivity, but it was actually saving my career..."
  },
  {
    id: "tpl_product_002",
    title: "UGC Product Review Loop",
    category: "Product Review",
    creator: "Alex Morgan",
    creatorRole: "DTC growth creator",
    price: 7.99,
    downloads: 9320,
    viralScore: 91,
    difficulty: "Intermediate",
    tags: ["UGC", "Conversion", "Product"],
    color: "cyan-blue",
    logic: {
      hook: "State the product result before naming the product.",
      setup: "Show the old frustrating behavior.",
      tension: "Demonstrate why common alternatives fail.",
      payoff: "Reveal the product and show proof.",
      cta: "Invite viewers to save or try the checklist."
    },
    inputs: ["Product name", "Main benefit", "Before state", "Proof point"],
    example: "I stopped wasting 20 minutes every morning because of this tiny desk setup change."
  },
  {
    id: "tpl_avatar_003",
    title: "AI Digital Human Explainer",
    category: "Education",
    creator: "Nova Lab",
    creatorRole: "AI avatar studio",
    price: 5.99,
    downloads: 15420,
    viralScore: 94,
    difficulty: "Beginner",
    tags: ["AI Avatar", "Explainer", "Authority"],
    color: "violet-fuchsia",
    logic: {
      hook: "Ask a direct question that the audience secretly has.",
      setup: "Define the concept in one simple sentence.",
      tension: "Explain the mistake most people make.",
      payoff: "Give a 3-step framework.",
      cta: "Ask viewers to follow for the next part."
    },
    inputs: ["Topic", "Audience level", "Common mistake", "3-step framework"],
    example: "Why do your AI videos feel fake? The problem is not the avatar - it is the script structure."
  },
  {
    id: "tpl_beauty_004",
    title: "Before-After Transformation",
    category: "Beauty",
    creator: "Lena Glow",
    creatorRole: "Beauty creator",
    price: 6.99,
    downloads: 7820,
    viralScore: 89,
    difficulty: "Beginner",
    tags: ["Transformation", "Beauty", "Visual Payoff"],
    color: "rose-orange",
    logic: {
      hook: "Show the final result for 0.5 seconds, then cut away.",
      setup: "State the original problem.",
      tension: "Show the process in fast cuts.",
      payoff: "Reveal before-after comparison.",
      cta: "Ask viewers which version they prefer."
    },
    inputs: ["Before state", "After state", "Product/process", "Time taken"],
    example: "This 5-minute routine made my skin look like I slept for 10 hours."
  },
  {
    id: "tpl_news_005",
    title: "Hot Take News Breakdown",
    category: "Commentary",
    creator: "Jay Talks",
    creatorRole: "1.1M commentary creator",
    price: 3.99,
    downloads: 11560,
    viralScore: 92,
    difficulty: "Advanced",
    tags: ["Opinion", "News", "Debate"],
    color: "amber-red",
    logic: {
      hook: "Start with a polarizing opinion, then promise nuance.",
      setup: "Explain what happened in one sentence.",
      tension: "Show why people disagree.",
      payoff: "Give your unique interpretation.",
      cta: "Ask viewers to pick a side."
    },
    inputs: ["News topic", "Contrarian angle", "Evidence", "Viewer question"],
    example: "Everyone is talking about this AI update, but they are missing the real business impact."
  },
  {
    id: "tpl_food_006",
    title: "Hidden Gem Local Food",
    category: "Food",
    creator: "Sam Eats",
    creatorRole: "Food discovery creator",
    price: 2.99,
    downloads: 6420,
    viralScore: 87,
    difficulty: "Beginner",
    tags: ["Local", "Food", "Discovery"],
    color: "green-emerald",
    logic: {
      hook: "Open with the most visually satisfying bite.",
      setup: "Introduce the location or dish.",
      tension: "Explain why it is underrated or hard to find.",
      payoff: "Show price, taste, and best order.",
      cta: "Ask viewers to tag someone to go with."
    },
    inputs: ["Restaurant/dish", "Location", "Price", "Best order"],
    example: "This tiny noodle shop has no sign, but the lunch queue starts before 11."
  }
];

const trendChips = ["AI Avatar", "Beauty", "Product Review", "Storytime", "Education", "UGC Ad"];
const tones: Tone[] = ["Bold", "Friendly", "Funny", "Expert", "Luxury"];
const creatorModes: CreatorMode[] = ["Human Creator", "AI Digital Human", "Brand Account"];

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "discover", label: "Discover", icon: "D" },
  { id: "templates", label: "Viral Templates", icon: "V" },
  { id: "studio", label: "AI Studio", icon: "A" },
  { id: "upload", label: "Upload Template", icon: "U" },
  { id: "earnings", label: "Earnings", icon: "$" },
  { id: "settings", label: "Settings", icon: "S" }
];

const CommerceOrbitDemo = lazy(() => import("./CommerceOrbitDemo"));

function generateDraft({
  template,
  topic,
  audience,
  tone,
  creatorMode,
  productName
}: {
  template: Template;
  topic: string;
  audience: string;
  tone: Tone;
  creatorMode: CreatorMode;
  productName: string;
}): Draft {
  const focus = topic || productName || "creator growth";
  const viewer = audience || "audience";
  return {
    title: `I tested this ${focus} framework so you don't have to`,
    hook: [
      `Most people get ${focus} wrong in the first 3 seconds.`,
      `Here is the simple structure that keeps ${viewer} watching.`
    ],
    script: [
      `Scene 1: Start with a ${tone.toLowerCase()} claim about ${focus}.`,
      `Scene 2: Show the common mistake your ${viewer} makes.`,
      `Scene 3: Apply the ${template.title} logic with a visible proof moment.`,
      `Scene 4: Reveal the result and end with a ${creatorMode === "AI Digital Human" ? "follow-for-part-two" : "comment-driven"} CTA.`
    ],
    shotList: [
      "0.0s close crop hook with caption punch-in",
      "1.2s quick proof visual or avatar expression shift",
      "3.4s split screen before/after logic beat",
      "6.8s payoff frame with save-worthy checklist"
    ],
    caption: `Steal this structure for your next ${focus} video.`,
    hashtags: ["#AICreator", "#ViralTemplate", "#ShortVideo", "#CreatorTools"],
    soundMood: tone === "Funny" ? "playful beat" : tone === "Luxury" ? "sleek editorial pulse" : "fast modern electronic",
    cutRhythm: template.difficulty === "Advanced" ? "fast cuts every 0.8s" : "clean cuts every 1.2s",
    postingTips: [
      "Pin the strongest viewer question in the first comment.",
      "Use one bold caption per scene, not a paragraph.",
      "Loop the final line back to the opening contradiction."
    ]
  };
}

export default function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const currentPath = window.location.pathname.replace(basePath, "") || "/";
  const isCommerceDemo = currentPath === "/commerce";
  if (isCommerceDemo) {
    return (
      <Suspense fallback={null}>
        <CommerceOrbitDemo />
      </Suspense>
    );
  }

  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplates[0]);
  const [activeSection, setActiveSection] = useState<Section>("discover");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [creatorMode, setCreatorMode] = useState<CreatorMode>("AI Digital Human");
  const [tone, setTone] = useState<Tone>("Bold");
  const [topic, setTopic] = useState("AI fitness coach");
  const [audience, setAudience] = useState("busy beginners");
  const [productName, setProductName] = useState("ViralCraft");
  const [avatar, setAvatar] = useState("confident virtual host");
  const [voice, setVoice] = useState("crisp, energetic");
  const [ctaGoal, setCtaGoal] = useState("save the checklist");
  const [draft, setDraft] = useState<Draft>(() =>
    generateDraft({
      template: initialTemplates[0],
      topic: "AI fitness coach",
      audience: "busy beginners",
      tone: "Bold",
      creatorMode: "AI Digital Human",
      productName: "ViralCraft"
    })
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("Founder Story Launch Loop");
  const [uploadCategory, setUploadCategory] = useState("UGC Ad");
  const [uploadPrice, setUploadPrice] = useState("8.99");
  const [uploadHandle, setUploadHandle] = useState("@growthstudio");

  const categories = useMemo(() => ["All", ...Array.from(new Set(templates.map((item) => item.category)))], [templates]);
  const filteredTemplates = useMemo(() => {
    const term = query.toLowerCase().trim();
    return templates.filter((template) => {
      const inCategory = category === "All" || template.category === category || template.tags.includes(category);
      const searchable = [template.title, template.category, template.creator, template.tags.join(" "), template.example]
        .join(" ")
        .toLowerCase();
      return inCategory && (!term || searchable.includes(term));
    });
  }, [templates, category, query]);

  function chooseTemplate(template: Template, section: Section = activeSection) {
    setSelectedTemplate(template);
    if (section === "studio") {
      setActiveSection("studio");
    }
  }

  function useTemplate(template: Template) {
    setSelectedTemplate(template);
    setActiveSection("studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function runGeneration() {
    setIsGenerating(true);
    setTimeout(() => {
      setDraft(generateDraft({ template: selectedTemplate, topic, audience, tone, creatorMode, productName }));
      setIsGenerating(false);
    }, 1300);
  }

  function uploadTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number.parseFloat(uploadPrice) || 0;
    const template: Template = {
      id: `tpl_upload_${Date.now()}`,
      title: uploadTitle || "Untitled Creator Logic",
      category: uploadCategory || "Creator Logic",
      creator: uploadHandle.replace("@", "") || "Creator Studio",
      creatorRole: "New marketplace seller",
      price,
      downloads: 0,
      viralScore: 82,
      difficulty: "Intermediate",
      tags: ["Creator", "Loop", "Monetization"],
      color: "cyan-blue",
      logic: {
        hook: "Lead with the most surprising outcome.",
        setup: "Name the audience and the moment they recognize.",
        tension: "Show the hidden mistake that blocks action.",
        payoff: "Reveal the repeatable framework.",
        cta: "Ask viewers to save the template for later."
      },
      inputs: ["Audience", "Outcome", "Proof", "CTA"],
      example: "I turned one messy founder story into a launch video people actually watched."
    };
    setTemplates((current) => [template, ...current]);
    setSelectedTemplate(template);
    setActiveSection("templates");
  }

  const totalEarnings = templates.reduce((sum, template) => sum + template.downloads * template.price * 0.18, 0);

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="app-main">
        <TopBar
          query={query}
          setQuery={setQuery}
          setActiveSection={setActiveSection}
          setCategory={setCategory}
        />
        <div className="content-grid">
          <section className="primary-column">
            {activeSection === "discover" && (
              <Discover
                templates={filteredTemplates}
                selectedTemplate={selectedTemplate}
                categories={categories}
                category={category}
                setCategory={setCategory}
                chooseTemplate={chooseTemplate}
                useTemplate={useTemplate}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === "templates" && (
              <TemplatesSection
                templates={filteredTemplates}
                selectedTemplate={selectedTemplate}
                categories={categories}
                category={category}
                setCategory={setCategory}
                chooseTemplate={chooseTemplate}
                useTemplate={useTemplate}
              />
            )}
            {activeSection === "studio" && (
              <AIStudio
                templates={templates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                creatorMode={creatorMode}
                setCreatorMode={setCreatorMode}
                tone={tone}
                setTone={setTone}
                topic={topic}
                setTopic={setTopic}
                audience={audience}
                setAudience={setAudience}
                productName={productName}
                setProductName={setProductName}
                avatar={avatar}
                setAvatar={setAvatar}
                voice={voice}
                setVoice={setVoice}
                ctaGoal={ctaGoal}
                setCtaGoal={setCtaGoal}
                runGeneration={runGeneration}
                isGenerating={isGenerating}
              />
            )}
            {activeSection === "upload" && (
              <UploadTemplateForm
                uploadTitle={uploadTitle}
                setUploadTitle={setUploadTitle}
                uploadCategory={uploadCategory}
                setUploadCategory={setUploadCategory}
                uploadPrice={uploadPrice}
                setUploadPrice={setUploadPrice}
                uploadHandle={uploadHandle}
                setUploadHandle={setUploadHandle}
                uploadTemplate={uploadTemplate}
              />
            )}
            {activeSection === "earnings" && <EarningsDashboard templates={templates} totalEarnings={totalEarnings} />}
            {activeSection === "settings" && <SettingsPanel />}
          </section>
          <aside className="right-rail">
            <PhonePreview template={selectedTemplate} draft={draft} isGenerating={isGenerating} topic={topic} creatorMode={creatorMode} />
            <GeneratedDraftPanel draft={draft} isGenerating={isGenerating} />
          </aside>
        </div>
      </main>
    </div>
  );
}

function Sidebar({
  activeSection,
  setActiveSection
}: {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setActiveSection("discover")}>
        <span className="brand-mark">VC</span>
        <span>
          <strong>ViralCraft</strong>
          <small>AI Studio</small>
        </span>
      </button>
      <nav>
        {navItems.map((item) => (
          <button
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => setActiveSection(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-card">
        <span className="eyebrow">Creator economy</span>
        <strong>18% seller share preview</strong>
        <p>Monetize repeatable viral structures without building a course.</p>
      </div>
    </aside>
  );
}

function TopBar({
  query,
  setQuery,
  setCategory,
  setActiveSection
}: {
  query: string;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  setActiveSection: (section: Section) => void;
}) {
  return (
    <header className="topbar">
      <div className="search-wrap">
        <span>⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search hooks, niches, creators"
        />
      </div>
      <div className="trend-row">
        {trendChips.map((chip) => (
          <button key={chip} onClick={() => setCategory(chip)}>
            {chip}
          </button>
        ))}
      </div>
      <button className="primary-button" onClick={() => setActiveSection("studio")}>
        Generate with AI
      </button>
      <a className="ghost-button topbar-link" href={`${import.meta.env.BASE_URL}commerce`}>
        Commerce Demo
      </a>
    </header>
  );
}

function Discover(props: {
  templates: Template[];
  selectedTemplate: Template;
  categories: string[];
  category: string;
  setCategory: (category: string) => void;
  chooseTemplate: (template: Template) => void;
  useTemplate: (template: Template) => void;
  setActiveSection: (section: Section) => void;
}) {
  return (
    <div className="section-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Viral logic marketplace</span>
          <h1>Turn proven creator logic into viral-ready videos.</h1>
          <p>
            Pick a viral framework from top creators, add your topic, and let AI generate the hook, script, shots,
            captions, and avatar-ready preview.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => props.setActiveSection("studio")}>
              Generate Viral Draft
            </button>
            <button className="ghost-button" onClick={() => props.setActiveSection("upload")}>
              Upload My Template
            </button>
          </div>
        </div>
        <div className="hero-proof">
          <MetricCard label="Viral score avg" value="93" detail="Top marketplace templates" />
          <MetricCard label="Drafts generated" value="48K" detail="Mock demo activity" />
        </div>
      </section>
      <CategoryFilter categories={props.categories} active={props.category} setCategory={props.setCategory} />
      <TemplateGrid {...props} />
      <section className="leaderboard panel">
        <div>
          <span className="eyebrow">Creator leaderboard</span>
          <h2>Top template sellers this week</h2>
        </div>
        {props.templates.slice(0, 4).map((template, index) => (
          <div className="leader-row" key={template.id}>
            <span>0{index + 1}</span>
            <strong>{template.creator}</strong>
            <small>{template.creatorRole}</small>
            <b>${Math.round(template.downloads * template.price * 0.18).toLocaleString()}</b>
          </div>
        ))}
      </section>
    </div>
  );
}

function TemplatesSection(props: {
  templates: Template[];
  selectedTemplate: Template;
  categories: string[];
  category: string;
  setCategory: (category: string) => void;
  chooseTemplate: (template: Template) => void;
  useTemplate: (template: Template) => void;
}) {
  return (
    <div className="section-stack">
      <div className="section-heading">
        <span className="eyebrow">Template library</span>
        <h1>Browse viral structures by niche, outcome, and creator proof.</h1>
      </div>
      <CategoryFilter categories={props.categories} active={props.category} setCategory={props.setCategory} />
      <TemplateGrid {...props} />
      <TemplateDetail template={props.selectedTemplate} useTemplate={props.useTemplate} />
    </div>
  );
}

function CategoryFilter({
  categories,
  active,
  setCategory
}: {
  categories: string[];
  active: string;
  setCategory: (category: string) => void;
}) {
  return (
    <div className="category-row">
      {categories.map((item) => (
        <button className={active === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function TemplateGrid({
  templates,
  selectedTemplate,
  chooseTemplate,
  useTemplate
}: {
  templates: Template[];
  selectedTemplate: Template;
  chooseTemplate: (template: Template) => void;
  useTemplate: (template: Template) => void;
}) {
  return (
    <div className="template-grid">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selectedTemplate.id === template.id}
          chooseTemplate={chooseTemplate}
          useTemplate={useTemplate}
        />
      ))}
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  chooseTemplate,
  useTemplate
}: {
  template: Template;
  selected: boolean;
  chooseTemplate: (template: Template) => void;
  useTemplate: (template: Template) => void;
}) {
  return (
    <article className={`template-card ${selected ? "selected" : ""}`} onClick={() => chooseTemplate(template)}>
      <div className={`template-cover ${template.color}`}>
        <span>{template.category}</span>
        <b>{template.viralScore}</b>
      </div>
      <div className="template-body">
        <div>
          <h3>{template.title}</h3>
          <p>{template.creator} · {template.creatorRole}</p>
        </div>
        <div className="template-meta">
          <span>{template.downloads.toLocaleString()} downloads</span>
          <span>${template.price.toFixed(2)}</span>
          <span>{template.difficulty}</span>
        </div>
        <div className="tag-row">
          {template.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="logic-peek">
          <b>Viral logic</b>
          <p>{template.logic.hook}</p>
        </div>
        <button
          className="card-button"
          onClick={(event) => {
            event.stopPropagation();
            useTemplate(template);
          }}
        >
          Use Template
        </button>
      </div>
    </article>
  );
}

function TemplateDetail({ template, useTemplate }: { template: Template; useTemplate: (template: Template) => void }) {
  const blocks = [
    ["Hook", template.logic.hook],
    ["Setup", template.logic.setup],
    ["Tension", template.logic.tension],
    ["Payoff", template.logic.payoff],
    ["CTA / Loop", template.logic.cta]
  ];
  return (
    <section className="panel template-detail">
      <div className="detail-header">
        <div>
          <span className="eyebrow">Selected template</span>
          <h2>{template.title}</h2>
          <p>{template.creator} · {template.creatorRole}</p>
        </div>
        <button className="primary-button" onClick={() => useTemplate(template)}>
          Open in AI Studio
        </button>
      </div>
      <div className="detail-metrics">
        <MetricCard label="Viral score" value={String(template.viralScore)} detail="Retention-weighted" />
        <MetricCard label="Usage" value={template.downloads.toLocaleString()} detail="Marketplace downloads" />
        <MetricCard label="Price" value={`$${template.price.toFixed(2)}`} detail={template.difficulty} />
      </div>
      <div className="logic-list">
        {blocks.map(([label, text], index) => (
          <div className="logic-block" key={label}>
            <span>{index + 1}</span>
            <div>
              <strong>{label}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="inputs-panel">
        <strong>Required inputs</strong>
        <div className="tag-row">
          {template.inputs.map((input) => (
            <span key={input}>{input}</span>
          ))}
        </div>
        <p>{template.example}</p>
      </div>
    </section>
  );
}

function AIStudio(props: {
  templates: Template[];
  selectedTemplate: Template;
  setSelectedTemplate: (template: Template) => void;
  creatorMode: CreatorMode;
  setCreatorMode: (mode: CreatorMode) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  topic: string;
  setTopic: (value: string) => void;
  audience: string;
  setAudience: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  avatar: string;
  setAvatar: (value: string) => void;
  voice: string;
  setVoice: (value: string) => void;
  ctaGoal: string;
  setCtaGoal: (value: string) => void;
  runGeneration: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="panel studio-panel">
      <div className="section-heading compact">
        <span className="eyebrow">AI creation studio</span>
        <h1>Convert a creator framework into a video-ready draft.</h1>
      </div>
      <label className="field wide">
        <span>Template</span>
        <select
          value={props.selectedTemplate.id}
          onChange={(event) => {
            const template = props.templates.find((item) => item.id === event.target.value);
            if (template) props.setSelectedTemplate(template);
          }}
        >
          {props.templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </label>
      <div className="segmented">
        {creatorModes.map((mode) => (
          <button className={props.creatorMode === mode ? "active" : ""} onClick={() => props.setCreatorMode(mode)} key={mode}>
            {mode}
          </button>
        ))}
      </div>
      <div className="form-grid">
        <Field label="Topic" value={props.topic} setValue={props.setTopic} />
        <Field label="Target audience" value={props.audience} setValue={props.setAudience} />
        <Field label="Product or service" value={props.productName} setValue={props.setProductName} />
        <Field label="Avatar persona" value={props.avatar} setValue={props.setAvatar} />
        <Field label="Voice style" value={props.voice} setValue={props.setVoice} />
        <Field label="CTA goal" value={props.ctaGoal} setValue={props.setCtaGoal} />
      </div>
      <div>
        <span className="field-label">Tone</span>
        <div className="tone-row">
          {tones.map((tone) => (
            <button className={props.tone === tone ? "active" : ""} onClick={() => props.setTone(tone)} key={tone}>
              {tone}
            </button>
          ))}
        </div>
      </div>
      <button className="primary-button studio-submit" onClick={props.runGeneration} disabled={props.isGenerating}>
        {props.isGenerating ? "Generating draft..." : "Generate Viral Draft"}
      </button>
    </section>
  );
}

function Field({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
    </label>
  );
}

function PhonePreview({
  template,
  draft,
  isGenerating,
  topic,
  creatorMode
}: {
  template: Template;
  draft: Draft;
  isGenerating: boolean;
  topic: string;
  creatorMode: CreatorMode;
}) {
  return (
    <section className="phone-wrap">
      <div className="phone">
        <div className={`phone-scene ${template.color}`}>
          <div className="phone-top">
            <span>Following</span>
            <b>For You</b>
            <span>Live</span>
          </div>
          <div className="avatar-bubble">{creatorMode === "AI Digital Human" ? "AI" : "VC"}</div>
          <div className="caption-stack">
            {(isGenerating ? ["Analyzing viral structure", "Writing hook variations", "Building avatar-ready shot list"] : draft.hook).map(
              (line, index) => (
                <div className="animated-caption" style={{ animationDelay: `${index * 0.22}s` }} key={line}>
                  {line}
                </div>
              )
            )}
          </div>
          <div className="phone-actions">
            <span>♥ 42K</span>
            <span>◌ 918</span>
            <span>↗ 7.2K</span>
          </div>
          <div className="phone-footer">
            <strong>@viralcraft</strong>
            <p>{draft.caption || `Steal this structure for ${topic || "your next video"}.`}</p>
            <div className="scene-timeline">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneratedDraftPanel({ draft, isGenerating }: { draft: Draft; isGenerating: boolean }) {
  return (
    <section className="panel output-panel">
      <span className="eyebrow">Generated output</span>
      {isGenerating ? (
        <div className="loading-list">
          <span>Analyzing viral structure</span>
          <span>Writing hook variations</span>
          <span>Optimizing retention moments</span>
        </div>
      ) : (
        <>
          <h2>{draft.title}</h2>
          <div className="output-group">
            <strong>Script</strong>
            {draft.script.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="output-group">
            <strong>Shot list</strong>
            {draft.shotList.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="output-chips">
            <span>{draft.soundMood}</span>
            <span>{draft.cutRhythm}</span>
          </div>
          <div className="tag-row">
            {draft.hashtags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function UploadTemplateForm(props: {
  uploadTitle: string;
  setUploadTitle: (value: string) => void;
  uploadCategory: string;
  setUploadCategory: (value: string) => void;
  uploadPrice: string;
  setUploadPrice: (value: string) => void;
  uploadHandle: string;
  setUploadHandle: (value: string) => void;
  uploadTemplate: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const monthlyDownloads = 1250;
  const revenue = (Number.parseFloat(props.uploadPrice) || 0) * monthlyDownloads * 0.18;
  return (
    <form className="panel upload-panel" onSubmit={props.uploadTemplate}>
      <div className="section-heading compact">
        <span className="eyebrow">Creator upload flow</span>
        <h1>Package your repeatable video logic as a sellable template.</h1>
      </div>
      <div className="form-grid">
        <Field label="Template title" value={props.uploadTitle} setValue={props.setUploadTitle} />
        <Field label="Category" value={props.uploadCategory} setValue={props.setUploadCategory} />
        <Field label="Creator handle" value={props.uploadHandle} setValue={props.setUploadHandle} />
        <Field label="Price" value={props.uploadPrice} setValue={props.setUploadPrice} />
      </div>
      <div className="cover-drop">
        <span>Cover preview</span>
        <strong>Drop a vertical result frame</strong>
      </div>
      <div className="logic-editor">
        {["Hook", "Setup", "Tension", "Payoff", "CTA"].map((block) => (
          <label className="field" key={block}>
            <span>{block}</span>
            <textarea defaultValue={`${block} logic for the creator to customize.`} />
          </label>
        ))}
      </div>
      <div className="revenue-card">
        <MetricCard label="Estimated monthly earnings" value={`$${Math.round(revenue).toLocaleString()}`} detail={`${monthlyDownloads.toLocaleString()} projected downloads`} />
        <button className="primary-button" type="submit">
          Publish Template
        </button>
      </div>
    </form>
  );
}

function EarningsDashboard({ templates, totalEarnings }: { templates: Template[]; totalEarnings: number }) {
  const topTemplates = [...templates].sort((a, b) => b.downloads * b.price - a.downloads * a.price).slice(0, 5);
  const bars = [42, 64, 58, 77, 91, 85, 100];
  return (
    <section className="section-stack">
      <div className="section-heading">
        <span className="eyebrow">Creator earnings</span>
        <h1>Track template sales, downloads, and conversion momentum.</h1>
      </div>
      <div className="metric-grid">
        <MetricCard label="Total earnings" value={`$${Math.round(totalEarnings).toLocaleString()}`} detail="Estimated seller share" />
        <MetricCard label="Downloads" value={templates.reduce((sum, template) => sum + template.downloads, 0).toLocaleString()} detail="All templates" />
        <MetricCard label="Active templates" value={String(templates.length)} detail="Marketplace live" />
        <MetricCard label="Avg conversion" value="7.8%" detail="Views to downloads" />
      </div>
      <div className="panel chart-panel">
        <div>
          <span className="eyebrow">Revenue trend</span>
          <h2>Weekly marketplace pulse</h2>
        </div>
        <div className="bar-chart">
          {bars.map((bar, index) => (
            <span style={{ height: `${bar}%` }} key={index} />
          ))}
        </div>
      </div>
      <div className="panel downloads-table">
        <h2>Top earning templates</h2>
        {topTemplates.map((template) => (
          <div className="table-row" key={template.id}>
            <strong>{template.title}</strong>
            <span>{template.downloads.toLocaleString()} downloads</span>
            <b>${Math.round(template.downloads * template.price * 0.18).toLocaleString()}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function SettingsPanel() {
  return (
    <section className="panel settings-panel">
      <span className="eyebrow">Settings</span>
      <h1>Workspace preferences</h1>
      <div className="setting-row">
        <strong>Preview density</strong>
        <span>Creator mode</span>
      </div>
      <div className="setting-row">
        <strong>Output format</strong>
        <span>Script, shot list, captions, hashtags</span>
      </div>
      <div className="setting-row">
        <strong>Marketplace region</strong>
        <span>Global English demo</span>
      </div>
    </section>
  );
}


