import FileProcessor from "utils/file-processor";

describe("createByteChunks", () => {
  it("loads returns an array of objects with chunkIdx and chunkStartingPoint", () => {
    const file = { size: 90 };
    const byteChunks = FileProcessor.createByteChunks(file);
    const expectedResult = [
      { chunkIdx: 0, chunkStartingPoint: 0 },
      { chunkIdx: 1, chunkStartingPoint: 31 },
      { chunkIdx: 2, chunkStartingPoint: 62 }
    ];
    expect(byteChunks).toEqual(expectedResult);
  });
});
