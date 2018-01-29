const BEGIN_DOWNLOAD = "oyster/upload/begin_download";
const DOWNLOAD_SUCCESS = "oyster/upload/download_success";
const DOWNLOAD_FAILURE = "oyster/upload/download_failure";

const ACTIONS = Object.freeze({
  // actions
  BEGIN_DOWNLOAD,
  DOWNLOAD_SUCCESS,

  // actionCreators
  beginDownloadAction: ({ fileName, handle, numberOfChunks }) => ({
    type: ACTIONS.BEGIN_DOWNLOAD,
    payload: { fileName, handle, numberOfChunks }
  }),
  downloadSuccessAction: () => ({
    type: ACTIONS.DOWNLOAD_SUCCESS
  }),
  downloadFailureAction: error => ({
    type: ACTIONS.DOWNLOAD_FAILURE,
    payload: error
  })
});

export default ACTIONS;
