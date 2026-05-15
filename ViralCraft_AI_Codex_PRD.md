# ViralCraft AI ?Codex Build PRD / Implementation Brief

> Upload this file to Codex and ask it to build the demo.  
> Goal: create a polished, high-fidelity frontend prototype for an AI short-video viral-template marketplace and creation studio.

---

## 0. One-shot Codex Prompt

You are an expert frontend engineer and product-minded designer. Build a high-fidelity interactive frontend demo for **ViralCraft AI**, an AI-powered short-video creation platform.

The product provides **viral video logic templates** for new creators, AI digital humans, and small teams. Users can choose proven content frameworks, fill in their topic/materials/persona, and generate a video-ready script, shot list, captions, hashtags, and a vertical video preview. Influencers can upload their own proven viral templates and earn money from template downloads or usage.

Build a **TikTok-inspired but original** interface: minimal, premium, social-video native, dark/white contrast, soft glass panels, rounded cards, vertical phone preview, and restrained cyan/magenta accent colors. Do **not** use TikTok logos, icons, trademarked assets, or copy their UI exactly. This is an original product demo with a short-video social creator vibe.

Create the app as a frontend-only prototype with mock data. Prioritize visual polish, product storytelling, and interaction quality.

---

## 1. Product Overview

### Product Name
**ViralCraft AI**

### Product Positioning
An AI-powered viral video creation assistant and template marketplace.

### Core Value Proposition
ViralCraft AI helps beginners and AI digital humans create viral short videos by teaching and applying proven creator logic templates. It also allows experienced influencers to monetize their repeatable video frameworks.

### Core Product Logic
Most short-video beginners do not only need a video editor. They need a **repeatable content logic system**:
- How to open with a strong hook
- How to structure tension or curiosity
- How to pace cuts and captions
- How to place proof, payoff, CTA, or loop
- How to adapt the template to a niche, product, or AI avatar

ViralCraft AI turns those repeatable structures into reusable templates.

### Primary Users
1. **New human creators**
   - Need guidance, structure, and fast generation.
2. **AI digital human operators**
   - Need scripts, personas, voices, and repeatable video production flows.
3. **Influencers / expert creators**
   - Upload their viral templates and monetize via usage/download revenue.

---

## 2. MVP Scope

Build a frontend demo with 5 major areas:

1. **Template Marketplace**
   - Browse viral logic templates
   - Search and filter templates
   - View template cards with performance metrics
   - Select a template to load it into the creation studio

2. **Template Detail Preview**
   - Show template structure: Hook, Setup, Tension, Payoff, CTA
   - Show creator profile, usage count, price, viral score
   - Show what inputs the user needs to provide

3. **AI Creation Studio**
   - Select creator type: Human Creator / AI Digital Human / Brand Account
   - Fill topic, audience, tone, product/service, avatar style
   - Generate AI output: video script, shot list, captions, hashtags, posting title
   - Simulate generation with loading/progress state
   - Show vertical phone-style video preview

4. **Creator Upload Flow**
   - Influencer uploads a template
   - Add title, category, cover, template logic blocks, difficulty, pricing
   - Preview potential earnings based on downloads

5. **Creator Earnings Dashboard**
   - Show total earnings, downloads, conversion rate, top templates
   - Use simple charts or metric cards
   - Make it feel like a creator economy product

---

## 3. Recommended Tech Stack

If no existing project is open, create a Vite React app.

Recommended:
- React
- Vite
- Tailwind CSS
- lucide-react for icons
- framer-motion for subtle transitions
- recharts for simple earnings/download chart

If package installation is inconvenient, use plain React + CSS modules or a single CSS file. The final result should run locally with:

```bash
npm install
npm run dev
```

---

## 4. UI / Visual Direction

### Overall Style
- Premium, minimal, creator-economy SaaS meets short-video social app
- Original TikTok-inspired energy without copying trademarks or exact UI
- Dark mode first, with white/gray surfaces and neon accents
- Large vertical phone preview as the emotional center
- Rounded cards, soft borders, glassmorphism, subtle gradients
- Clean typography, strong hierarchy, not cluttered

