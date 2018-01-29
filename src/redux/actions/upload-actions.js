const INITIALIZE_UPLOAD = "oyster/upload/initialize_upload";
const BEGIN_UPLOAD = "oyster/upload/begin_upload";
const ADD_TO_HISTORY = "oyster/upload/add_to_history";
const UPLOAD = "oyster/upload/upload";
const UPLOAD_SUCCESS = "oyster/upload/upload_success";
const UPLOAD_FAILURE = "oyster/upload/upload_failure";
const UPDATE_UPLOAD_PROGRESS = "oyster/upload/update_upload_progress";
const MARK_UPLOAD_AS_COMPLETE = "oyster/upload/mark_upload_as_complete";

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

  // actionCreators
  initializeUploadAction: file => ({
    type: ACTIONS.INITIALIZE_UPLOAD,
    payload: file
  }),
  beginUploadAction: ({ file, handle, fileName, numberOfChunks }) => ({
    type: ACTIONS.BEGIN_UPLOAD,
    payload: { file, handle, fileName, numberOfChunks }
  }),
  addToHistoryAction: ({ numberOfChunks, fileName, handle }) => ({
    type: ACTIONS.ADD_TO_HISTORY,
    payload: { numberOfChunks, fileName, handle }
  }),
  uploadAction: ({ file, handle }) => ({
    type: ACTIONS.UPLOAD,
    payload: { file, handle }
  }),
  uploadSuccessAction: ({ numberOfChunks, handle, fileName }) => ({
    type: ACTIONS.UPLOAD_SUCCESS,
    payload: { numberOfChunks, handle, fileName }
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
  })
});

export default ACTIONS;
