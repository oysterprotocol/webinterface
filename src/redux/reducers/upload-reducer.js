import uploadActions from "redux/actions/upload-actions";
import { API, UPLOAD_STATUSES, IOTA_API } from "config";

const initState = {
  alphaBroker: API.BROKER_NODE_A,
  betaBroker: API.BROKER_NODE_B,
  indexes: {
    indexes: [],
    startingLength: 0
  },
  dataMapLength: 0,
  history: [
    // object returned by uploadedFileGenerator()
  ],
  retentionYears: 1,
  invoice: {
    cost: 0,
    ethAddress: "asdf"
  }
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

    case uploadActions.UPDATE_UPLOAD_PROGRESS:
      const {
        handle: fileHandle,
        uploadProgress,
        indexes: updatedIndexes
      } = action.payload;
      const updatedHistory = state.history.map(f => {
        return f.handle === fileHandle ? { ...f, uploadProgress } : f;
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
      const newHistory = state.history.map(f => {
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
      const h = state.history.map(f => {
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

    default:
      return state;
  }
};

export default uploadReducer;
