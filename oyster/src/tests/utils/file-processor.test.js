import FileProcessor from "utils/file-processor";

describe("createHandle", () => {
  it("returns a string based on file name, primordial hash, and salt", () => {
    // jest.mock("utils/encryption", () => ({
    // parseEightCharsOfFilename: jest.fn(filename => "abc123")
    // }));
    const handle = FileProcessor.createHandle("my_file.png");
    expect(handle).toEqual("aaa");
  });
});

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
