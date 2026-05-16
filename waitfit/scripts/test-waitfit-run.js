#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const childProcess = require('child_process');

const runner = path.join(__dirname, 'waitfit-run.js');
const node = process.execPath;

function run(args) {
  return childProcess.spawnSync(node, [runner, ...args], {
    encoding: 'utf8'
  });
}

function uniqueOut(name) {
  return path.join(os.tmpdir(), `${name}-${Date.now()}-${Math.random().toString(16).slice(2)}.html`);
}

function assertFileMissing(file) {
  assert.strictEqual(fs.existsSync(file), false, `${file} should not exist`);
}

function assertFileContains(file, text) {
  assert.strictEqual(fs.existsSync(file), true, `${file} should exist`);
  assert.ok(fs.readFileSync(file, 'utf8').includes(text), `${file} should include ${text}`);
}

{
  const out = uniqueOut('waitfit-short');
  const result = run(['--delay-ms', '200', '--no-open', '--out', out, '--', node, '-e', 'process.exit(0)']);
  assert.strictEqual(result.status, 0, result.stderr);
  assertFileMissing(out);
  assert.ok(result.stdout.includes('waitfit-run: command finished before movement card was needed'));
}

{
  const out = uniqueOut('waitfit-long');
  const result = run(['--delay-ms', '50', '--no-open', '--out', out, '--body', '肩颈', '--', node, '-e', 'setTimeout(() => process.exit(0), 150)']);
  assert.strictEqual(result.status, 0, result.stderr);
  assertFileContains(out, '痛就停，别硬拉。');
  assert.ok(result.stdout.includes(out));
}

{
  const out = uniqueOut('waitfit-exit');
  const result = run(['--delay-ms', '50', '--no-open', '--out', out, '--', node, '-e', 'setTimeout(() => process.exit(7), 120)']);
  assert.strictEqual(result.status, 7);
  assertFileContains(out, 'Waitfit');
}

console.log('waitfit-run tests passed');
