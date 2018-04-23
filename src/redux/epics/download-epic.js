import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";

import downloadActions from "redux/actions/download-actions";
import Iota from "services/iota";
import { generate as genDatamap } from "datamap-generator";
import Encryption from "utils/encryption";
import FileProcessor from "utils/file-processor";

const initializeDownload = (action$, store) => {
  return action$
    .ofType(downloadActions.INITIALIZE_DOWNLOAD)
    .mergeMap(action => {
      const handle = action.payload;
      const genesisHash = Encryption.genesisHash(handle);
      const [obfuscatedGenesisHash] = Encryption.hashChain(genesisHash);
      const genesisHashInTrytes = Iota.utils.toTrytes(obfuscatedGenesisHash);
      const iotaAddress = Iota.toAddress(genesisHashInTrytes);
      return Observable.fromPromise(Iota.findTransactions([iotaAddress]))
        .map(transactions => {
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
        .catch(error =>
          Observable.of(downloadActions.downloadFailureAction(error))
        );
    });
};

const beginDownload = (action$, store) => {
  return action$.ofType(downloadActions.BEGIN_DOWNLOAD).mergeMap(action => {
    const { handle, fileName, numberOfChunks } = action.payload;
    const datamapOpts = { includeTreasureOffsets: true };
    const datamap = genDatamap(handle, numberOfChunks, datamapOpts);
    const addresses = _.values(datamap);
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

        const bytesArray = orderedTransactions
          .map(tx => tx.signatureMessageFragment)
          .map(msg => FileProcessor.decryptFile(msg, handle))
          .filter(x => !!x) // Remove nulls
          .join("");

        console.log("DOWNLOADED BYTES ARRAY", bytesArray);

        const blob = new Blob([new Uint8Array(bytesArray)]);
        FileSaver.saveAs(blob, fileName);

        return downloadActions.downloadSuccessAction();
      })
      .catch(error =>
        Observable.of(downloadActions.downloadFailureAction(error))
      );
  });
};

export default combineEpics(initializeDownload, beginDownload);
