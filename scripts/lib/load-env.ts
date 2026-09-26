/**
 * Minimal `.env` loader for standalone scripts run with tsx. Loads `.env.local`
 * first, then `.env`, without overriding variables already present in the
 * process environment. Mirrors Next.js semantics closely enough for CLI tools.
 */

import * as fs from "node:fs";
import * as path from "node:path";

function parseEnvFile(filePath: string): Record<string, string> {
  const out: Record<string, string> = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

export function loadEnv(startDir = process.cwd()): void {
  const root = fs.existsSync(path.join(startDir, "package.json")) ? startDir : process.cwd();
  for (const name of [".env.local", ".env"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    const entries = parseEnvFile(file);
    for (const [key, value] of Object.entries(entries)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}