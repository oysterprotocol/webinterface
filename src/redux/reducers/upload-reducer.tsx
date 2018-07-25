import uploadActions from "../actions/upload-actions";
import { API, UPLOAD_STATUSES } from "../../config";

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

const uploadedFileGenerator = ({ numberOfChunks, fileName, handle }) => {
  return {
    numberOfChunks,
    fileName,
    handle,
    uploadProgress: 0,
    status: UPLOAD_STATUSES.PENDING
  };
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

    case uploadActions.POLL_PAYMENT_STATUS:
      return {
        ...state,
        invoice: action.payload.invoice
      };

    case uploadActions.GAS_PRICE:
      return {
        ...state,
        gasPrice: action.payload.price
      };

    case uploadActions.UPDATE_UPLOAD_PROGRESS:
      const {
        handle: fileHandle,
        uploadProgress,
        indexes: updatedIndexes
      } = action.payload;
      const updatedHistory = state.history.map((f: any) => {
          if (f.handle !== fileHandle) return f;

          // Make sure progress doesn't go backwards.
          const prog = Math.max(f.uploadProgress, uploadProgress);
          return { ...f, uploadProgress: prog };
      });
      const updated = {
        ...state.indexes,
        indexes: updatedIndexes
      };
      return {
        ...state,
        history: updatedHistory,
        indexes: updated
      };

    case uploadActions.ADD_TO_HISTORY:
      const { numberOfChunks, fileName, handle } = action.payload;
      return {
        ...state,
        history: [
          ...state.history,
          uploadedFileGenerator({ numberOfChunks, fileName, handle })
        ]
      };

    case uploadActions.UPLOAD_SUCCESS:
      const succeededHandle = action.payload;
      const newHistory = state.history.map((f:any) => {
        return f.handle === succeededHandle
          ? { ...f, status: UPLOAD_STATUSES.SENT }
          : f;
      });
      return {
        ...state,
        history: newHistory
      };

    case uploadActions.UPLOAD_FAILURE:
      const failedHandle = action.payload;
      const h = state.history.map((f:any) => {
        return f.handle === failedHandle
          ? { ...f, status: UPLOAD_STATUSES.FAILED }
          : f;
      });
      return {
        ...state,
        history: h
      };

    case uploadActions.INITIALIZE_POLLING_INDEXES:
      const { indexes, dataMapLength } = action.payload;
      const initial = {
        ...state.indexes,
        indexes,
        startingLength: indexes.length
      };
      return {
        ...state,
        indexes: initial,
        dataMapLength
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