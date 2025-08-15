import { ServerClient } from "minecraft-protocol";
import MinecraftData from "minecraft-data";
import { config } from "../config";
import { loadChunks } from "./room";
import { registryCodec } from "../registryCodec";
const mcData = MinecraftData(config.version);

export const loginClient = (client: ServerClient) => {
    client.write("login", {
        ...mcData.loginPacket,
        dimensionCodec: registryCodec,
        enforceSecureChat: false,
        entityId: client.id,
        isHardcore: false,
        gameMode: 0,
        previousGameMode: 1,
        hashedSeed: [0, 0],
        maxPlayers: 20,
        viewDistance: 10,
        reducedDebugInfo: false,
        enableRespawnScreen: true,
        isDebug: false,
        isFlat: false
    });

    loadChunks(client);

    client.write('position', {
        x: 15,
        y: 101,
        z: 15,
        yaw: 137,
        pitch: 0,
        flags: 0x00
    })
};
