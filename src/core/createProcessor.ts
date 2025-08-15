import { spawn } from "node:child_process";
import { paletteBitmapPath } from "./palette";

export interface ProcessorOptions {
    input: string;
    realtime?: boolean;
    width: number;
    height: number;
};

export const getFFmpegArguments = ({
    input,
    realtime,
    width,
    height,
}: ProcessorOptions) => {
    const count = width * height;
    const splitStreams = Array(count).fill(0).map((_, i) => `[m${i}]`).join("");

    const pipeline = JSON.stringify([
        `[0:v]scale=${width * 128}:${height * 128}:flags=lanczos[scaled]`,
        `[scaled][1:v]paletteuse=dither=none[output]`,
        // count !== 1 ? `[outv]split=${count}${splitStreams}` : false,
    ].filter(x => typeof x == "string").join(";"));

    return [
        "-i", input,
        "-i", paletteBitmapPath,
        realtime && "-re",

        "-preset", "ultrafast",

        "-filter_complex", pipeline,

        "-map", "[output]",
        "-pix_fmt", "pal8",
        "-f", "rawvideo",
        "-",
    ].filter(x => typeof x == "string");
};

export const createProcessor = ({
    onFrameRendered,
    ...options
}: ProcessorOptions & {
    onFrameRendered?: (index: number, data: Buffer) => void;
}) => {
    const args = getFFmpegArguments(options);
    console.log("FFmpeg Arguments: " + args.join(" "));

    const child = spawn("ffmpeg", args, {});

    child.on("spawn", () => {
        console.log(`FFmpeg spawned (PID: ${child.pid})`);
    });

    child.on("close", (code) => {
        console.log(`FFmpeg closed with code ${code}`);
    });

    let nextFrameIndex = 0;
    const frameAmount = options.width * options.height;
    const onFrame = (frame: Buffer) => {
        onFrameRendered?.(nextFrameIndex, frame);
        console.log(`FFmpeg sent frame for #${nextFrameIndex} (${frame.length} bytes)`);
        nextFrameIndex = (nextFrameIndex + 1) % frameAmount;
    };
    
    const frameSize = 128 * 128;
    child.stdout.on("readable", () => {
        let chunk: Buffer;
        while(null !== (chunk = child.stdout.read(frameSize))) {
            onFrame(chunk);
        }
    });
};
