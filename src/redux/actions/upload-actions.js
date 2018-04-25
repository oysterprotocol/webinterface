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

  // actionCreators
  initializeUploadAction: file => ({
    type: ACTIONS.INITIALIZE_UPLOAD,
    payload: file
  }),
  beginUploadAction: ({ data, handle, fileName, numberOfChunks }) => ({
    type: ACTIONS.BEGIN_UPLOAD,
    payload: { data, handle, fileName, numberOfChunks }
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
  updateUploadProgress: ({ handle, uploadProgress }) => ({
    type: ACTIONS.UPDATE_UPLOAD_PROGRESS,
    payload: { handle, uploadProgress }
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
  })
});

export default ACTIONS;
