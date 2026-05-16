#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const renderCard = path.join(__dirname, 'render-card.js');

function printHelp() {
  console.log([
    'Usage: waitfit-run.js [--delay-ms 15000] [--body 肩颈] [--id movement-id] [--out file.html] [--no-open] -- command [args...]',
    '',
    'Runs a command and opens a Waitfit card if the command is still running after the delay.',
    '',
    'Options:',
    '  --delay-ms  Milliseconds to wait before opening the card (default: 15000)',
    '  --body      Movement body area passed to render-card.js',
    '  --id        Exact movement id passed to render-card.js',
    '  --out       Output card path passed to render-card.js',
    '  --no-open   Render the card but do not open it',
    '  --help      Show this help'
  ].join('\n'));
}

function parseArgs(argv) {
  const args = {
    delayMs: 15000,
    body: '',
    id: '',
    out: '',
    open: true,
    command: []
  };

  let index = 0;
  while (index < argv.length) {
    const arg = argv[index];
    if (arg === '--') {
      args.command = argv.slice(index + 1);
      break;
    }
    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
    if (arg === '--no-open') {
      args.open = false;
      index += 1;
      continue;
    }
    if (arg === '--delay-ms') {
      args.delayMs = Number(argv[index + 1]);
      index += 2;
      continue;
    }
    if (arg === '--body') {
      args.body = argv[index + 1] || '';
      index += 2;
      continue;
    }
    if (arg === '--id') {
      args.id = argv[index + 1] || '';
      index += 2;
      continue;
    }
    if (arg === '--out') {
      args.out = argv[index + 1] || '';
      index += 2;
      continue;
    }
    throw new Error(`Unknown argument before --: ${arg}`);
  }

  if (!Number.isInteger(args.delayMs) || args.delayMs < 0) {
    throw new Error('--delay-ms must be a non-negative integer');
  }
  if (!args.command.length) {
    throw new Error('Missing command after --');
  }
  return args;
}

function renderWaitfit(args) {
  const renderArgs = [renderCard];
  if (args.id) renderArgs.push('--id', args.id);
  else if (args.body) renderArgs.push('--body', args.body);
  else renderArgs.push('--body', '肩颈');
  if (args.out) renderArgs.push('--out', args.out);
  if (args.open) renderArgs.push('--open');

  const result = childProcess.spawnSync(process.execPath, renderArgs, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const child = childProcess.spawn(args.command[0], args.command.slice(1), {
    stdio: 'inherit'
  });

  let cardOpened = false;
  const timer = setTimeout(() => {
    if (child.exitCode === null && !cardOpened) {
      cardOpened = true;
      renderWaitfit(args);
    }
  }, args.delayMs);

  child.on('exit', (code, signal) => {
    clearTimeout(timer);
    if (!cardOpened) {
      console.log('waitfit-run: command finished before movement card was needed');
    }
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code === null ? 1 : code);
  });

  child.on('error', (error) => {
    clearTimeout(timer);
    console.error(`waitfit-run failed: ${error.message}`);
    process.exit(1);
  });
}

try {
  main();
} catch (error) {
  console.error(`waitfit-run failed: ${error.message}`);
  process.exit(1);
}
