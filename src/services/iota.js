import IOTA from "iota.lib.js";
import _ from "lodash";
import { IOTA_API } from "../config";

const Iota = new IOTA();

const IotaA = new IOTA({
  provider: IOTA_API.PROVIDER_A
});

const IotaB = new IOTA({
  provider: IOTA_API.PROVIDER_B
});

const IotaC = new IOTA({
  provider: IOTA_API.PROVIDER_C
});

const BUNDLE_SIZE = IOTA_API.BUNDLE_SIZE;

let totalLength = 0;

let indexes = {
  startingIdx: 0,
  endingIdx: 0,
  frontIdx: 0,
  backIdx: 0,
  latestFoundFrontIdx: 0,
  latestFoundBackIdx: 0
};

const toAddress = string => string.substr(0, IOTA_API.ADDRESS_LENGTH);

const parseMessage = message => {
  const characters = message.split("");
  const notNineIndex = _.findLastIndex(characters, c => c !== "9");

  const choppedArray = characters.slice(0, notNineIndex + 1);
  const choppedMessage = choppedArray.join("");

  const evenChars =
    choppedMessage.length % 2 === 0 ? choppedMessage : choppedMessage + "9";

  return Iota.utils.fromTrytes(evenChars);
};

const queryTransactions = (iotaProvider, addresses) =>
  new Promise((resolve, reject) => {
    iotaProvider.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        const uniqTransactions = _.uniqBy(settledTransactions, "address");
        resolve(uniqTransactions);
      }
    );
  });

const skinnyQueryTransactions = (iotaProvider, addresses) =>
  new Promise((resolve, reject) => {
    iotaProvider.api.findTransactions(
      { addresses },
      (error, transactionHashes) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        resolve(transactionHashes);
      }
    );
  });

const initializePolling = addresses => {
  totalLength = addresses.length;

  indexes.startingIdx = 0;
  indexes.endingIdx = addresses.length - 1;
  indexes.latestFoundBackIdx = indexes.endingIdx;

  indexes.frontIdx =
    indexes.startingIdx + Math.floor(Math.random() * BUNDLE_SIZE);
  indexes.backIdx = indexes.endingIdx - Math.floor(Math.random() * BUNDLE_SIZE);
};

const checkUploadPercentage = addresses => {
  let backOfFile = new Promise((resolve, reject) => {
    skinnyQueryTransactions(IotaA, [addresses[indexes.backIdx]]).then(
      transactions => {
        if (transactions.length > 0) {
          indexes.latestFoundBackIdx = indexes.backIdx;
          updateBackIndex(indexes.backIdx);
        }
        resolve();
      }
    );
  });

  let frontOfFile = new Promise((resolve, reject) => {
    skinnyQueryTransactions(IotaA, [addresses[indexes.frontIdx]]).then(
      transactions => {
        if (transactions.length > 0) {
          indexes.latestFoundFrontIdx = indexes.frontIdx;
          updateFrontIndex(indexes.frontIdx);
        }
        resolve();
      }
    );
  });

  return Promise.all([frontOfFile, backOfFile]).then(() => {
    return recalculatePercentage(indexes);
  });
};

const recalculatePercentage = indexes => {
  if (indexes.latestFoundFrontIdx >= indexes.latestFoundBackIdx - 1) {
    return 100;
  }
  return (
    (indexes.latestFoundFrontIdx +
      (indexes.endingIdx - indexes.latestFoundBackIdx)) /
    (totalLength - 2) *
    100
  );
};

const updateFrontIndex = frontIndex => {
  indexes.frontIdx = frontIndex + Math.floor(Math.random() * BUNDLE_SIZE);
};

const updateBackIndex = backIndex => {
  indexes.backIdx = backIndex - Math.floor(Math.random() * BUNDLE_SIZE);
};

const findTransactions = addresses =>
  new Promise((resolve, reject) => {
    Promise.race([
      queryTransactions(IotaA, addresses),
      queryTransactions(IotaB, addresses),
      queryTransactions(IotaC, addresses)
    ]).then(transactions => {
      if (transactions.length === addresses.length) {
        resolve(transactions);
      } else {
        reject(Error("NO TRANSACTION FOUND"));
      }
    });
  });

export default {
  initializePolling,
  toAddress,
  parseMessage,
  checkUploadPercentage,
  findTransactions,
  utils: Iota.utils
};
