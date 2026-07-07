// Managed by hy-mt2-github-translator. Do not edit by hand; regenerate instead.
// Zero-dependency incremental README translator using Node.js built-ins and Tencent Hunyuan MT.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const config = JSON.parse(await readFile(path.join(scriptDir, "config.json"), "utf8"));

const apiKey = process.env[config.apiKeyEnv];
if (!apiKey) {
  throw new Error("Missing translation API key: set the " + config.apiKeyEnv + " secret in the repository settings.");
}

const rawSource = await readFile(path.join(repoRoot, config.sourceReadme), "utf8");
const source = stripManagedBlock(rawSource, config.managedBlock);
const baseSha = process.env.HY_MT2_BASE_SHA || "";
const previousSource = await readPreviousSource(config.sourceReadme, baseSha);

for (const target of config.targets) {
  const content = await translateTarget(target, source, previousSource);
  if (content === null) {
    console.log("No changes for " + target.path + " (" + target.language + "); left as is.");
    continue;
  }
  await writeFile(path.join(repoRoot, target.path), ensureTrailingNewline(content), "utf8");
  console.log("Updated " + config.sourceReadme + " -> " + target.path + " (" + target.language + ")");
}

async function translateTarget(target, source, previousSource) {
  const existingRaw = await readFileOrNull(path.join(repoRoot, target.path));
  if (previousSource !== null && existingRaw !== null) {
    const incremental = await translateIncrementally(target, source, previousSource, existingRaw);
    if (incremental !== undefined) {
      return incremental;
    }
    console.log("Falling back to full translation for " + target.path + " (could not align blocks).");
  }
  return translateFull(target, source);
}

async function translateIncrementally(target, source, previousSource, existingRaw) {
  const existing = stripManagedBlock(existingRaw, config.managedBlock);
  const previous = splitBlocks(previousSource);
  const existingBlocks = splitBlocks(existing);
  const current = splitBlocks(source);

  // Alignment requires the previous source and existing translation to share
  // structure; if they diverge, we cannot safely reuse translated blocks.
  if (previous.contents.length !== existingBlocks.contents.length) {
    return undefined;
  }

  const matches = matchBlocks(previous.contents, current.contents);
  const outputs = new Array(current.contents.length);
  const changed = [];

  for (let i = 0; i < current.contents.length; i += 1) {
    const block = current.contents[i];
    const prevIndex = matches[i];
    if (block.trim() === "") {
      outputs[i] = block;
    } else if (prevIndex !== -1) {
      outputs[i] = existingBlocks.contents[prevIndex];
    } else {
      changed.push(i);
    }
  }

  if (changed.length === 0) {
    return null;
  }

  for (const index of changed) {
    outputs[index] = await translateSegment(target, source, current.contents[index]);
  }

  return joinBlocks(outputs, current.separators);
}

async function translateFull(target, source) {
  return callModel(buildFullPrompt(config.sourceReadme, target.label, source));
}

async function translateSegment(target, fullSource, segment) {
  return callModel(buildSegmentPrompt(config.sourceReadme, target.label, fullSource, segment));
}

function splitBlocks(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  const fences = findFencedRanges(normalized);
  const separatorPattern = /\n[ \t]*\n[ \t\n]*/g;
  const contents = [];
  const separators = [];
  let last = 0;
  let match;

  while ((match = separatorPattern.exec(normalized)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (isInsideFence(start, fences) || isInsideFence(end - 1, fences)) {
      continue;
    }
    contents.push(normalized.slice(last, start));
    separators.push(match[0]);
    last = end;
  }
  contents.push(normalized.slice(last));

  return { contents, separators };
}

function joinBlocks(contents, separators) {
  let result = contents.length > 0 ? contents[0] : "";
  for (let i = 1; i < contents.length; i += 1) {
    result += separators[i - 1] + contents[i];
  }
  return result;
}

function findFencedRanges(text) {
  const ranges = [];
  let offset = 0;
  let fenceStart = -1;
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      if (fenceStart === -1) {
        fenceStart = offset;
      } else {
        ranges.push([fenceStart, offset + line.length]);
        fenceStart = -1;
      }
    }
    offset += line.length + 1;
  }
  if (fenceStart !== -1) {
    ranges.push([fenceStart, text.length]);
  }

  return ranges;
}

