const readline = require("readline");

let A = 0, B = 0, M = Math;

const renderFrame = () => {
	let b = [], z = [];
	A += 0.03;
	B += 0.05;

	for (let k = 0; k < 1760; k++) {
		b[k] = k % 80 == 79 ? "\n" : " ";
		z[k] = 0;
	}

	for (let j = 0; j < 6.28; j += 0.07) {
		for (let i = 0; i < 6.28; i += 0.02) {
			const h = Math.cos(j) + 2;
			const D = 1 / (Math.sin(i) * h * Math.sin(A) + Math.sin(j) * Math.cos(A) + 5);
			const t = Math.sin(i) * h * Math.cos(A) - Math.sin(j) * Math.sin(A);
			const x = (40 + 30 * D * (Math.cos(i) * h * Math.cos(B) - t * Math.sin(B))) | 0;
			const y = (12 + 15 * D * (Math.cos(i) * h * Math.sin(B) + t * Math.cos(B))) | 0;
			const o = x + 80 * y;
			const N = (8 * ((Math.sin(j) * Math.sin(A) - Math.sin(i) * Math.cos(j) * Math.cos(A)) * Math.cos(B) - Math.sin(i) * Math.cos(j) * Math.sin(A) - Math.sin(j) * Math.cos(A) - Math.cos(i) * Math.cos(j) * Math.sin(B))) | 0;

			if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
				z[o] = D;
				b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
			}
		}
	}
	process.stdout.write('\x1b[2J\x1b[H' + b.join(""));
};

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
    if (key && key.name === "q")  {
		console.clear();
        process.exit();
        console.clear();
    }
});

setInterval(renderFrame, 50); // Animation interval of 50 milliseconds