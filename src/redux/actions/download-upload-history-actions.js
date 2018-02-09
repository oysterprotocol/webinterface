const BEGIN_UPLOAD_HISTORY_DOWNLOAD = "oyster/upload_history/begin_download";
const DOWNLOAD_UPLOAD_HISTORY_SUCCESS = "oyster/upload_history/download_success";
const DOWNLOAD_UPLOAD_HISTORY_FAILURE = "oyster/upload_history/download_failure";

const ACTIONS = Object.freeze({
  // actions
  BEGIN_UPLOAD_HISTORY_DOWNLOAD,
  DOWNLOAD_UPLOAD_HISTORY_SUCCESS,
  DOWNLOAD_UPLOAD_HISTORY_FAILURE,

  // actionCreators
  beginDownloadUploadHistoryAction: () => ({
    type: ACTIONS.BEGIN_UPLOAD_HISTORY_DOWNLOAD
  }),

  downloadUploadHistorySuccessAction: () => ({
    type: ACTIONS.DOWNLOAD_UPLOAD_HISTORY_SUCCESS
  }),

  downloadUploadHistoryFailureAction: () => ({
    type: ACTIONS.DOWNLOAD_UPLOAD_HISTORY_FAILURE
  })
});

export default ACTIONS;
