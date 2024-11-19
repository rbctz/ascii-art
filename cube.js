let A = 0, B = 0, C = 0;
const sA = Math.sin(A), cA = Math.cos(A);
const sB = Math.sin(B), cB = Math.cos(B);
const sC = Math.sin(C), cC = Math.cos(C);

const width = 160, height = 44;
const distanceFromCam = 100;
const K1 = 40;
const incrementSpeed = 0.6;
let cubeWidth = 20;
let horizontalOffset;

const zBuffer = new Array(width * height).fill(0);
const buffer = new Array(width * height).fill('.');

const calculateX = (i, j, k) => {
    return j * sA * sB * cC
        - k * cA * sB * cC
        + j * cA * sC
        + k * sA * sC
        + i * cB * cC
};

const calculateY = (i, j, k) => {
    return j * cA * cB
        + k * sA * cC
        - j * sA * sB * sC
        + k * cA * sB * sC
        - i * cB * sC
};

const calculateZ = (i, j, k) => {
    return k * cA * cB
        - j * sA * cB
        - i * sB
};

const calculateForSurface = (cubeX, cubeY, cubeZ, asciiCharacter) => {
    const x = calculateX(cubeX, cubeY, cubeZ);
    const y = calculateY(cubeX, cubeY, cubeZ);
    const z = calculateZ(cubeX, cubeY, cubeZ);

    const ooz = 1 / z;

    const xp = Math.floor(width / 2 + horizontalOffset + K1 * 2 * x * ooz);
    const yp = Math.floor(height / 2 + K1 * y * ooz);

    const index = xp + yp * width;
    if (index >= 0 && index < width * height && ooz > zBuffer[index]) {
        zBuffer[index] = ooz;
        buffer[index] = asciiCharacter;
    }
};

const renderFrame = () => {
    
    buffer.fill('.');
    zBuffer.fill(0);

    cubeWidth = 20;
    horizontalOffset = -2 * cubeWidth;
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    cubeWidth = 10;
    horizontalOffset = 1 * cubeWidth;
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    cubeWidth = 5;
    horizontalOffset = 8 * cubeWidth;
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    process.stdout.write('\x1b[H');
    for (let i = 0; i < width * height; i++) {
        process.stdout.write(i % width ? buffer[i] : '\n');
    }

    A += 0.05;
    B += 0.05;
    C += 0.01;

    console.log('A:', A, 'B:', B, 'C:', C);
    console.log('Buffer:', buffer.join(''));
    console.log('ZBuffer:', zBuffer.join(''));
};

setInterval(renderFrame, 15); // Animation interval of 50 milliseconds
