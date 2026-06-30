import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "docs/task-1-verification-approach.md",
  "docs/task-2-scenario-matrix.md",
  "docs/task-3-cicd-guide.md",
  "docs/technical-architecture.md",
  ".circleci/config.yml"
];

for (const file of requiredFiles) {
  await access(file);
  const content = await readFile(file, "utf8");
  if (content.trim().length < 200) {
    throw new Error(`${file} looks too thin for reviewer handoff`);
  }
}

console.log("Documentation checks passed.");
