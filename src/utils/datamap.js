import _ from "lodash";
import iota from "services/iota";
import Encryption from "utils/encryption";

const IOTA_ADDRESS_LENGTH = 81;

const generate = (size, handle) => {
  const keys = _.range(1, size);
  const handleInTrytes = iota.utils.toTrytes(handle);

  return _.reduce(
    keys,
    (hash, n) => {
      const encryptedHash = Encryption.getNextHash(hash[n - 1]);
      const encryptedHashInTrytes = iota.utils.toTrytes(encryptedHash);
      hash[n] = encryptedHashInTrytes.substr(0, IOTA_ADDRESS_LENGTH);

      return hash;
    },
    { 0: handleInTrytes.substr(0, IOTA_ADDRESS_LENGTH) }
  );
};

export default { generate };
