import React from "react";
import { connect } from "react-redux";

import exampleActions from "../../redux/actions/example-actions";

const mapStateToProps = state => ({ example: state.example });
const mapDispatchToProps = dispatch => ({
  exampleFn: () => dispatch(exampleActions.incrementAction())
});

const Main = ({ example, exampleFn }) => (
  <div>
    <h1>{example.counter}</h1>
    <button onClick={exampleFn}>Upload a file.</button>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
