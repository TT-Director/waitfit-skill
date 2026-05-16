const fs = require('fs');
const path = require('path');

const movementsPath = path.join(__dirname, '..', 'data', 'movements.json');
const requiredFields = ['id', 'name', 'duration', 'body', 'mode', 'level', 'caution', 'pose', 'cue'];
const allowedBodies = new Set(['肩颈', '眼睛手腕', '腰背', '腿髋']);
const allowedModes = new Set(['坐姿', '站姿']);
const allowedPoses = new Set([
  'neck-side',
  'shoulder-circle',
  'eye-rest',
  'wrist-circle',
  'seated-cat-cow',
  'back-open',
  'calf-raise',
  'standing-march'
]);

function fail(message) {
  console.error(`waitfit movement validation failed: ${message}`);
  process.exit(1);
}

let movements;

try {
  movements = JSON.parse(fs.readFileSync(movementsPath, 'utf8'));
} catch (error) {
  fail(`could not read or parse movements.json: ${error.message}`);
}

if (!Array.isArray(movements)) {
  fail('movements.json must be an array');
}

if (movements.length < 8) {
  fail('movements.json must contain at least 8 movements');
}

const ids = new Set();

for (const [index, movement] of movements.entries()) {
  if (!movement || typeof movement !== 'object' || Array.isArray(movement)) {
    fail(`movement at index ${index} must be an object`);
  }

  for (const field of requiredFields) {
    if (!(field in movement)) {
      fail(`movement at index ${index} is missing required field "${field}"`);
    }
  }

  if (ids.has(movement.id)) {
    fail(`duplicate movement id "${movement.id}"`);
  }
  ids.add(movement.id);

  if (!Number.isInteger(movement.duration) || movement.duration < 30 || movement.duration > 300) {
    fail(`movement "${movement.id}" duration must be an integer from 30 to 300`);
  }

  if (!allowedBodies.has(movement.body)) {
    fail(`movement "${movement.id}" body must be one of 肩颈/眼睛手腕/腰背/腿髋`);
  }

  if (!allowedModes.has(movement.mode)) {
    fail(`movement "${movement.id}" mode must be 坐姿 or 站姿`);
  }

  if (movement.level !== '低强度') {
    fail(`movement "${movement.id}" level must be 低强度`);
  }

  if (typeof movement.cue !== 'string' || movement.cue.length > 48) {
    fail(`movement "${movement.id}" cue must be a string of 48 characters or fewer`);
  }

  if (typeof movement.caution !== 'string' || movement.caution.length === 0) {
    fail(`movement "${movement.id}" caution must be a non-empty string`);
  }

  if (!allowedPoses.has(movement.pose)) {
    fail(`movement "${movement.id}" pose is not supported by the HTML card`);
  }
}

console.log(`Validated ${movements.length} waitfit movements.`);
