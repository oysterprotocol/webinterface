const UPLOAD = "oyster/file/upload";
const UPLOAD_SUCCESS = "oyster/file/upload_success";
const UPLOAD_FAILURE = "oyster/file/upload_failure";

const ACTIONS = Object.freeze({
  // actions
  UPLOAD,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,

  // actionCreators
  uploadAction: file => ({ type: ACTIONS.UPLOAD, payload: file }),
  uploadSuccessAction: () => ({ type: ACTIONS.UPLOAD_SUCCESS }),
  uploadFailureAction: error => ({
    type: ACTIONS.UPLOAD_FAILURE,
    payload: error
  })
});

export default ACTIONS;
