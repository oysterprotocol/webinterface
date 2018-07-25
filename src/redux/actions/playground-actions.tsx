const TEST_UPLOAD = "oyster/playground/test_upload";
const TEST_DOWNLOAD = "oyster/playground/test_download";

const ACTIONS = Object.freeze({
  // actions
  TEST_UPLOAD,
  TEST_DOWNLOAD,

  // actionCreators
  testUploadAction: file => ({
    type: ACTIONS.TEST_UPLOAD,
    payload: file
  }),
  testDownloadAction: ({ chunksInTrytes, handle, fileName }) => ({
    type: ACTIONS.TEST_DOWNLOAD,
    payload: { chunksInTrytes, handle, fileName }
  })
});

export default ACTIONS;