function isInsideFence(index, ranges) {
  for (const range of ranges) {
    if (index >= range[0] && index < range[1]) {
      return true;
    }
  }
  return false;
}

function matchBlocks(previous, current) {
  // Longest common subsequence over block content, so unchanged blocks map to
  // their previous index and only genuinely new/edited blocks are retranslated.
  const m = previous.length;
  const n = current.length;
  const dp = [];
  for (let i = 0; i <= m; i += 1) {
    dp.push(new Array(n + 1).fill(0));
  }
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] = previous[i] === current[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result = new Array(n).fill(-1);
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (previous[i] === current[j]) {
      result[j] = i;
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return result;
}

async function readPreviousSource(sourcePath, sha) {
  if (!sha || /^0+$/.test(sha)) {
    return null;
  }
  try {
    const raw = await git(["show", sha + ":" + sourcePath]);
    return stripManagedBlock(raw, config.managedBlock);
  } catch {
    return null;
  }
}

function git(args) {
  return new Promise((resolve, reject) => {
    execFile("git", ["-C", repoRoot, ...args], { maxBuffer: 32 * 1024 * 1024 }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function readFileOrNull(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function stripManagedBlock(content, managedBlock) {
  if (!managedBlock || !managedBlock.start || !managedBlock.end) {
    return content;
  }
  const pattern = new RegExp(escapeRegExp(managedBlock.start) + "[\\s\\S]*?" + escapeRegExp(managedBlock.end) + "\\n*", "g");
  return content.replace(pattern, "");
}

function buildFullPrompt(sourcePath, targetLabel, content) {
  return [
    "请将以下 Markdown README 文件翻译为" + targetLabel + "。",
    "",
    "翻译规则：",
    "- 只输出翻译后的 Markdown 正文。",
    "- 保留 Markdown 结构、标题层级、表格、链接、URL、徽章、代码块、行内代码、命令示例、占位符和文件路径。",
    "- 翻译正文、标题、说明文字和表格文本中适合翻译的自然语言内容。",
    "- 项目名、API 名、包名、模型名、标识符和代码符号保持原文，除非原文已经给出对应译名。",
    "- 不要添加解释，不要用额外代码围栏包裹结果。",
    "",
    "源文件：" + sourcePath,
    "",
    "Markdown 内容：",
    content
  ].join("\n");
}

function buildSegmentPrompt(sourcePath, targetLabel, fullSource, segment) {
  return [
    "你在增量维护一个 Markdown README 的" + targetLabel + "翻译。",
    "下面提供完整的源文档作为上下文，但你只需要翻译其中指定的片段。",
    "",
    "翻译规则：",
    "- 只输出【待翻译片段】对应的" + targetLabel + "译文，不要输出其他段落。",
    "- 保留 Markdown 结构、标题层级、表格、链接、URL、徽章、代码块、行内代码、命令示例、占位符和文件路径。",
    "- 术语、风格、专有名词的译法要与完整文档的上下文保持一致。",
    "- 项目名、API 名、包名、模型名、标识符和代码符号保持原文，除非上下文已经给出对应译名。",
    "- 不要添加解释，不要用额外代码围栏包裹结果，不要复述源文。",
    "",
    "源文件：" + sourcePath,
    "",
    "【完整源文档（仅作上下文）】",
    fullSource,
    "",
    "【待翻译片段】",
    segment
  ].join("\n");
}

async function callModel(prompt) {
  const url = config.baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error("Translation request failed with HTTP " + response.status + ": " + (errorBody || response.statusText));
  }

  const parsed = await response.json();
  const content = parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Translation response did not include message content.");
  }
  return content;
}

function ensureTrailingNewline(content) {
  return content.endsWith("\n") ? content : content + "\n";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
