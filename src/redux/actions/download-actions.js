const INITIALIZE_DOWNLOAD = "oyster/upload/initialize_download";
const BEGIN_DOWNLOAD = "oyster/upload/begin_download";
const DOWNLOAD_SUCCESS = "oyster/upload/download_success";
const DOWNLOAD_FAILURE = "oyster/upload/download_failure";

// TODO: Remove `STREAM_` prefix once migration is done.
const STREAM_DOWNLOAD = "oyster/download/stream";
const STREAM_DOWNLOAD_PROGRESS = "oyster/download/stream-progress";
const STREAM_DOWNLOAD_SUCCESS = "oyster/upload/stream-download-success";
const STREAM_DOWNLOAD_ERROR = "oyster/upload/stream-download-error";

const ACTIONS = Object.freeze({
  // actions
  INITIALIZE_DOWNLOAD,
  BEGIN_DOWNLOAD,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_FAILURE,

  // Stream download
  STREAM_DOWNLOAD,
  STREAM_DOWNLOAD_PROGRESS,
  STREAM_DOWNLOAD_SUCCESS,
  STREAM_DOWNLOAD_ERROR,

  // actionCreators
  initializeDownloadAction: handle => ({
    type: ACTIONS.INITIALIZE_DOWNLOAD,
    payload: handle
  }),
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
  }),

  // Stream actions
  streamDownload: ({ handle }) => ({
    type: STREAM_DOWNLOAD,
    payload: { handle }
  }),
  streamDownloadProgress: ({ progress }) => ({
    type: STREAM_DOWNLOAD_PROGRESS,
    payload: progress
  }),
  streamDownloadSuccess: () => ({
    type: ACTIONS.STREAM_DOWNLOAD_SUCCESS,
    payload: {} // empty payload
  }),
  streamDownloadError: ({ err }) => ({
    type: ACTIONS.STREAM_DOWNLOAD_ERROR,
    payload: err
  })
});

export default ACTIONS;
