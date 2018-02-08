import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";

import { IOTA_API } from "config";
import downloadActions from "redux/actions/download-actions";
import Iota from "services/iota";
import Datamap from "utils/datamap";
import Encryption from "utils/encryption";
import FileProcessor from "utils/file-processor";

const initializeDownload = (action$, store) => {
  return action$
    .ofType(downloadActions.INITIALIZE_DOWNLOAD)
    .mergeMap(action => {
      const handle = action.payload;
      const genesisHash = Encryption.sha256(handle);
      const genesisHashInTrytes = Iota.utils.toTrytes(genesisHash);
      const iotaAddress = Iota.toAddress(genesisHashInTrytes);
      return Observable.fromPromise(Iota.findTransactions([iotaAddress]))
        .map(transactions => {
          if (!transactions.length) {
            throw Error("NO TRANSACTION FOUND");
          }

          const t = transactions[0];
          const {
            numberOfChunks,
            fileName
          } = FileProcessor.metaDataFromIotaFormat(
            t.signatureMessageFragment,
            handle
          );

          return downloadActions.beginDownloadAction({
            handle,
            numberOfChunks,
            fileName
          });
        })
        .catch(error => {
          console.log("DOWNLOAD ERROR: ", error);
          return Observable.empty();
        });
    });
};

const beginDownload = (action$, store) => {
  return action$.ofType(downloadActions.BEGIN_DOWNLOAD).mergeMap(action => {
    const { handle, fileName, numberOfChunks } = action.payload;
    const datamap = Datamap.generate(handle, numberOfChunks);
    const addresses = _.values(datamap).map(trytes =>
      trytes.substr(0, IOTA_API.ADDRESS_LENGTH)
    );
    const nonMetaDataAddresses = addresses.slice(1, addresses.length);

    return Observable.fromPromise(Iota.findTransactions(nonMetaDataAddresses))
      .map(transactions => {
        const addrToIdx = _.reduce(
          nonMetaDataAddresses,
          (acc, addr, idx) => {
            acc[addr] = idx;
            return acc;
          },
          {}
        );
        const orderedTransactions = _.sortBy(
          transactions,
          tx => addrToIdx[tx.address]
        );
        const chunksArrayBuffers = orderedTransactions.map(tx => {
          return FileProcessor.chunkFromIotaFormat(
            tx.signatureMessageFragment,
            handle
          );
        });

        const completeFileArrayBuffer = FileProcessor.mergeArrayBuffers(
          chunksArrayBuffers
        );
        console.log("DOWNLOADED ARRAY BUFFER");

        const blob = new Blob([new Uint8Array(completeFileArrayBuffer)]);
        FileSaver.saveAs(blob, fileName);

        return downloadActions.downloadSuccessAction();
      })
      .catch(error => {
        console.log("DOWNLOAD ERROR: ", error);
        return Observable.empty();
      });
  });
};

export default combineEpics(initializeDownload, beginDownload);
