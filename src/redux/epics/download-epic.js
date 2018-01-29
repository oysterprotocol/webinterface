import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import Base64 from "base64-arraybuffer";
import FileSaver from "file-saver";

import downloadActions from "redux/actions/download-actions";
import { IOTA_API } from "config";
import Iota from "services/iota";
import Datamap from "utils/datamap";
import Encryption from "utils/encryption";

const beginDownload = (action$, store) => {
  return action$.ofType(downloadActions.BEGIN_DOWNLOAD).mergeMap(action => {
    const { handle, fileName, numberOfChunks } = action.payload;
    const datamap = Datamap.generate(handle, numberOfChunks);
    const addresses = _.values(datamap).map(trytes =>
      trytes.substr(0, IOTA_API.ADDRESS_LENGTH)
    );
    return Observable.fromPromise(Iota.findTransactions(addresses))
      .map(transactions => {
        const decryptedChunks = transactions
          .slice(1, transactions.length)
          .map(t => {
            const message = t.signatureMessageFragment;
            // IOTA responds with 2187 characters, even though fromTrytes only takes even numbers...
            const evenChars =
              message.length % 2 === 0
                ? message
                : message.substr(0, message.length - 1);
            const data = Iota.utils.fromTrytes(evenChars);
            const encodedData = Encryption.decrypt(data, handle);
            return Base64.decode(encodedData);
          });

        const arrayBuffer = _.flatten(decryptedChunks);
        const blob = new Blob(arrayBuffer);
        FileSaver.saveAs(blob, fileName);

        return downloadActions.downloadSuccessAction();
      })
      .catch(error => {
        console.log("DOWNLOAD ERROR: ", error);
        return Observable.empty();
      });
  });
};

export default combineEpics(beginDownload);
