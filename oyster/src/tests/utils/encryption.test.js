import Encryption from "utils/encryption";

describe("parseEightCharsOfFilename", () => {
  it("when 8+ characters it returns the first 8 characters of the filename", () => {
    const result = Encryption.parseEightCharsOfFilename("123456789");
    expect(result).toEqual("12345678");
  });

  it("when <8 characters it returns the first 8 characters and underscores", () => {
    const result = Encryption.parseEightCharsOfFilename("1234");
    expect(result).toEqual("1234____");
  });
});

describe("getSalt", () => {
  it("returns a random string with 8 characters", () => {
    const result = Encryption.getSalt(8);
    expect(result.length).toEqual(8);
  });
});
