import Encryption from "./encryption";
import Iota from "../services/iota";

const handle =
  "roofPicL22c27861d8446466f82ff649aa070f91b8e85334336b5433bfcc0849b6792ab28me6f13q";
const handleInBytes = Encryption.bytesFromHandle(handle);

const secret = "Ñ7N/ÝÕëKlÇÓ¼]oÈFg]{½:<(jE'Ù÷";
const metaData =
  '{"fileName":"ditto - Copy.png","ext":"png","numberOfChunks":3}';

test("chunk > encrypt > decrypt > chunk", done => {
  const encryptionResult = Encryption.encryptChunk(handleInBytes, secret);

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
  const encryptionResult = Encryption.encryptChunk(handleInBytes, metaData);

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
