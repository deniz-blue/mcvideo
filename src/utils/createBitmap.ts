export const createBitmap = ({
    width,
    height,
    data: _arr,
}: {
    width: number;
    height: number;
    data: number[];
}) => {
    const rowPadding = (4 - (width * 3) % 4) % 4;

    const arr = _arr;
    for (let i = 0; i < rowPadding; i++) arr.push(0);

    const data = Buffer.from(arr);
    const fileSize = 54 + data.length;
    const header = Buffer.alloc(54);
    header.write("BM");
    header.writeUInt32LE(fileSize, 2);
    header.writeUInt32LE(0, 6);
    header.writeUInt32LE(54, 10);
    header.writeUInt32LE(40, 14);
    header.writeInt32LE(width, 18);
    header.writeInt32LE(height, 22);
    header.writeUInt16LE(1, 26);
    header.writeUInt16LE(24, 28);
    header.writeUInt32LE(0, 30);
    header.writeUInt32LE(data.length, 34);
    header.writeInt32LE(2835, 38);
    header.writeInt32LE(2835, 42);
    header.writeUInt32LE(0, 46);
    header.writeUInt32LE(0, 50);

    const bmp = Buffer.concat([header, data]);

    return bmp;
};
