const INITIALIZE_UPLOAD = "oyster/upload/initialize_upload";
const BEGIN_UPLOAD = "oyster/upload/begin_upload";
const ADD_TO_HISTORY = "oyster/upload/add_to_history";
const UPLOAD = "oyster/upload/upload";
const UPLOAD_SUCCESS = "oyster/upload/upload_success";
const UPLOAD_FAILURE = "oyster/upload/upload_failure";
const UPDATE_UPLOAD_PROGRESS = "oyster/upload/update_upload_progress";
const MARK_UPLOAD_AS_COMPLETE = "oyster/upload/mark_upload_as_complete";
const REFRESH_INCOMPLETE_UPLOADS = "oyster/upload/refresh_incomplete_uploads";
const POLL_UPLOAD_PROGRESS = "oyster/upload/poll_upload_progress";
const SELECT_ALPHA_BROKER = "oyster/upload/select_alpha_broker";
const SELECT_BETA_BROKER = "oyster/upload/select_beta_broker";
const SELECT_RETENTION_YEARS = "oyster/upload/select_retention_years";
const INITIALIZE_POLLING_INDEXES = "oyster/upload/initialize_polling_indexes";
const INITIALIZE_SESSION = "oyster/upload/initialize_session";
const POLL_PAYMENT_STATUS = "oyster/upload/poll_payment_status";
const PAYMENT_PENDING = "oyster/upload/payment_pending";
const GAS_PRICE = "oyster/upload/gas_price";

// TODO: Remove `STREAM_` prefix once migration is done.
const STREAM_UPLOAD = "oyster/upload/stream";
const STREAM_INVOICED = "oyster/upload/stream-invoiced";
const STREAM_PAYMENT_CONFIRMED = "oyster/upload/stream-payment-confirmed";
const STREAM_UPLOAD_PROGRESS = "oyster/upload/stream-upload-progress";
const STREAM_UPLOAD_SUCCESS = "oyster/upload/stream-upload-success";
const STREAM_UPLOAD_ERROR = "oyster/upload/stream-upload-error";

const ACTIONS = Object.freeze({
  // actions
  INITIALIZE_UPLOAD,
  BEGIN_UPLOAD,
  ADD_TO_HISTORY,
  UPLOAD,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  UPDATE_UPLOAD_PROGRESS,
  MARK_UPLOAD_AS_COMPLETE,
  REFRESH_INCOMPLETE_UPLOADS,
  POLL_UPLOAD_PROGRESS,
  SELECT_ALPHA_BROKER,
  SELECT_BETA_BROKER,
  SELECT_RETENTION_YEARS,
  INITIALIZE_POLLING_INDEXES,
  INITIALIZE_SESSION,
  POLL_PAYMENT_STATUS,
  PAYMENT_PENDING,
  GAS_PRICE,

  STREAM_UPLOAD,
  STREAM_INVOICED,
  STREAM_PAYMENT_CONFIRMED,
  STREAM_UPLOAD_PROGRESS,
  STREAM_UPLOAD_SUCCESS,
  STREAM_UPLOAD_ERROR,

  // actionCreators
  initializeUploadAction: ({ file, retentionYears }) => ({
    type: ACTIONS.INITIALIZE_UPLOAD,
    payload: { file, retentionYears }
  }),
  initializeSession: ({
    chunks,
    handle,
    fileName,
    numberOfChunks,
    retentionYears
  }) => ({
    type: ACTIONS.INITIALIZE_SESSION,
    payload: { chunks, handle, fileName, numberOfChunks, retentionYears }
  }),
  pollPaymentStatus: ({
    host,
    alphaSessionId,
    chunks,
    fileName,
    handle,
    numberOfChunks,
    betaSessionId,
    genesisHash,
    invoice
  }) => ({
    type: ACTIONS.POLL_PAYMENT_STATUS,
    payload: {
      host,
      alphaSessionId,
      chunks,
      fileName,
      handle,
      numberOfChunks,
      betaSessionId,
      genesisHash,
      invoice
    }
  }),
  paymentPending: () => ({
    type: ACTIONS.PAYMENT_PENDING
  }),
  gasPrice: price => ({
    type: ACTIONS.GAS_PRICE,
    payload: { price }
  }),
  beginUploadAction: ({
    chunks,
    fileName,
    handle,
    numberOfChunks,
    alphaSessionId,
    betaSessionId,
    genesisHash,
    invoice,
    host
  }) => ({
    type: ACTIONS.BEGIN_UPLOAD,
    payload: {
      chunks,
      fileName,
      handle,
      numberOfChunks,
      alphaSessionId,
      betaSessionId,
      genesisHash,
      invoice,
      host
    }
  }),
  addToHistoryAction: ({ numberOfChunks, fileName, handle }) => ({
    type: ACTIONS.ADD_TO_HISTORY,
    payload: { numberOfChunks, fileName, handle }
  }),
  uploadAction: ({ file, handle }) => ({
    type: ACTIONS.UPLOAD,
    payload: { file, handle }
  }),
  uploadSuccessAction: handle => ({
    type: ACTIONS.UPLOAD_SUCCESS,
    payload: handle
  }),
  uploadFailureAction: handle => ({
    type: ACTIONS.UPLOAD_FAILURE,
    payload: handle
  }),
  updateUploadProgress: ({ handle, uploadProgress, indexes }) => ({
    type: ACTIONS.UPDATE_UPLOAD_PROGRESS,
    payload: { handle, uploadProgress, indexes }
  }),
  markUploadAsComplete: handle => ({
    type: ACTIONS.MARK_UPLOAD_AS_COMPLETE,
    payload: handle
  }),
  refreshIncompleteUploads: () => ({
    type: ACTIONS.REFRESH_INCOMPLETE_UPLOADS
  }),
  pollUploadProgress: ({ handle, numberOfChunks }) => ({
    type: ACTIONS.POLL_UPLOAD_PROGRESS,
    payload: { handle, numberOfChunks }
  }),
  selectAlphaBrokerAction: url => ({
    type: ACTIONS.SELECT_ALPHA_BROKER,
    payload: url
  }),
  selectBetaBrokerAction: url => ({
    type: ACTIONS.SELECT_BETA_BROKER,
    payload: url
  }),
  selectRetentionYears: value => ({
    type: ACTIONS.SELECT_RETENTION_YEARS,
    payload: value
  }),
  initializePollingIndexes: ({ indexes, dataMapLength }) => ({
    type: ACTIONS.INITIALIZE_POLLING_INDEXES,
    payload: { indexes, dataMapLength }
  }),

  // Stream actions
  // TODO: Use static type checker instead of destructuring to document.
  streamUpload: ({ file, retentionYears, brokers }) => ({
    type: ACTIONS.STREAM_UPLOAD,
    payload: { file, retentionYears, brokers }
  }),
  streamInvoiced: ({ cost, ethAddress }) => ({
    type: ACTIONS.STREAM_INVOICED,
    payload: { cost, ethAddress }
  }),
  streamPaymentConfirmed: ({}) => ({
    type: ACTIONS.STREAM_PAYMENT_CONFIRMED,
    payload: {} // Empty payload
  }),
  streamUploadProgress: ({ progress }) => ({
    type: ACTIONS.STREAM_UPLOAD_PROGRESS,
    payload: { progress }
  }),
  streamUploadSuccess: ({}) => ({
    type: ACTIONS.STREAM_UPLOAD_SUCCESS,
    payload: {} // empty payload
  }),
  streamUploadError: ({ err }) => ({
    type: ACTIONS.STREAM_UPLOAD_ERROR,
    payload: { err }
  })
});

export default ACTIONS;
