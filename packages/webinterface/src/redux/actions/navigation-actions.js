const VISIT_UPLOAD_FORM = "oyster/navigation/visit_upload_form";
const VISIT_DOWNLOAD_FORM = "oyster/navigation/visit_download_form";
const ERROR_PAGE = "oyster/navigation/error_page";

const ACTIONS = Object.freeze({
  // actions
  VISIT_UPLOAD_FORM,
  VISIT_DOWNLOAD_FORM,
  ERROR_PAGE,

  // actionCreators
  visitUploadFormAction: () => ({
    type: ACTIONS.VISIT_UPLOAD_FORM
  }),
  visitDownloadFormAction: () => ({
    type: ACTIONS.VISIT_DOWNLOAD_FORM
  }),
  errorPageAction: () => ({
    type: ACTIONS.ERROR_PAGE
  })
});

export default ACTIONS;
