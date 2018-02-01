import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";

import playgroundActions from "redux/actions/playground-actions";
import downloadActions from "redux/actions/download-actions";

import { FILE } from "config";
import Iota from "services/iota";
import Datamap from "utils/datamap";
import FileProcessor from "utils/file-processor";

const testUpload = (action$, store) => {
  return action$.ofType(playgroundActions.TEST_UPLOAD).mergeMap(action => {
    const file = action.payload;

    const { numberOfChunks, handle, fileName } = FileProcessor.initializeUpload(
      file
    );

    const byteChunks = FileProcessor.createByteChunks(file.size);

    const chunkReads = byteChunks.map(
      byte =>
        new Promise((resolve, reject) => {
          const { chunkIdx, chunkStartingPoint } = byte;
          const blob = file.slice(
            chunkStartingPoint,
            chunkStartingPoint + FILE.CHUNK_BYTE_SIZE
          );
          const reader = FileProcessor.createReader(arrayBuffer => {
            const chunkInTrytes = FileProcessor.chunkToIotaFormat(
              arrayBuffer,
              handle
            );
            resolve(chunkInTrytes);
          });
          reader.readAsArrayBuffer(blob);
        })
    );

    return Observable.fromPromise(Promise.all(chunkReads))
      .map(chunksInTrytes => {
        console.log("CHUNKS IN TRYTES: ", chunksInTrytes);
        return playgroundActions.testDownloadAction({
          chunksInTrytes,
          handle,
          fileName
        });
      })
      .catch(error => {
        console.log("ERROR: ", error);
        return Observable.empty();
      });
  });
};

const testDownload = (action$, store) => {
  return action$.ofType(playgroundActions.TEST_DOWNLOAD).map(action => {
    const { chunksInTrytes, handle, fileName } = action.payload;
    const decryptedChunks = chunksInTrytes.map(trytes => {
      return FileProcessor.chunkFromIotaFormat(trytes, handle);
    });

    const arrayBuffer = _.flatten(decryptedChunks);
    const blob = new Blob(arrayBuffer);
    FileSaver.saveAs(blob, fileName);

    return downloadActions.downloadSuccessAction();
  });
};

export default combineEpics(testUpload, testDownload);
