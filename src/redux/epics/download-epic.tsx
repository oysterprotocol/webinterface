import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import FileSaver from "file-saver";

import downloadActions from "../actions/download-actions";
import { execObsverableIfBackendAvailable } from "./utils";
import { streamDownload } from "../../services/oyster-stream";
import { alertUser } from "../../services/error-tracker";
import { API } from "../../config";

const streamDownloadEpic = action$ => {
  return action$.ofType(downloadActions.DOWNLOAD).mergeMap(action => {
    const { handle } = action.payload;
    const params = {};

    // TODO: Pass in hosts instead of hardcoding here.
    return execObsverableIfBackendAvailable([API.BROKER_NODE_A], () =>
      Observable.create(o => {
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
      })
    );
  });
};

export default combineEpics(streamDownloadEpic);
