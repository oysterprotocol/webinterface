import _ from "lodash";
import iota from "services/iota";
import Encryption from "utils/encryption";

const generate = (size, genesisHash) => {
  const keys = _.range(1, size + 1);
  const genesisHashInTrytes = iota.utils.toTrytes(genesisHash);
  console.log(`TRYTES REPRESENTATION FOR CHUNK 0: ${genesisHashInTrytes}`);

  return _.reduce(
    keys,
    (hash, n) => {
      const previousChunkInTrytes = hash[n - 1];
      const previousEncryptedChunk = iota.utils.fromTrytes(
        previousChunkInTrytes
      );

      const encryptedHash = Encryption.encrypt(previousEncryptedChunk);
      const encryptedHashInTrytes = iota.utils.toTrytes(encryptedHash);

      console.log(
        `TRYTES REPRESENTATION FOR CHUNK ${n}: ${encryptedHashInTrytes}`
      );

      hash[n] = encryptedHashInTrytes;

      return hash;
    },
    { 0: genesisHashInTrytes }
  );
};

export default { generate };
