import { createServer } from "minecraft-protocol";
import { loginClient } from "./room/loginClient";
import { generatePaletteBmp } from "./core/palette";
import { config } from "./config";
import { registryCodec } from "./registryCodec";

const server = createServer({
    "online-mode": false,
    host: "0.0.0.0",
    port: 25565,
    version: config.version,
    // registryCodec: MinecraftData("1.20.2").loginPacket.dimensionCodec,
    // @ts-ignore
    registryCodec,
});

server.on("playerJoin", (client) => {
    console.log(`Incoming connection (${client.socket.remoteAddress})`);

    client.on("end", () => {
        console.log(`Connection closed (${client.socket.remoteAddress})`);
    });

    client.on("error", (e) => {
        console.error(e);
        debugger;
    });

    loginClient(client);
});

server.on("listening", () => {
    console.log("Server online");
});

server.on("error", (e) => {
    console.error(e);
    debugger;
});

console.log("Starting server...");
