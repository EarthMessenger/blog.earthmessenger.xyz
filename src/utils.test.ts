import { test, expect } from 'vitest';
import { extractDescription, convertText } from './utils';

test("convertText s2t", () => {
    const simplified = "汉字";
    const traditional = "漢字";
    expect(convertText(simplified, "zh-hans", "zh-hant")).toBe(traditional);
});

test("convertText t2s", () => {
    const simplified = "汉字";
    const traditional = "漢字";
    expect(convertText(traditional, "zh-hant", "zh-hans")).toBe(simplified);
});

test("extractDescription", () => {
    const blog = `
---
title: Test Blog
---

## To be, or not to be

To *be*, or not to **be**, ~this~ that is the \`question\`:
[Whether](/) 'tis nobler in the mind to suffer

\`\`\`
The slings and arrows of outrageous fortune,
\`\`\`

![Hamlet](hamlet.webp)

Or to take arms against a sea of troubles
And by opposing end them. To die—to sleep,
`.trim();

  expect(extractDescription(blog)).toBe("To be, or not to be To be, or not to be, this that is the : Whether 'tis nobler in the mind to suffer Or to take arms against a sea of troubles And…");
});