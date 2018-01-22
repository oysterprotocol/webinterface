const UPLOAD = "oyster/file/upload";
const UPLOAD_SUCCESS = "oyster/file/upload_success";
const UPLOAD_FAILURE = "oyster/file/upload_failure";
const UPDATE_UPLOAD_PROGRESS = "oyster/file/update_upload_progress";
const MARK_UPLOAD_AS_COMPLETE = "oyster/file/mark_as_complete";

const ACTIONS = Object.freeze({
  // actions
  UPLOAD,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  UPDATE_UPLOAD_PROGRESS,
  MARK_UPLOAD_AS_COMPLETE,

  // actionCreators
  uploadAction: file => ({ type: ACTIONS.UPLOAD, payload: file }),
  uploadSuccessAction: ({ numberOfChunks, handle }) => ({
    type: ACTIONS.UPLOAD_SUCCESS,
    payload: { numberOfChunks, handle }
  }),
  uploadFailureAction: error => ({
    type: ACTIONS.UPLOAD_FAILURE,
    payload: error
  }),
  updateUploadProgress: percentage => ({
    type: ACTIONS.UPDATE_UPLOAD_PROGRESS,
    payload: percentage
  }),
  markUploadAsComplete: () => ({ type: ACTIONS.MARK_UPLOAD_AS_COMPLETE })
});

export default ACTIONS;
