import IOTA from "iota.lib.js";
import { IOTA_API } from "config";

const Iota = new IOTA({
  provider: IOTA_API.PROVIDER
});

const toAddress = string => string.substr(0, IOTA_API.ADDRESS_LENGTH);

const parseMessage = message => {
  const evenChars =
    message.length % 2 === 0 ? message : message.substr(0, message.length - 1);
  return Iota.utils.fromTrytes(evenChars);
};

const checkUploadPercentage = addresses =>
  new Promise((resolve, reject) => {
    Iota.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        const percentage = settledTransactions.length / addresses.length * 100;
        resolve(percentage);
      }
    );
  });

const findTransactions = addresses =>
  new Promise((resolve, reject) => {
    Iota.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        resolve(settledTransactions);
      }
    );
  });

export default {
  toAddress,
  parseMessage,
  checkUploadPercentage,
  findTransactions,
  utils: Iota.utils
};
