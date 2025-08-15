import { ServerClient } from "minecraft-protocol";
import PrismarineChunk, { PCChunk } from "prismarine-chunk";
import { config } from "../config";
import { Vec3 } from "vec3";
import MinecraftData from "minecraft-data";
const Chunk = PrismarineChunk(config.version) as typeof PCChunk;

const chunk = new Chunk({});

for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 16; z++) {
        chunk.setBlockType(new Vec3(x, 100, z), MinecraftData(config.version).blocksByName.grass_block.id)

        for (let y = 0; y < 256; y++) {
            chunk.setSkyLight(new Vec3(x, y, z), 15)
        }
    }
}

export const loadChunks = (client: ServerClient) => {
    client.write("map_chunk", {
        x: 0,
        z: 0,
        heightmaps: [],
        chunkData: chunk.dump(),
        blockEntities: [],
        skyLightMask: [],
        blockLightMask: [],
        emptySkyLightMask: [],
        emptyBlockLightMask: [],
        skyLight: [],
        blockLight: [],
    });
};
