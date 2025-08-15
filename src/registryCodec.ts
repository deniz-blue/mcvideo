export let registryCodec = {};

const reg = (id: string, entries: any[]) => {
    registryCodec[id] = {
        id,
        entries,
    };
}

reg("minecraft:dimension_type", [
    {
        key: "minecraft:overworld",
        value: {
            "type": "compound",
            "value": {
                "piglin_safe": {
                    "type": "byte",
                    "value": 0
                },
                "natural": {
                    "type": "byte",
                    "value": 1
                },
                "ambient_light": {
                    "type": "float",
                    "value": 0
                },
                "monster_spawn_block_light_limit": {
                    "type": "int",
                    "value": 0
                },
                "infiniburn": {
                    "type": "string",
                    "value": "#minecraft:infiniburn_overworld"
                },
                "respawn_anchor_works": {
                    "type": "byte",
                    "value": 0
                },
                "has_skylight": {
                    "type": "byte",
                    "value": 1
                },
                "bed_works": {
                    "type": "byte",
                    "value": 1
                },
                "effects": {
                    "type": "string",
                    "value": "minecraft:overworld"
                },
                "has_raids": {
                    "type": "byte",
                    "value": 1
                },
                "logical_height": {
                    "type": "int",
                    "value": 384
                },
                "coordinate_scale": {
                    "type": "double",
                    "value": 1
                },
                "monster_spawn_light_level": {
                    "type": "compound",
                    "value": {
                        "min_inclusive": {
                            "type": "int",
                            "value": 0
                        },
                        "max_inclusive": {
                            "type": "int",
                            "value": 7
                        },
                        "type": {
                            "type": "string",
                            "value": "minecraft:uniform"
                        }
                    }
                },
                "min_y": {
                    "type": "int",
                    "value": -64
                },
                "ultrawarm": {
                    "type": "byte",
                    "value": 0
                },
                "has_ceiling": {
                    "type": "byte",
                    "value": 0
                },
                "height": {
                    "type": "int",
                    "value": 384
                }
            }
        }
    },
])

const entity_variant = (key: string, asset_id: string) => ({
    key,
    value: {
        "asset_id": { type: "string", value: asset_id },
        "spawn_conditions": {
            type: "array",
            value: [
                {
                    type: "compound",
                    value: {
                        "priority": {
                            type: "byte",
                            value: 0,
                        }
                    },
                }
            ],
        },
    }
});

reg("minecraft:cat_variant", [
    entity_variant("minecraft:siamese", "minecraft:entity/cat/siamese"),
])

reg("minecraft:chicken_variant", [
    entity_variant("minecraft:temperate_chicken", "minecraft:entity/chicken/temperate_chicken"),
])

reg("minecraft:cow_variant", [
    entity_variant("minecraft:temperate_cow", "minecraft:entity/cow/temperate_cow"),
])

reg("minecraft:frog_variant", [
    entity_variant("minecraft:temperate_frog", "minecraft:entity/frog/temperate_frog"),
])

reg("minecraft:painting_variant", [
    {
        key: "minecraft:bomb",
        value: {
            "asset_id": { type: "string", value: "minecraft:bomb" },
            "author": {
                type: "compound",
                value: {
                    color: { type: "string", value: "gray" },
                    translate: { type: "string", value: "painting.minecraft.bomb.author" },
                },
            },
            width: { type: "byte", value: 1 },
            height: { type: "byte", value: 1 },
            "title": {
                type: "compound",
                value: {
                    color: { type: "string", value: "yellow" },
                    translate: { type: "string", value: "painting.minecraft.bomb.title" },
                },
            },
        },
    }
])

reg("minecraft:pig_variant", [
    entity_variant("minecraft:temperate_pig", "minecraft:entity/pig/temperate_pig"),
])

reg("minecraft:wolf_sound_variant", [
    {
        key: "minecraft:cute",
        value: Object.fromEntries(["ambient", "death", "growl", "hurt", "pant", "whine"].map((x) => [
            `${x}_sound`,
            { type: "string", value: `minecraft:entity.wolf_cute.${x}` },
        ])),
    }
])

reg("minecraft:wolf_variant", [
    {
        key: "minecraft:snowy",
        value: {
            assets: {
                type: "compound",
                value: {
                    "angry": { type: "string", value: "minecraft:entity/wolf/wolf_snowy_angry" },
                    "tame": { type: "string", value: "minecraft:entity/wolf/wolf_snowy_tame" },
                    "wild": { type: "string", value: "minecraft:entity/wolf/wolf_snowy" },
                },
            },
            "spawn_conditions": {
                type: "array",
                value: [
                    {
                        type: "compound",
                        value: {
                            "priority": {
                                type: "byte",
                                value: 0,
                            }
                        },
                    }
                ],
            }
        }
    }
])


const makeProxy = <T>(prefix: string, target: T): T => {
    return new Proxy(target as object, {
        get: (o, p, r) => {
            let v = Reflect.get(o, p, r);
            let accessor = (typeof p == "string" ? p : p.description || "$symbol");
            console.log(`GET ${prefix}.${accessor} :: `, v);
            if (typeof v == "object") {
                let pfx = prefix + "." + accessor;
                return makeProxy(pfx, v);
            } else {
                return v;
            }
        },
    }) as T;
};

registryCodec = makeProxy("", registryCodec)

console.log(registryCodec)
