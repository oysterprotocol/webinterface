import IOTA from "iota.lib.js";
import _ from "lodash";
import { IOTA_API } from "config";

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

const toAddress = string => string.substr(0, IOTA_API.ADDRESS_LENGTH);

const parseMessage = message => {
  var splitString = message.split("");
  var reverseArray = splitString.reverse();

  var notNineIndex = reverseArray.findIndex(function(element) {
    return element != 9;
  });

  reverseArray = reverseArray.slice(notNineIndex, reverseArray.length);

  var newArray = reverseArray.reverse();

  var joined = newArray.join("");

  const evenChars = joined.length % 2 === 0 ? joined : joined + "9";

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

const checkUploadPercentage = addresses =>
  new Promise((resolve, reject) => {
    queryTransactions(IotaA, addresses).then(transactions => {
      const percentage = transactions.length / addresses.length * 100;
      resolve(percentage);
    });
  });

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
        reject();
      }
    });
  });

export default {
  toAddress,
  parseMessage,
  checkUploadPercentage,
  findTransactions,
  utils: Iota.utils
};
