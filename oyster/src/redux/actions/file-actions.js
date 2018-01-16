const UPLOAD = "oyster/file/upload";
const SELECT = "oyster/file/select";

const ACTIONS = Object.freeze({
  // actions
  UPLOAD,
  SELECT,

  // actionCreators
  uploadAction: () => ({ type: ACTIONS.INCREMENT }),
  selectAction: file => ({ type: ACTIONS.SELECT, payload: file })
});

export default ACTIONS;
