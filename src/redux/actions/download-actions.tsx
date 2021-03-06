const DOWNLOAD = "oyster/download/stream";
const DOWNLOAD_PROGRESS = "oyster/download/stream-progress";
const DOWNLOAD_SUCCESS = "oyster/upload/stream-download-success";
const DOWNLOAD_ERROR = "oyster/upload/stream-download-error";

const ACTIONS = Object.freeze({
  // Stream download
  DOWNLOAD,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_ERROR,

  // Stream actions
  streamDownload: ({ handle }) => ({
    type: ACTIONS.DOWNLOAD,
    payload: { handle }
  }),
  streamDownloadProgress: ({ progress }) => ({
    type: ACTIONS.DOWNLOAD_PROGRESS,
    payload: progress
  }),
  streamDownloadSuccess: () => ({
    type: ACTIONS.DOWNLOAD_SUCCESS,
    payload: {} // empty payload
  }),
  streamDownloadError: ({ err }) => ({
    type: ACTIONS.DOWNLOAD_ERROR,
    payload: err
  })
});

export default ACTIONS;
