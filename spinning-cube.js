const readline = require("readline");

let A = 0, B = 0, C = 0;

const cubeWidth = 20;
const width = 160, height = 44;
const zBuffer = new Float32Array(width * height).fill(0);
const buffer = new Array(width * height).fill(" ");
const backgroundASCIICode = " ";
const distanceFromCam = 100;
const K1 = 40;

const incrementSpeed = 0.6;

function calculateX(i, j, k) {
  return (
    j * Math.sin(A) * Math.sin(B) * Math.cos(C) -
    k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
    j * Math.cos(A) * Math.sin(C) +
    k * Math.sin(A) * Math.sin(C) +
    i * Math.cos(B) * Math.cos(C)
  );
}

function calculateY(i, j, k) {
  return (
    j * Math.cos(A) * Math.cos(C) +
    k * Math.sin(A) * Math.cos(C) -
    j * Math.sin(A) * Math.sin(B) * Math.sin(C) +
    k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
    i * Math.cos(B) * Math.sin(C)
  );
}

function calculateZ(i, j, k) {
  return (
    k * Math.cos(A) * Math.cos(B) -
    j * Math.sin(A) * Math.cos(B) +
    i * Math.sin(B)
  );
}

function calculateForSurface(cubeX, cubeY, cubeZ, ch) {
  const x = calculateX(cubeX, cubeY, cubeZ);
  const y = calculateY(cubeX, cubeY, cubeZ);
  const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

  const xp = Math.floor(width / 2 + K1 / z * x * 2);
  const yp = Math.floor(height / 2 - K1 / z * y);

  const idx = xp + yp * width;
  if (idx >= 0 && idx < width * height) {
    if (1 / z > zBuffer[idx]) {
      zBuffer[idx] = 1 / z;
      buffer[idx] = ch;
    }
  }
}

function draw() {
  buffer.fill(backgroundASCIICode);
  zBuffer.fill(0);

  for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
    for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
      calculateForSurface(cubeX, cubeY, -cubeWidth, "@");
      calculateForSurface(cubeWidth, cubeY, cubeX, "^");
      calculateForSurface(-cubeWidth, cubeY, -cubeX, "#");
      calculateForSurface(-cubeX, cubeY, cubeWidth, "~");
      calculateForSurface(cubeX, -cubeWidth, -cubeY, "*");
      calculateForSurface(cubeX, cubeWidth, cubeY, "!");
    }
  }

  process.stdout.write('\x1b[H');
  for (let k = 0; k < width * height; k++) {
    process.stdout.write(k % width ? buffer[k] : "\n");
  }

  A += 0.05;
  B += 0.05;
  C += 0.01;
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
  if (key && key.name === "q")  {
    process.exit();
    console.clear();
  }
});
setInterval(draw, 16);