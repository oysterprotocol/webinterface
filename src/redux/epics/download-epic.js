import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";
import forge from "node-forge";

import downloadActions from "redux/actions/download-actions";
import Iota from "services/iota";
import Datamap from "datamap-generator";
import Encryption from "utils/encryption";
import FileProcessor from "utils/file-processor";
import { INCLUDE_TREASURE_OFFSETS, MAX_ADDRESSES } from "../../config";

const initializeDownload = (action$, store) => {
  return action$
    .ofType(downloadActions.INITIALIZE_DOWNLOAD)
    .mergeMap(action => {
      const handle = action.payload;
      const genesisHash = Datamap.genesisHash(handle);
      const obfuscatedGenesisHash = Encryption.obfuscatedGenesisHash(
        genesisHash
      );
      const genesisHashInTrytes = Iota.utils.toTrytes(
        forge.util.hexToBytes(obfuscatedGenesisHash)
      );
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
    const genHash = Datamap.genesisHash(handle);
    const datamap = Datamap.generate(genHash, numberOfChunks, datamapOpts);
    const addresses = _.values(datamap);
    const nonMetaDataAddresses = addresses.slice(1, addresses.length);

    const addressBatches = _.chunk(nonMetaDataAddresses, MAX_ADDRESSES);

    return Observable.fromPromise(
      Promise.all(
        addressBatches.map(addresses => {
          return new Promise((resolve, reject) =>
            Iota.findTransactionObjects(addresses)
              .then(transactions => {
                const addrToIdx = _.reduce(
                  nonMetaDataAddresses,
                  (acc, addr, idx) => {
                    acc[addr] = idx;
                    return acc;
                  },
                  {}
                );
                resolve(
                  transactions.map(tx => ({
                    idx: addrToIdx[tx.address],
                    data: tx.signatureMessageFragment
                  }))
                );
              })
              .catch(error => reject(error))
          );
        })
      )
    ).mergeMap(chunkArrays => {
      const chunks = [].concat(...chunkArrays);
      return Observable.fromPromise(
        FileProcessor.chunksToFile(chunks, handle)
      ).map(blob => {
        FileSaver.saveAs(blob, fileName);
        return downloadActions.downloadSuccessAction();
      });
    });
  });
};

export default combineEpics(initializeDownload, beginDownload);
