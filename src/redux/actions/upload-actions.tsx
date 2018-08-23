const SELECT_ALPHA_BROKER = "oyster/upload/select_alpha_broker";
const SELECT_BETA_BROKER = "oyster/upload/select_beta_broker";
const SELECT_RETENTION_YEARS = "oyster/upload/select_retention_years";

// TODO: Remove `STREAM_` prefix once migration is done.
const STREAM_UPLOAD = "oyster/upload/stream";
const STREAM_INVOICED = "oyster/upload/stream-invoiced";
const STREAM_PAYMENT_PENDING = "oyster/upload/stream-payment-pending";
const STREAM_PAYMENT_CONFIRMED = "oyster/upload/stream-payment-confirmed";
const STREAM_CHUNKS_DELIVERED = "oyster/upload/stream-chunks-delivered";
const STREAM_UPLOAD_PROGRESS = "oyster/upload/stream-upload-progress";
const STREAM_UPLOAD_SUCCESS = "oyster/upload/stream-upload-success";
const STREAM_UPLOAD_ERROR = "oyster/upload/stream-upload-error";

const ACTIONS = Object.freeze({
  // actions
  SELECT_ALPHA_BROKER,
  SELECT_BETA_BROKER,
  SELECT_RETENTION_YEARS,

  STREAM_UPLOAD,
  STREAM_INVOICED,
  STREAM_PAYMENT_PENDING,
  STREAM_PAYMENT_CONFIRMED,
  STREAM_CHUNKS_DELIVERED,
  STREAM_UPLOAD_PROGRESS,
  STREAM_UPLOAD_SUCCESS,
  STREAM_UPLOAD_ERROR,

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
  streamPaymentPending: () => ({
    type: ACTIONS.STREAM_PAYMENT_PENDING
  }),
  streamPaymentConfirmed: ({ filename, handle, numberOfChunks }) => ({
    type: ACTIONS.STREAM_PAYMENT_CONFIRMED,
    payload: { filename, handle, numberOfChunks }
  }),
  streamChunksDelivered: ({handle}) => ({
    type: ACTIONS.STREAM_CHUNKS_DELIVERED,
      payload: { handle }
  }),
  streamUploadProgress: ({ progress }) => ({
    type: ACTIONS.STREAM_UPLOAD_PROGRESS,
    payload: { progress }
  }),
  streamUploadSuccess: ({ handle }) => ({
    type: ACTIONS.STREAM_UPLOAD_SUCCESS,
    payload: { handle }
  }),
  streamUploadError: ({ handle, err }) => ({
    type: ACTIONS.STREAM_UPLOAD_ERROR,
    payload: { err }
  })
});

export default ACTIONS;