### Color Tokens
Use these as inspiration:
```css
--bg: #07070A;
--panel: rgba(255,255,255,0.06);
--panel-strong: rgba(255,255,255,0.10);
--text: #F8FAFC;
--muted: #94A3B8;
--line: rgba(255,255,255,0.12);
--accent-pink: #FE2C55;
--accent-cyan: #25F4EE;
--accent-purple: #8B5CF6;
--success: #22C55E;
--warning: #F59E0B;
```

### Layout Direction
Desktop-first demo:
- Left vertical navigation rail
- Center template marketplace / studio workspace
- Right sticky vertical phone preview and AI output panel

Mobile responsiveness:
- Collapse left nav into top bar
- Phone preview moves below main content
- Cards become single-column

### Avoid
- Do not use TikTok name as the product brand
- Do not use TikTok official logo or icons
- Do not build a generic SaaS dashboard only
- Do not overcomplicate backend, auth, payment, or real video rendering

---

## 5. Information Architecture

### Left Navigation
- Discover
- Viral Templates
- AI Studio
- Upload Template
- Earnings
- Settings

### Top Bar
- Search input: search hooks, niches, creators?- Trend chips: `AI Avatar`, `Beauty`, `Product Review`, `Storytime`, `Education`, `UGC Ad`
- CTA button: `Generate with AI`

### Main Sections

#### 5.1 Discover / Marketplace
Show:
- Hero header: 鈥淭urn proven creator logic into viral-ready videos鈥?- Small explanation: 鈥淧ick a viral template, add your topic, let AI generate the script, shots, captions, and avatar-ready output.鈥?- Featured template cards
- Trending categories
- Creator leaderboard

Template card fields:
- Cover / gradient visual
- Template title
- Category
- Creator name
- Viral score
- Downloads
- Price
- Difficulty
- Key logic tags
- Button: `Use Template`

#### 5.2 Template Detail
When user selects a template:
- Big title
- Creator profile
- Viral performance metrics
- Logic breakdown:
  1. Hook
  2. Setup
  3. Tension / curiosity gap
  4. Payoff
  5. CTA / loop
- Required inputs
- Example output
- Button: `Open in AI Studio`

#### 5.3 AI Studio
Main workflow:
1. Select template
2. Choose creator mode
   - Human Creator
   - AI Digital Human
   - Brand Account
3. Input topic
4. Input target audience
5. Select tone
   - Bold
   - Friendly
   - Funny
   - Expert
   - Luxury
6. Optional:
   - Product name
   - Avatar persona
   - Voice style
   - CTA goal
7. Click `Generate Viral Draft`

Generated output panel:
- Video title
- Hook lines
- Full script
- Shot list
- Caption
- Hashtags
- Suggested sound mood
- Cut rhythm
- Posting tips

Phone preview:
- Simulated vertical video card
- Animated captions
- Creator avatar bubble
- Likes/comments/share mock actions
- Progress bar or scene timeline

#### 5.4 Upload Template
Influencer flow:
- Template title
- Category
- Cover upload placeholder
- Creator handle
- Template logic blocks
- Required input slots
- Price: free / paid
- Revenue estimate card
- Button: `Publish Template`

#### 5.5 Earnings Dashboard
Metrics:
- Total earnings
- Downloads
- Active templates
- Avg conversion rate
- Top earning template
- Recent downloads table
- Simple line/bar chart for downloads or revenue

---

## 6. Mock Data

Use this mock data directly in the frontend.

```js
const templates = [
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
    color: "from-pink-500 to-purple-500",
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
    color: "from-cyan-400 to-blue-500",
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
    color: "from-violet-500 to-fuchsia-500",
    logic: {
      hook: "Ask a direct question that the audience secretly has.",
      setup: "Define the concept in one simple sentence.",
      tension: "Explain the mistake most people make.",
      payoff: "Give a 3-step framework.",
      cta: "Ask viewers to follow for the next part."
    },
    inputs: ["Topic", "Audience level", "Common mistake", "3-step framework"],
    example: "Why do your AI videos feel fake? The problem is not the avatar 鈥?it is the script structure."
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
    color: "from-rose-400 to-orange-400",
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
    color: "from-amber-400 to-red-500",
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
    color: "from-green-400 to-emerald-600",
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
```

---

## 7. Interaction Requirements

