# Waitfit

Created by **TT**.

别人都在关心你的代码写得好不好。

Waitfit 关心你能不能健康地写代码。

我们正在进入一个很奇怪的时代：  
代码越来越快，生成越来越快，agent 越跑越久。  
但写代码的人，还是坐在那里，脖子越来越硬，腰越来越沉，眼睛越来越干。

AI 时代最大的红利，可能不是谁多写了 10 万行代码。  
而是谁十年后还能清醒、健康、稳定地坐在电脑前，继续创造。

所以 Waitfit 做的事情很小：

当 Codex 在跑测试、构建、生成、等 agent 的时候，  
它不只让你盯着终端发呆。  
它会轻轻问你一句：

> 这个可能要等一会儿。要不要来个 60 秒肩颈 reset？

你说“来”，它就打开一个很轻的本地动作卡。  
一个火柴人，一段倒计时，一句动作提示。  
不打卡，不说教，不健身羞辱。  
只是把本来浪费掉的等待时间，还给你的身体。

十年后，希望我们还能一起写代码。  
不是靠硬扛，是靠在每一次等待里，顺手照顾一下自己。

## What It Is

Waitfit is a lightweight Codex skill for body resets during long vibe-coding waits.

It includes:

- A Codex skill protocol for polite waiting-time movement prompts.
- A tiny local HTML card with stick-figure demos.
- A countdown timer synced with the movement.
- Desk-friendly shoulder, neck, wrist, back, eye, leg, and hip movements.
- A command wrapper for reliable timing when Codex cannot predict wait length.

It is not a medical product, workout plan, or productivity guilt machine.

## Install

Clone this repo, then run:

```bash
./install.sh
```

It installs to:

```bash
${CODEX_HOME:-$HOME/.codex}/skills/waitfit
```

Restart Codex or open a new conversation so local skills reload.

## Use It In Codex

Try saying:

- `等的时候带我动一下`
- `来个肩颈 reset`
- `等待健身`
- `跑测试的时候带我活动一下`

When Codex expects a long wait, the skill guides it to ask once, lightly, before the waiting window is wasted.

## Use It As A Command Wrapper

For more reliable timing, wrap a command:

```bash
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/waitfit-run.js" -- npm test
```

If the command finishes quickly, nothing happens.  
If it is still running after 15 seconds, Waitfit opens the movement card while your command keeps running.

The original command exit code is preserved.

More examples:

```bash
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/waitfit-run.js" --body 腰背 -- pnpm build
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/waitfit-run.js" --delay-ms 10000 -- pytest
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/waitfit-run.js" --no-open --out /tmp/waitfit.html -- npm test
```

## Smoke Test

```bash
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/validate-movements.js"
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/test-waitfit-run.js"
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/render-card.js" --body 肩颈 --open
```

Expected:

```text
Validated 8 waitfit movements.
waitfit-run tests passed
```

## Requirements

- Codex with local skills support.
- Node.js available on `PATH`.
- macOS for automatic `open` behavior.

On other systems, use:

```bash
node "${CODEX_HOME:-$HOME/.codex}/skills/waitfit/scripts/render-card.js" --body 肩颈 --out /tmp/waitfit.html
```

Then open the generated file manually.

## Safety

Waitfit is not medical advice.

All default movements are low intensity and desk friendly.  
Stop if there is pain, dizziness, instability, or discomfort.

The rule is simple:

> 痛就停，别硬拉。

## Why This Exists

Vibe coding makes us feel like we can build anything.

But if every build, every test, every agent run quietly taxes our neck, back, wrists, and eyes, then the future gets expensive in a very boring way.

Waitfit is a tiny reminder that the builder is part of the system.

Your code can get faster.  
Your tools can get smarter.  
Your body should not be the thing paying the bill.
