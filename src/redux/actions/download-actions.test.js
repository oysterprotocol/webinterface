import actions from "./download-actions";

test("download-action DOWNLOAD", () => {
  const handle = "handle";
  const expected = {
    type: actions.DOWNLOAD,
    payload: {
      handle: handle
    }
  };
  expect(actions.streamDownload({ handle })).toEqual(expected);
});

test("download-action DOWNLOAD_PROGRESS", () => {
  const progress = 0.15;
  const expected = {
    type: actions.DOWNLOAD_PROGRESS,
    payload: progress
  };
  expect(actions.streamDownloadProgress({ progress })).toEqual(expected);
});

test("download-action DOWNLOAD_SUCCESS", () => {
  const expected = {
    type: actions.DOWNLOAD_SUCCESS,
    payload: {}
  };
  expect(actions.streamDownloadSuccess()).toEqual(expected);
});

test("download-action DOWNLOAD_SUCCESS", () => {
  const err = "err";
  const expected = {
    type: actions.DOWNLOAD_ERROR,
    payload: err
  };
  expect(actions.streamDownloadError({ err })).toEqual(expected);
});
