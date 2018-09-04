import downloadActions from "../actions/download-actions";
import { DOWNLOAD_STATUSES } from "../../config";

const initState = { status: DOWNLOAD_STATUSES.STANDBY };

const downloadReducer = (state = initState, action) => {
  switch (action.type) {
    case downloadActions.DOWNLOAD:
      return { ...state, status: DOWNLOAD_STATUSES.PENDING };
    case downloadActions.DOWNLOAD_SUCCESS:
      return initState;
    case downloadActions.DOWNLOAD_ERROR:
      return initState;

    default:
      return state;
  }
};

export default downloadReducer;