### Minimum Interactions
- Search filters template list in real time
- Category chips filter templates
- Clicking a template updates selected template and right-side preview
- `Use Template` moves user to AI Studio area
- `Generate Viral Draft` simulates a 1鈥? second loading state
- Generated output changes based on selected template and user inputs
- Upload form accepts mock input and adds a new template card locally
- Earnings dashboard updates or displays mock stats

### Nice-to-have Interactions
- Animated phone captions
- Hover effects on template cards
- Template cards show 鈥渧iral logic鈥?preview on hover
- Toggle Human / AI Digital Human / Brand Account
- Light/dark toggle if easy

---

## 8. AI Output Generation Rules for Demo

No real AI API is required.

Create a local mock function:

```js
function generateDraft({ template, topic, audience, tone, creatorMode, productName }) {
  return {
    title: `I tested this ${topic} framework so you don't have to`,
    hook: [
      `Most people get ${topic} wrong in the first 3 seconds.`,
      `Here is the simple structure that keeps people watching.`
    ],
    script: [
      `Scene 1: Start with a bold claim about ${topic}.`,
      `Scene 2: Show the common mistake your ${audience || "audience"} makes.`,
      `Scene 3: Apply the ${template.title} logic.`,
      `Scene 4: Reveal the result and add a clear CTA.`
    ],
    caption: `Steal this structure for your next ${topic} video.`,
    hashtags: ["#AICreator", "#ViralTemplate", "#ShortVideo", "#CreatorTools"],
    soundMood: tone === "Funny" ? "playful beat" : "fast modern electronic",
    cutRhythm: template.difficulty === "Advanced" ? "fast cuts every 0.8s" : "clean cuts every 1.2s"
  };
}
```

Show the output in a polished panel. The point is to demonstrate the product logic, not real generation.

---

## 9. Component Suggestions

Create components such as:
- `App`
- `Sidebar`
- `TopBar`
- `TemplateCard`
- `TemplateDetail`
- `AIStudio`
- `PhonePreview`
- `GeneratedDraftPanel`
- `UploadTemplateForm`
- `EarningsDashboard`
- `MetricCard`
- `CategoryChip`

Keep files clean:
```txt
src/
  App.jsx or App.tsx
  main.jsx or main.tsx
  index.css
  components/
    Sidebar.jsx
    TemplateCard.jsx
    AIStudio.jsx
    PhonePreview.jsx
    EarningsDashboard.jsx
```

If speed matters, one `App.jsx` plus `index.css` is acceptable.

---

## 10. Acceptance Criteria

The demo is successful if:

1. It looks like a premium social-video AI product, not a generic admin dashboard.
2. A user can understand the marketplace + AI creation + influencer monetization logic within 30 seconds.
3. The vertical phone preview is prominent and visually compelling.
4. The template marketplace clearly shows viral logic, not just video thumbnails.
5. The AI Studio demonstrates how a beginner or AI digital human can turn a template into a video-ready draft.
6. The upload/earnings flow demonstrates creator monetization.
7. The app runs locally without backend services.
8. The code is readable and easy to extend.

---

## 11. Suggested Page Copy

### Hero
**Turn proven creator logic into viral-ready videos.**

Subcopy:
Pick a viral framework from top creators, add your topic, and let AI generate the hook, script, shots, captions, and avatar-ready preview.

### CTA Buttons
- Use Template
- Generate Viral Draft
- Upload My Template
- View Earnings

### Empty / Loading Copy
- 鈥淎nalyzing viral structure鈥︹€?- 鈥淲riting hook variations鈥︹€?- 鈥淏uilding avatar-ready shot list鈥︹€?- 鈥淥ptimizing retention moments鈥︹€?
---

## 12. Product Differentiation to Show in UI

Make sure the UI communicates these differences:

### Not just a video editor
It teaches the user why the video structure works.

### Not just a prompt tool
It converts creator knowledge into structured, reusable templates.

### Not just a marketplace
It creates a two-sided economy:
- Beginners / AI avatars consume templates
- Influencers upload templates and earn from their expertise

### Not just AIGC
It combines:
- Human creator know-how
- AI generation
- Digital human production workflow
- Data feedback and monetization

---

## 13. Final Build Instruction

Please build the frontend prototype now.

Use mock data, polished UI, and local state only.  
Create a complete runnable React app.  
Do not wait for backend APIs.  
Focus on product clarity, visual polish, and interactions.


