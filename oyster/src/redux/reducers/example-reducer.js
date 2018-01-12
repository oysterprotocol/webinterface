import exampleActions from "../actions/example-actions";

const initState = { counter: 0 };

const exampleReducer = (state = initState, action) => {
  switch (action.type) {
    case exampleActions.INCREMENT:
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
};

export default exampleReducer;
