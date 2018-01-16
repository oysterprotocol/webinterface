import React from "react";
import { connect } from "react-redux";

import exampleActions from "../../redux/actions/example-actions";
import fileActions from "../../redux/actions/file-actions";
import FileInput from "components/main/file-input";

const mapStateToProps = state => ({ example: state.example });
const mapDispatchToProps = dispatch => ({
  exampleFn: () => dispatch(exampleActions.incrementAction()),
  selectFn: file => dispatch(fileActions.selectAction(file))
});

const Main = ({ example, exampleFn, selectFn }) => (
  <div>
    <h1>{example.counter}</h1>
    <FileInput onSelect={selectFn} />
    <button onClick={exampleFn}>Upload a file.</button>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
