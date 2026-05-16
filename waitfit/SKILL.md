---
name: waitfit
description: Use when the user wants a lightweight body reset during Codex/vibe-coding waits, or when Codex is about to start a task likely to wait longer than 2 minutes and can politely offer a desk-friendly movement card before the waiting window is wasted. Triggers include "等的时候带我动一下", "来个肩颈 reset", "等待健身", and long-running tests/builds/generation/agent waits.
---

# Waitfit

Waitfit is a tiny waiting-time body reset skill for Codex builders.

It is not a health management product, a workout plan, or medical advice. It only helps the user use long coding waits for low-risk desk-friendly movement.

## Core Behavior

Use this skill in two situations:

1. **Active trigger:** the user directly asks for a movement break while waiting.
2. **Passive light prompt:** Codex is about to start, or has just started, a real idle wait likely to last longer than 2 minutes.
3. **Command wrapper:** the user intentionally runs a command through `scripts/waitfit-run.js` for more reliable timing.

When passively prompting, ask once:

> 这个可能要等一会儿。要不要来个 60 秒肩颈 reset？我可以开一个很轻的动作卡。

Prompt before launching a known-long command when possible, or immediately after starting a wait if the long duration only becomes obvious then. Do not wait until 2 minutes have already elapsed; those 2 minutes are the useful movement window.

Do not prompt during active reasoning, error explanation, decision-making, or final reporting. If the user ignores the prompt, continue the work and do not repeat it for the same wait.

## Interaction Flow

When the user accepts:

1. Pick one default movement from `data/movements.json`.
2. Prefer `肩颈` or `眼睛手腕` unless the user asks for another area.
3. Say one short line:

   > 来，先做 60 秒肩颈 reset。坐着就行，痛就停。

4. Render and open the HTML card using `scripts/render-card.js`.
5. After completion, return to work with:

   > 好，身体上线一点了。我们回来看任务跑到哪儿了。

## Recommendation Rules

- Expected total wait under 2 minutes: do not passively suggest Waitfit.
- Expected total wait 2-3 minutes: suggest at the start of the wait and recommend one 60-second movement.
- Expected total wait 3-5 minutes: suggest at the start of the wait and recommend a 3-minute mini set covering 2 body areas.
- Expected total wait over 5 minutes: suggest at the start of the wait and recommend a 5-minute mini set covering shoulders/neck, back, and legs/hips.

If Codex cannot estimate before a command starts, it may prompt only when there is still enough likely remaining wait to move. Do not prompt at the end of a wait just because elapsed time crossed 2 minutes.

For v1, the HTML card renders one movement at a time. For 3-minute or 5-minute mini sets, render the first movement and verbally say that the user can tap `加长` if they want to keep going.

## Reliable Command Wrapper

When the user wants more reliable timing than Codex can infer, use:

```bash
node "$CODEX_HOME/skills/waitfit/scripts/waitfit-run.js" -- npm test
```

The wrapper runs the command immediately. If the command is still running after 15 seconds, it opens a Waitfit card while the command continues. If the command finishes quickly, it does not open a card. The wrapper preserves the wrapped command's exit code.

Useful options:

```bash
node "$CODEX_HOME/skills/waitfit/scripts/waitfit-run.js" --body 腰背 -- pnpm build
node "$CODEX_HOME/skills/waitfit/scripts/waitfit-run.js" --delay-ms 10000 -- pytest
node "$CODEX_HOME/skills/waitfit/scripts/waitfit-run.js" --no-open --out /tmp/waitfit.html -- npm test
```

## Safety Rules

- Keep all default actions desk-friendly and low-risk.
- Avoid jumping, sprinting, floor work, heavy exertion, fast neck twisting, deep lumbar folding, and long breath holding.
- Always include: `痛就停，别硬拉。`
- Do not claim to treat pain, neck problems, back problems, or any medical condition.
- If the user mentions dizziness, surgery recovery, acute pain, pregnancy, or instability, stop or choose seated eye rest only and suggest professional advice when appropriate.

## Tone

Use relaxed companionship.

Good:

> 等它跑着，我们顺手把肩颈放一下。坐着就行，痛就停。

Avoid fear-based health warnings, fitness pressure, streaks, medical authority language, or long education.

## Visual Card

The visual card should stay token-light:

- Fixed HTML/CSS/JS template in `assets/waitfit-card.html`
- Compact movement payload from `data/movements.json`
- Stick figure SVG pose
- Countdown timer
- One short movement cue
- Four small controls: `换一个`, `加长`, `换部位`, `结束`

Use:

```bash
node "$CODEX_HOME/skills/waitfit/scripts/render-card.js" --id neck-side-stretch --open
```

If opening the browser is not appropriate, render the file and report the path instead.
