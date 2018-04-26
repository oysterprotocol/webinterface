import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";

import downloadActions from "redux/actions/download-actions";
import Iota from "services/iota";
import Datamap from "datamap-generator";
import Encryption from "utils/encryption";
import FileProcessor from "utils/file-processor";
import { INCLUDE_TREASURE_OFFSETS } from "../../config";

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
    const datamapOpts = { includeTreasureOffsets: INCLUDE_TREASURE_OFFSETS };
    const datamap = Datamap.generate(handle, numberOfChunks, datamapOpts);
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

        const encryptedFileContents = orderedTransactions
          .map(tx => tx.signatureMessageFragment)
          .join("");

        const bytesArray = FileProcessor.decryptFile(
          encryptedFileContents,
          handle
        );

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
