const SELECT_ALPHA_BROKER = "oyster/upload/select_alpha_broker";
const SELECT_BETA_BROKER = "oyster/upload/select_beta_broker";
const SELECT_RETENTION_YEARS = "oyster/upload/select_retention_years";

const UPLOAD = "oyster/upload/stream";
const INVOICED = "oyster/upload/stream-invoiced";
const PAYMENT_PENDING = "oyster/upload/stream-payment-pending";
const PAYMENT_CONFIRMED = "oyster/upload/stream-payment-confirmed";
const CHUNKS_DELIVERED = "oyster/upload/stream-chunks-delivered";
const UPLOAD_PROGRESS = "oyster/upload/stream-upload-progress";
const UPLOAD_SUCCESS = "oyster/upload/stream-upload-success";
const UPLOAD_ERROR = "oyster/upload/stream-upload-error";

const ACTIONS = Object.freeze({
  // actions
  SELECT_ALPHA_BROKER,
  SELECT_BETA_BROKER,
  SELECT_RETENTION_YEARS,

  UPLOAD,
  INVOICED,
  PAYMENT_PENDING,
  PAYMENT_CONFIRMED,
  CHUNKS_DELIVERED,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,

  selectAlphaBrokerAction: url => ({
    type: SELECT_ALPHA_BROKER,
    payload: url
  }),
  selectBetaBrokerAction: url => ({
    type: SELECT_BETA_BROKER,
    payload: url
  }),
  selectRetentionYears: value => ({
    type: SELECT_RETENTION_YEARS,
    payload: value
  }),

  // Stream actions
  // TODO: Use static type checker instead of destructuring to document.
  streamUpload: ({ file, retentionYears, brokers }) => ({
    type: UPLOAD,
    payload: { file, retentionYears, brokers }
  }),
  streamInvoiced: ({ cost, ethAddress }) => ({
    type: INVOICED,
    payload: { cost, ethAddress }
  }),
  streamPaymentPending: () => ({
    type: PAYMENT_PENDING
  }),
  streamPaymentConfirmed: ({ filename, handle, numberOfChunks }) => ({
    type: PAYMENT_CONFIRMED,
    payload: { filename, handle, numberOfChunks }
  }),
  streamChunksDelivered: ({ handle }) => ({
    type: CHUNKS_DELIVERED,
    payload: { handle }
  }),
  streamUploadProgress: ({ progress }) => ({
    type: UPLOAD_PROGRESS,
    payload: { progress }
  }),
  streamUploadSuccess: ({ handle }) => ({
    type: UPLOAD_SUCCESS,
    payload: { handle }
  }),
  streamUploadError: ({ handle, err }) => ({
    type: UPLOAD_ERROR,
    payload: { err }
  })
});

export default ACTIONS;
