import uploadActions from "redux/actions/upload-actions";
import { API, UPLOAD_STATUSES, IOTA_API } from "config";

const initState = {
  alphaBroker: API.BROKER_NODE_A,
  betaBroker: API.BROKER_NODE_B,
  indexes: {
    startingIdx: 0,
    endingIdx: 0,
    frontIdx: 0,
    backIdx: 0
  },
  dataMapLength: 0,
  history: [
    // object returned by uploadedFileGenerator()
  ]
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

    case uploadActions.UPDATE_UPLOAD_PROGRESS:
      const { handle: fileHandle, uploadProgress } = action.payload;
      const updatedHistory = state.history.map(f => {
        return f.handle === fileHandle ? { ...f, uploadProgress } : f;
      });
      return {
        ...state,
        history: updatedHistory
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
      const { frontIdx, backIdx, dataMapLength } = action.payload;
      const indexes = {
        ...state.indexes,
        endingIdx: dataMapLength - 1,
        frontIdx,
        backIdx
      };
      return {
        ...state,
        indexes: indexes,
        dataMapLength
      };

    case uploadActions.UPDATE_FRONT_INDEX:
      const frontIndexes = {
        ...state.indexes,
        frontIdx: action.payload
      };
      return {
        ...state,
        indexes: frontIndexes
      };

    case uploadActions.UPDATE_BACK_INDEX:
      const backIndexes = {
        ...state.indexes,
        backIdx: action.payload
      };
      return {
        ...state,
        indexes: backIndexes
      };

    default:
      return state;
  }
};

export default uploadReducer;
