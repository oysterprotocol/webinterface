jest.mock("crypto-js", () => ({
  SHA256: jest.fn(() => "mocked_sha256_string"),
  AES: {
    encrypt: jest.fn(() => "mocked_encrypted_message"),
    decrypt: jest.fn(() => "mocked_decrypted_message")
  }
}));
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

describe("getPrimordialHash", () => {
  it("returns a random string generated from a sha256 hash", () => {
    const result = Encryption.getPrimordialHash("abc123");
    expect(result).toEqual("mocked_sha256_string");
  });
});

describe("encrypt", () => {
  it("encrypts the message using the secret key", () => {
    const result = Encryption.encrypt("secret_message", "abc123");
    expect(result).toEqual("mocked_encrypted_message");
  });
});

describe("decrypt", () => {
  it("decrypts the message using the secret key", () => {
    const result = Encryption.decrypt("enCrypted_messAge", "abc123");
    expect(result).toEqual("mocked_decrypted_message");
  });
});
