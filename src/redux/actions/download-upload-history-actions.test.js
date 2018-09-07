import actions from "./download-upload-history-actions";

test("download-upload-history-action BEGIN_UPLOAD_HISTORY_DOWNLOAD", () => {
  const expected = {
    type: actions.BEGIN_UPLOAD_HISTORY_DOWNLOAD
  };
  expect(actions.beginDownloadUploadHistoryAction()).toEqual(expected);
});

test("download-upload-history-action DOWNLOAD_UPLOAD_HISTORY_SUCCESS", () => {
  const expected = {
    type: actions.DOWNLOAD_UPLOAD_HISTORY_SUCCESS
  };
  expect(actions.downloadUploadHistorySuccessAction()).toEqual(expected);
});

test("download-upload-history-action DOWNLOAD_UPLOAD_HISTORY_FAILURE", () => {
  const expected = {
    type: actions.DOWNLOAD_UPLOAD_HISTORY_FAILURE
  };
  expect(actions.downloadUploadHistoryFailureAction()).toEqual(expected);
});
