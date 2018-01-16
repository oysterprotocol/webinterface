import fileActions from "redux/actions/file-actions";

const initState = { selectedFile: null };

const fileReducer = (state = initState, action) => {
  switch (action.type) {
    case fileActions.SELECT:
      const file = action.payload;
      return { ...state, selectedFile: file };
    default:
      return state;
  }
};

export default fileReducer;
