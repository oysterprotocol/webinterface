const INCREMENT = "oyster/example/increment";

const ACTIONS = Object.freeze({
  // actions
  INCREMENT,

  // actionCreators
  incrementAction: () => ({ type: ACTIONS.INCREMENT })
});

export default ACTIONS;
