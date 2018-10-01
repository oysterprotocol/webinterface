import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toArray";

import downloadUploadHistoryActions from "../actions/download-upload-history-actions";
import downloadUploadHistoryEpic from "./download-upload-history-epic";

import { ActionsObservable } from "redux-observable";
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([]);

test("downloadUploadHistoryEpic beginDownloadUploadHistory", () => {
  const state = {
    upload: {
      history: [
        "ahoj", "jooo"
      ]
    }
  };
  const store = mockStore(state);
  const action = ActionsObservable.of(
    { type: downloadUploadHistoryActions.BEGIN_UPLOAD_HISTORY_DOWNLOAD }
  );
  downloadUploadHistoryEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual([downloadUploadHistoryActions.downloadUploadHistorySuccessAction()]);
    });
});
