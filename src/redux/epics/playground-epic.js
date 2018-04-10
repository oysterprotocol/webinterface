import {Observable} from "rxjs";
import {combineEpics} from "redux-observable";
import FileSaver from "file-saver";

import playgroundActions from "redux/actions/playground-actions";
import downloadActions from "redux/actions/download-actions";

import {FILE, IOTA_API} from "config";
import FileProcessor from "utils/file-processor";

const testUpload = (action$, store) => {
    return action$.ofType(playgroundActions.TEST_UPLOAD).mergeMap(action => {
        const file = action.payload;
        return Observable.fromPromise(FileProcessor.initializeUpload(file))
            .map(({numberOfChunks, handle, fileName, data}) => {
                const byteChunks = FileProcessor.createByteChunks(data.length);
                const chunksInTrytes = byteChunks
                    .filter(b => b.type === FILE.CHUNK_TYPES.FILE_CONTENTS)
                    .map(byte => {
                        const {startingPoint} = byte;
                        return data.slice(
                            startingPoint,
                            startingPoint + IOTA_API.MESSAGE_LENGTH
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
        const {chunksInTrytes, handle, fileName} = action.payload;
        const encryptedFileContents = chunksInTrytes.join("");

        const bytesArray = FileProcessor.decryptFile(
            encryptedFileContents,
            handle
        );

        console.log("DOWNLOADED BYTES ARRAY", bytesArray);

        const blob = new Blob([new Uint8Array(bytesArray)]);
        FileSaver.saveAs(blob, fileName);

        return downloadActions.downloadSuccessAction();
    });
};

export default combineEpics(testUpload, testDownload);
