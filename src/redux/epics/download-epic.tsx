import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import FileSaver from "file-saver";

import downloadActions from "../actions/download-actions";
import { execObservableIfBackendAvailable } from "./utils";
import { streamDownload } from "../../services/oyster-stream";
import { alertUser } from "../../services/error-tracker";
import { API } from "../../config";

const streamDownloadEpic = action$ => {
  return action$.ofType(downloadActions.DOWNLOAD).mergeMap(action => {
    const { handle } = action.payload;
    const params = {};

    const downloadObservable = Observable.create(o => {
      streamDownload(handle, params, {
        metaCb: () => {}, // no-op
        progressCb: () => {}, // no-op
        doneCb: ({ metadata: { fileName }, result }) => {
          FileSaver.saveAs(result, fileName);
          o.next(downloadActions.streamDownloadSuccess());
          o.complete();
        },
        errCb: err => {
          alertUser(err);
          o.next(downloadActions.streamDownloadError({ err }));
          o.complete();
        }
      });
    });

    // TODO: Pass in hosts instead of hardcoding here.
    return execObservableIfBackendAvailable(
      [API.BROKER_NODE_A],
      () => downloadObservable,
      // TODO:  downloads can still work if the brokers are down, but we should
      // deal with the situation where the tangle is down also
      () => downloadObservable
    );
  });
};

export default combineEpics(streamDownloadEpic);
