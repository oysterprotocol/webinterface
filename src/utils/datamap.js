import _ from "lodash";
import iota from "services/iota";
import Encryption from "utils/encryption";

const generate = (handle, size) => {
  const keys = _.range(0, size + 1);
  const [dataMap, _hash] = _.reduce(
    keys,
    ([dataM, hash], i) => {
      const [obfuscatedHash, nextHash] = Encryption.hashChain(hash);
      dataM[i] = iota.toAddress(iota.utils.toTrytes(obfuscatedHash));

      return [dataM, nextHash];
    },
    [{}, Encryption.genesisHash(handle)]
  );

  return dataMap;
};

export default { generate };
