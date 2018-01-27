import fileActions from "redux/actions/file-actions";

const initState = {
  progressBarPercentage: 0
};

const fileReducer = (state = initState, action) => {
  switch (action.type) {
    case fileActions.UPDATE_UPLOAD_PROGRESS:
      return {
        ...state,
        progressBarPercentage: action.payload
      };
    default:
      return state;
  }
};

export default fileReducer;
