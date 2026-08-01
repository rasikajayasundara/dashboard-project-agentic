#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const Anthropic = require("@anthropic-ai/sdk");

const baseSha = process.env.PR_BASE_SHA;
const headSha = process.env.PR_HEAD_SHA;
const outputPath = process.env.REVIEW_OUTPUT_PATH || "review.md";

if (!baseSha || !headSha) {
  console.error("PR_BASE_SHA and PR_HEAD_SHA must be set");
  process.exit(1);
}

const MAX_DIFF_CHARS = 60000;

let diff = execSync(`git diff ${baseSha}...${headSha}`, {
  maxBuffer: 1024 * 1024 * 20,
  encoding: "utf8",
});

let truncatedNote = "";
if (diff.length > MAX_DIFF_CHARS) {
  diff = diff.slice(0, MAX_DIFF_CHARS);
  truncatedNote = "\n\n[diff truncated to fit the review request — showing the first part only]";
}

if (!diff.trim()) {
  fs.writeFileSync(outputPath, "_No diff content to review._");
  process.exit(0);
}

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

async function main() {
  const stream = client.messages.stream({
    model: "claude-opus-5",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system:
      "You are reviewing a pull request diff for a React 18 + Redux Toolkit + Redux-Saga project " +
      "(Create React App, styled-components, Bootstrap 5). Review for real bugs, security issues, and " +
      "correctness problems only — do not comment on formatting, style preferences, or nitpicks. Flag " +
      "violations of this project's conventions if visible in the diff: no createAsyncThunk (Redux-Saga " +
      "only, per the store/<feature>Slice pattern), no direct localStorage access (must use secureStorage " +
      "from src/utils/encryptedStorage.js), no hardcoded hex colors or px font-size values outside " +
      "src/constants/common.js, and endpoint paths must live in src/config/apiPath.js rather than being " +
      "hardcoded inline in sagas or components. Reply in concise GitHub-flavored markdown. If you find " +
      "nothing worth flagging, say so briefly in one line rather than padding the review.",
    messages: [
      {
        role: "user",
        content: `Review this diff:\n\n${diff}${truncatedNote}`,
      },
    ],
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    fs.writeFileSync(
      outputPath,
      "_Automated review declined to comment on this diff (safety classifier triggered)._"
    );
    return;
  }

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  fs.writeFileSync(outputPath, text || "_No review output produced._");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
