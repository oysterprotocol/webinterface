import _ from "lodash";
import iota from "services/iota";
import Encryption from "utils/encryption";

const generate = (handle, size) => {
  const keys = _.range(1, size + 1);

  const [dataMap, _] = _.reduce(
    keys,
    ([dataM, hash], i) => {
      const [obfuscatedHash, nextHash] = Encryption.hashChain(hash);
      dataM[i] = iota.utils.toTrytes(obfuscatedHash);

      return [dataM, nextHash];
    },
    [{}, handle]
  );

  return dataMap;
};

export default { generate };
