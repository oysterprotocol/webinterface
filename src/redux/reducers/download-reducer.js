import downloadActions from "redux/actions/download-actions";
import { DOWNLOAD_STATUSES } from "config";

const initState = {
  status: DOWNLOAD_STATUSES.STANDBY
};

const downloadReducer = (state = initState, action) => {
  switch (action.type) {
    case downloadActions.BEGIN_DOWNLOAD:
      return {
        ...state,
        status: DOWNLOAD_STATUSES.PENDING
      };

    case downloadActions.DOWNLOAD_SUCCESS:
      return {
        ...state,
        status: DOWNLOAD_STATUSES.RECEIVED
      };

    case downloadActions.DOWNLOAD_FAILURE:
      return {
        ...state,
        status: DOWNLOAD_STATUSES.FAILED
      };

    default:
      return state;
  }
};

export default downloadReducer;
