import uploadActions from "redux/actions/upload-actions";

const initState = {
  history: [
    // { numberOfChunks: 10, fileName: "hello.txt", handle: "abc123", uploadProgress: 0 }
  ]
};

const uploadedFileGenerator = ({ numberOfChunks, fileName, handle }) => {
  return { numberOfChunks, fileName, handle, uploadProgress: 0 };
};

const uploadReducer = (state = initState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default uploadReducer;
