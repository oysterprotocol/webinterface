const VISIT_UPLOAD_FORM = "oyster/navigation/visit_upload_form";
const VISIT_DOWNLOAD_FORM = "oyster/navigation/visit_download_form";

const ACTIONS = Object.freeze({
  // actions
  VISIT_UPLOAD_FORM,
  VISIT_DOWNLOAD_FORM,

  // actionCreators
  visitUploadFormAction: () => ({
    type: ACTIONS.VISIT_UPLOAD_FORM
  }),
  visitDownloadFormAction: () => ({
    type: ACTIONS.VISIT_DOWNLOAD_FORM
  })
});

export default ACTIONS;
