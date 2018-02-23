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
    return Observable.fromPromise(FileProcessor.initializeUpload(file))
      .map(({ numberOfChunks, handle, fileName, data }) => {
        const byteChunks = FileProcessor.createByteChunks(data.length);
        const chunksInTrytes = byteChunks
          .filter(b => b.type === FILE.CHUNK_TYPES.FILE_CONTENTS)
          .map(byte => {
            const { startingPoint } = byte;
            return data.slice(
              startingPoint,
              startingPoint + FILE.CHUNK_BYTE_SIZE
            );
          });
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
    const encryptedFileContents = chunksInTrytes.join("");

    const decryptedFileArrayBuffer = FileProcessor.decryptFile(
      encryptedFileContents,
      handle
    );

    console.log("DOWNLOADED ARRAY BUFFER", decryptedFileArrayBuffer);

    const blob = new Blob([new Uint8Array(decryptedFileArrayBuffer)]);
    FileSaver.saveAs(blob, fileName);

    return downloadActions.downloadSuccessAction();
  });
};

export default combineEpics(testUpload, testDownload);
