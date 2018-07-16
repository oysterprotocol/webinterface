import Encryption from "./encryption";
import Iota from "../services/iota";
import forge from "node-forge";

const handle =
  "roofPicL22c27861d8446466f82ff649aa070f91b8e85334336b5433bfcc0849b6792ab28me6f13q";
const handleInBytes = Encryption.bytesFromHandle(handle);

const secret = "Ñ7N/ÝÕëKlÇÓ¼]oÈFg]{½:<(jE'Ù÷";
const metaData =
  '{"fileName":"ditto - Copy.png","ext":"png","numberOfChunks":3}';

test("chunk > encrypt > decrypt > chunk", done => {
  const encryptionResult = Encryption.encryptChunk(handleInBytes, 1, secret);

  const trytedResultWithStopperAndPadding =
    Iota.utils.toTrytes(encryptionResult) + "A" + "9999999999";

  const trimmed = Iota.addPaddingIfOdd(
    Iota.removeStopperTryteAndPadding(trytedResultWithStopperAndPadding)
  );

  const asBinaryString = Iota.utils.fromTrytes(trimmed);

  const decrypted = Encryption.decryptChunk(handleInBytes, asBinaryString);

  expect(decrypted).toEqual(secret);

  done();
});

test("metadata > encrypt > decrypt > metadata", done => {
  const encryptionResult = Encryption.encryptChunk(handleInBytes, 0, metaData);

  const trytedResultWithStopperAndPadding =
    Iota.utils.toTrytes(encryptionResult) + "A" + "9999999999";

  const trimmed = Iota.addPaddingIfOdd(
    Iota.removeStopperTryteAndPadding(trytedResultWithStopperAndPadding)
  );

  const asBinaryString = Iota.utils.fromTrytes(trimmed);

  const decrypted = Encryption.decryptChunk(handleInBytes, asBinaryString);

  expect(decrypted).toEqual(metaData);

  done();
});

test("hashChain", done => {
  const startingHash = "abcdef";
  let expectedHashChainHashes = [
    "abcdef",
    "995da3cf545787d65f9ced52674e92ee8171c87c7a4008aa4349ec47d21609a7",
    "4533a01d26697df306b3380e08f4fae30f488d2985e6449e9bd9bd86849ddbc6",
    "93d62b82fa8169af012ca0d3c13f6c5d94d06daf4f769ee45595a049a4805524",
    "fea47151e3dbd670f1bded7b2393093e8dde50d6ccb541f5f51689005cf88ab1",
    "c694406b4d98e3bb23416c1111099bc4c7317a81b40d53e68ce7afe4d9aa716f",
    "ab1c8e2baa271bf67fb5ba7083b06c66a2ac41db3e4d25728e80d16a3dfb746b",
    "7f907764c0d12a50daa3b38fc2fc888637640f5c91a4b81f5879da99c8e35653"
  ];
  let expectedObfuscatedHashes = [
    "dd88bb5db7314227c7e6117c693ceb83bbaf587bd1b63393d7512ba68bf42973845fa1c2924be14d37ba2da1938d7228",
    "cdfdb810ee1607917c8bacbfbf95d35dab9281abb01968c2a27349476b53aa35024fae410955327233523229677da827",
    "d5a3eda969c62842840e58fe7a1982fdcf9eb758e2ebd545289d6daa706b506a6a4833cd134992be9c73fe4c1e1d15ff",
    "40bd29065a1ade39140a0a168949eb4bbaa9bd0bd3b52b27755e104d724cf21cb5854b26ed9de5daa6d9fbf032f7952b",
    "a19d743743d8c4982ebc8c08ec0fa0a530f7b865ee83240299dd057a4800ed5e7e942191d02e12d4b65987328f15d2e3",
    "619832ffc818c2b22a47c4e43053c570695f0266e5351ce4e2313eb2cf1f0749f8a18826234bbd83a052eea8bbb201ad",
    "8ca84cd55f3991a1624fddf8147e2a7c14393f4b79a7f62775f40d3723181cee9252cdb3c7b6fb1276ad40bd7c2f7ac8",
    "b24d9a1ec8ae5897eaa67a3ee7e7c8982c03d18ea84c4b537e11f480d347e550aecef582e7883d4c29969f299836792e"
  ];
  let expectedAddresses = [
    "EHAEYFLCUFVALBLAJGNHQ9PDXCFBSHWDYFMFGCODTGTFXALEZG9CPADFDEAINAGDXDNCZEEGKEUBIHWBA",
    "PGJIVFP9VHV9G9JEPDDEJFBGBGNEVGLCIFKEUDIFNFY9WCEG9FGDSBQBZCBCHFZAB9YBLFKBI9DCWAFDX",
    "XGAFUHGFXCIGMALBXDN9GCKINDY9VDJIRGWEUFGCJHSHXGOBMAVEADHFDDZCZBYCYCRBXAPGS9SBKEAGU",
    "JB9GNAF9ICZ9FHCBT9J9J9V9BESBSHUBXFGF9GK9VGSFPALAIDMCP9WBFDVBZHAASFYDUBKAUHVEMHBHD",
    "ZEVEHDABMB9HGGQESAZFEEH9THO9YECFUADIVFTCVHWDIAB9REEHE9NDRB99UHMCRDMEFAJESGSAR9WGT",
    "PCQEWALIKGX9EGPFOAQBGGLHUABCHGDDXCNCB9UCMHZAAALHJHVAHBPFRGDAG9SBEIZEAEKAHAUB9GWDY",
    "EEFFVBXGNCCBJEZEQCYBEHEIT9RDOAPDT9CBIBUBMDEFCILAIDAIM9ABHAX9AAVHKEACPGQFJGTFHIR9J",
    "PFWBSECAKGLFGCPERHDFNDHBOHOHKGQEQAC9TGGEFFVBUBBCRDQ9AITDVGQBMHZBLFQGBIVDOHAEGBVBN"
  ];

  let currentHash = startingHash;

  for (let i = 0; i < expectedObfuscatedHashes.length; i++) {
    expect(currentHash).toEqual(expectedHashChainHashes[i]);

    let byteStr = forge.util.hexToBytes(currentHash);
    let [obfuscatedHash, nextHash] = Encryption.hashChain(byteStr);

    expect(forge.util.bytesToHex(obfuscatedHash)).toEqual(
      expectedObfuscatedHashes[i]
    );
    expect(Iota.toAddress(Iota.utils.toTrytes(obfuscatedHash))).toEqual(
      expectedAddresses[i]
    );

    currentHash = forge.util.bytesToHex(nextHash);
  }

  done();
});
