const INCREMENT = "oyster/upload/increment";

const ACTIONS = Object.freeze({
  // actions
  INCREMENT,

  // actionCreators
  incrementAction: () => ({ type: ACTIONS.INCREMENT })
});

export default ACTIONS;
