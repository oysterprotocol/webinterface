import nock from "nock";
jest.mock("utils/encryption", () => ({
  parseEightCharsOfFilename: jest.fn(() => "12345678"),
  getSalt: jest.fn(() => "salty_salt"),
  getPrimordialHash: jest.fn(() => "hashy_hash"),
  encrypt: jest.fn(() => "encrypted_data")
}));

import FileProcessor from "utils/file-processor";
import { API } from "config";

describe("createHandle", () => {
  it("returns a string based on file name, primordial hash, and salt", () => {
    const handle = FileProcessor.createHandle("my_file.png");
    expect(handle).toEqual("12345678hashy_hashsalty_salt");
  });
});

describe("createByteChunks", () => {
  it("loads returns an array of objects with chunkIdx and chunkStartingPoint", () => {
    const file = { size: 3000 };
    const byteChunks = FileProcessor.createByteChunks(file);
    const expectedResult = [
      { chunkIdx: 1, chunkStartingPoint: 0 },
      { chunkIdx: 2, chunkStartingPoint: 1001 },
      { chunkIdx: 3, chunkStartingPoint: 2002 }
    ];
    expect(byteChunks).toEqual(expectedResult);
  });
});

describe("createUploadSession", () => {
  beforeEach(() => {
    // TODO: figure out how to mock request with certain params
    nock(API.HOST)
      .post(API.V1_UPLOAD_SESSIONS_PATH)
      .reply(201, {
        ok: true
      });
  });

  it("makes a POST request to /api/v1/upload-sessions", async () => {
    const file = { size: 90, name: "secretFile.png" };
    const response = await FileProcessor.createUploadSession(file);
    expect(response).toEqual({ ok: true });
  });
});

describe("sendChunkToBroker", () => {
  beforeEach(() => {
    // TODO: figure out how to mock request with certain params
    nock(API.HOST)
      .post(API.V1_UPLOAD_CHUNKS_PATH)
      .reply(201, {
        ok: true
      });
  });

  it("makes a POST request to /api/v1/upload-chunks", async () => {
    const response = await FileProcessor.sendChunkToBroker(
      1,
      "not_encrypted",
      "handle"
    );
    expect(response).toEqual({ ok: true });
  });
});
