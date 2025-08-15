const Msg = require("./Msg");
const db = require("./usermanager");


module.exports = async function (serv, Parser) {
	const { CommandHandler } = await import("string-commands");

	const handler = new CommandHandler({ prefix: "/" });
	handler.buildArguments = ({ ctx, args }) => [args, ctx.client];
	handler.on("invalidUsage", ({ errors, command }) => {
		client.chat(new Msg("Error: Incorrect usage: " + handler.prettyPrint(command) + "\n" + errors.map(e => "  - " + e).join("\n"), "red"));
	});
	handler.addCommand(({
		name: "image",
		aliases: ["i"],
		usage: ["<link: text>"],
		run: (args, client) => {
			serv.chat(new Msg("> Displaying image sent by " + client.username, "dark_gray", args[0]));
			let link = args[0];
			try {
				console.time('frame speed');
				serv.mplayer.renderImage(link);
				console.timeEnd('frame speed');
			} catch (e) {
				serv.chat(new Msg(e.toString(), "red"));
			};
		},
	}))
	handler.addCommand(({
		name: "imagetest",
		aliases: ["it"],
		run: (args, client) => {
			serv.chat(new Msg("> Displaying test image sent by " + client.username, "dark_gray"));
			try {
				serv.mplayer.renderImage("https://luna.cat.casa/test_image.png");
			} catch (e) {
				serv.chat(new Msg(e.toString(), "red"));
			};
		},
	}));
	handler.addCommand(({
		name: "play",
		aliases: ["p"],
		args: ["text"],
		run: ([src], client) => {
			serv.chat(new Msg("> Processing video...", "gray", src));
			try {
				serv.mplayer.play(src);
			} catch (e) {
				//serv.mplayer.queue.shift();
				serv.chat(new Msg(e.toString(), "red"));
			};
		},
	}));
	handler.addCommand(({
		name: "lagtrain",
		run: (args, client) => {
			serv.chat(new Msg("> Loading...", "gray"));
			try {
				serv.mplayer.play("/tmp/lagtrain.mp4");
				globalThis.$lagtrain = true;
			} catch (e) {
				serv.chat(new Msg(e.toString(), "red"));
			};
		},
	}));
	handler.addCommand(({
		name: "playtest",
		aliases: ["pt"],
		usage: [],
		run: (args, client) => {
			let src = "https://www.youtube.com/watch?v=UnIhRpIT7nc";

			serv.chat(new Msg("> Processing video (playtest)...", "gray", src));
			try {
				serv.mplayer.play(src);
			} catch (e) {
				serv.chat(new Msg(e.toString(), "red"));
			};
		},
	}));
	handler.addCommand({
		name: "setfps",
		usage: ["<fps:number>"],
		run: (args) => {
			serv.mplayer.FPS = args[0];
			serv.chat(new Msg("> FPS set to " +args[0], "gray"))
		},
	});
	handler.addCommand({
		name: "stop",
		run: () => {
			serv.mplayer.stop();
		},
	});
	handler.addCommand({
		name: "vanish",
		run: (args, client) => {
			client.db.vanish = !client.db.vanish;
			client.chat(client.db.vanish ? new Msg("> You are now hidden", "red") : new Msg("> You are now seen", "green"));
			db.save(client.username, client.db);
		},
	});
	handler.addCommand(({
		name: "color",
		aliases: ["c"],
		usage: ["<color:number>"],
		run: (args, client) => {
			let h = Buffer.alloc(128 * 128).fill(Buffer.from(args[0], "hex"));
			serv.mplayer.renderDisplays({
				1: h, 2: h, 3: h, 4: h, 5: h, 6: h, 7: h, 8: h
			});
		},
	}));
	handler.addCommand({
		name: "ping",
		run: (args, client) => {
			client.chat(new Msg("> "+client._socket.latency, "gray"));
		},
	});
	serv.commandhandler = handler;
	return handler;
};






