import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, "..", "src");
const BASE = "https://hammerhead-app-jkdit.ondigitalocean.app";
const ESC = BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(name)) out.push(p);
  }
  return out;
}

function ensureImport(content) {
  if (!content.includes("apiUrl(")) return content;
  if (content.includes("@/lib/apiBase")) return content;
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].startsWith("import ") || lines[i].trim() === "")) i++;
  lines.splice(i, 0, `import { apiUrl } from "@/lib/apiBase";`);
  return lines.join("\n");
}

for (const file of walk(srcRoot)) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  s = s.replace(
    new RegExp(`new URL\\("${ESC}/products"\\)`, "g"),
    'new URL(apiUrl("/products"), typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:3000")'
  );

  s = s.replace(new RegExp(`"${ESC}([^"]*)"`, "g"), (_, pathTail) => {
    const p = pathTail.startsWith("/") ? pathTail : `/${pathTail}`;
    return `apiUrl("${p}")`;
  });

  s = s.replace(new RegExp("`" + ESC + "/([^`]+)`", "g"), (_, tail) => `apiUrl(\`/${tail}\`)`);

  if (s !== orig) {
    s = ensureImport(s);
    fs.writeFileSync(file, s);
    console.log("updated", path.relative(srcRoot, file));
  }
}
