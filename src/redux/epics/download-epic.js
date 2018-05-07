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
      return Observable.fromPromise(Iota.findTransactionObjects([iotaAddress]))
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

    return Observable.fromPromise(
      Iota.findTransactionObjects(nonMetaDataAddresses)
    )
      .map(transactions => {
        const addrToIdx = _.reduce(
          nonMetaDataAddresses,
          (acc, addr, idx) => {
            acc[addr] = idx;
            return acc;
          },
          {}
        );

        const chunks = transactions.map(tx => ({
          idx: addrToIdx[tx.address],
          data: tx.signatureMessageFragment
        }));

        FileProcessor.chunksToFile(chunks, handle).then(blob => {
          // had to move this in here, so the promise would be resolved
          FileSaver.saveAs(blob, fileName);
        });

        // need to call this only after FileSave.saveAs has happened but putting it
        // inside the .then() block caused an error
        return downloadActions.downloadSuccessAction();
      })
      .catch(error =>
        Observable.of(downloadActions.downloadFailureAction(error))
      );
  });
};

export default combineEpics(initializeDownload, beginDownload);
