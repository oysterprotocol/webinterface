import uploadActions from "../actions/upload-actions";
import { API } from "../../config";

const initState = {
  alphaBroker: API.BROKER_NODE_A,
  betaBroker: API.BROKER_NODE_B,
  indexes: { indexes: [], startingLength: 0 },
  dataMapLength: 0,
  history: [], // object returned by uploadedFileGenerator()
  retentionYears: 1,
  invoice: null, // { cost, ethAddress }
  gasPrice: 20,
  uploadProgress: 0
};

const uploadReducer = (state = initState, action) => {
  switch (action.type) {
    case uploadActions.SELECT_ALPHA_BROKER:
      return {
        ...state,
        alphaBroker: action.payload
      };

    case uploadActions.SELECT_BETA_BROKER:
      return {
        ...state,
        betaBroker: action.payload
      };

    case uploadActions.SELECT_RETENTION_YEARS:
      return {
        ...state,
        retentionYears: action.payload
      };


    // Streaming actions.

    case uploadActions.STREAM_INVOICED:
      const { cost, ethAddress } = action.payload;
      return { ...state, invoice: { cost, ethAddress } };

    case uploadActions.STREAM_UPLOAD_PROGRESS:
      const { progress } = action.payload;
      return { ...state, uploadProgress: progress };

    // case uploadActions.STREAM_UPLOAD:
    // case uploadActions.STREAM_PAYMENT_CONFIRMED:
    // case uploadActions.STREAM_UPLOAD_SUCCESS:
    // case uploadActions.STREAM_UPLOAD_ERROR:
    default:
      return state;
  }
};

export default uploadReducer;
