#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');

const templatePath = path.join(__dirname, '..', 'assets', 'waitfit-card.html');
const movementsPath = path.join(__dirname, '..', 'data', 'movements.json');
const defaultOutPath = path.join(os.tmpdir(), 'waitfit-card.html');

function printHelp() {
  console.log([
    'Usage: node render-card.js [--id movement-id] [--body body-name] [--out file.html] [--open]',
    '',
    'Options:',
    '  --id      Select an exact movement id',
    '  --body    Select the first movement with this body',
    '  --out     Output HTML path (default: os.tmpdir()/waitfit-card.html)',
    '  --open    Open the rendered card with macOS open',
    '  --help    Show this help'
  ].join('\n'));
}

function parseArgs(argv) {
  const args = {
    id: null,
    body: null,
    out: defaultOutPath,
    open: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help') {
      args.help = true;
    } else if (arg === '--open') {
      args.open = true;
    } else if (arg === '--id') {
      index += 1;
      if (!argv[index]) throw new Error('Missing value for --id');
      args.id = argv[index];
    } else if (arg === '--body') {
      index += 1;
      if (!argv[index]) throw new Error('Missing value for --body');
      args.body = argv[index];
    } else if (arg === '--out') {
      index += 1;
      if (!argv[index]) throw new Error('Missing value for --out');
      args.out = argv[index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function selectMovement(movements, args) {
  if (args.id) {
    const selected = movements.find((movement) => movement.id === args.id);
    if (!selected) throw new Error(`Unknown movement id: ${args.id}`);
    return selected;
  }

  if (args.body) {
    const selected = movements.find((movement) => movement.body === args.body);
    if (!selected) throw new Error(`Unknown movement body: ${args.body}`);
    return selected;
  }

  return movements.find((movement) => movement.body === '肩颈') || movements[0];
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const movements = JSON.parse(fs.readFileSync(movementsPath, 'utf8'));

  if (!Array.isArray(movements) || movements.length === 0) {
    throw new Error('movements.json must contain at least one movement');
  }

  const selected = selectMovement(movements, args);
  const rendered = template
    .replace('__WAITFIT_MOVEMENT_JSON__', JSON.stringify(selected))
    .replace('__WAITFIT_MOVEMENTS_JSON__', JSON.stringify(movements));

  const outPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, rendered, 'utf8');
  console.log(outPath);

  if (args.open) {
    childProcess.spawnSync('open', [outPath], { stdio: 'ignore' });
  }
}

try {
  main();
} catch (error) {
  console.error(`waitfit render failed: ${error.message}`);
  process.exit(1);
}
