import EXAMPLE_ACTIONS, { incrementAction } from "../actions/example-actions";

const initState = { counter: 0 };

const exampleReducer = (state = initState, action) => {
  switch (action.type) {
    case EXAMPLE_ACTIONS.INCREMENT:
      return { ...state, counter: state.counter + 1 };
    default:
      return state;
  }
};

export default exampleReducer;
