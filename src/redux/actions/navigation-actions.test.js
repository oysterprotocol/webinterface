import actions from "./navigation-actions";

test("download-upload-history-action VISIT_UPLOAD_FORM", () => {
  const expected = {
    type: actions.VISIT_UPLOAD_FORM
  };
  expect(actions.visitUploadFormAction()).toEqual(expected);
});

test("download-upload-history-action VISIT_DOWNLOAD_FORM", () => {
  const expected = {
    type: actions.VISIT_DOWNLOAD_FORM
  };
  expect(actions.visitDownloadFormAction()).toEqual(expected);
});

test("download-upload-history-action ERROR_PAGE", () => {
  const expected = {
    type: actions.ERROR_PAGE
  };
  expect(actions.errorPageAction()).toEqual(expected);
});

test("download-upload-history-action BROKERS_DOWN", () => {
  const expected = {
    type: actions.BROKERS_DOWN
  };
  expect(actions.brokersDownPageAction()).toEqual(expected);
});
