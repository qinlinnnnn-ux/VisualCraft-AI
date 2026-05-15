import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const indexPath = join(process.cwd(), "dist", "index.html");
const fallbackPath = join(process.cwd(), "dist", "404.html");

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run the Vite build first.");
}

copyFileSync(indexPath, fallbackPath);
console.log("Copied dist/index.html to dist/404.html for GitHub Pages SPA fallback.");
