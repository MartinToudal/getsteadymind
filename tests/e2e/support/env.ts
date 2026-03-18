import fs from "node:fs";
import path from "node:path";

const ENV_FILE = path.join(process.cwd(), ".env.local");

function parseLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();

  return { key, value };
}

export function loadLocalEnv() {
  if (!fs.existsSync(ENV_FILE)) {
    return;
  }

  const content = fs.readFileSync(ENV_FILE, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const parsed = parseLine(line);

    if (!parsed || process.env[parsed.key]) {
      continue;
    }

    process.env[parsed.key] = parsed.value;
  }
}

export const E2E_TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? "e2e+steadymind@example.com";
export const E2E_TEST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "SteadyMindE2E123!";
