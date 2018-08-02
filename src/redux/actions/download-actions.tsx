// TODO: Remove `STREAM_` prefix once migration is done.
const STREAM_DOWNLOAD = "oyster/download/stream";
const STREAM_DOWNLOAD_PROGRESS = "oyster/download/stream-progress";
const STREAM_DOWNLOAD_SUCCESS = "oyster/upload/stream-download-success";
const STREAM_DOWNLOAD_ERROR = "oyster/upload/stream-download-error";

const ACTIONS = Object.freeze({

  // Stream download
  STREAM_DOWNLOAD,
  STREAM_DOWNLOAD_PROGRESS,
  STREAM_DOWNLOAD_SUCCESS,
  STREAM_DOWNLOAD_ERROR,


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
