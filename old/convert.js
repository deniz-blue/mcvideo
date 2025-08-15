const { spawn } = require("child_process");

const i2mapPath = "C:\\Users\\dennis\\source\\Repos\\TheAlan404\\i2map\\target\\release\\i2map.exe";

let proc = spawn(i2mapPath, [], {
	stdio: ["pipe", "pipe", "inherit"],
});

proc.on("error", (e) => console.log("[i2map ERROR] " + e.toString()));
proc.on("close", (code) => console.log("[i2map close] " + code));

const i2map = (r,g,b) => {
	console.log("converting")
	proc.stdin.write(Buffer.from([r,g,b]));
	let val;
	let i = 0;
	while(!val) {
		val = proc.stdout.read(1);
		i++;
	};
	console.log("conv took " + i);
	return val;
};

/**
 * wow
 * @param {buffer} data - Uint8ClampedArray from canvas.getImage
 * @returns {({width: number, height: number, data: number[]})}
 */
async function convertFrame(data) {
	let mapColorArray = []; 
	for (let i = 0; i < data.length; i += 3) {
		let mapColor = i2map(data[i], data[i + 1], data[i + 2]);
		mapColorArray.push(mapColor);
	}
	return Buffer.from(mapColorArray);
};

module.exports = {
	convertFrame,
	i2map,
};