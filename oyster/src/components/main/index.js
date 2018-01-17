import React, { Component } from "react";
import { connect } from "react-redux";

import exampleActions from "../../redux/actions/example-actions";
import fileActions from "../../redux/actions/file-actions";

const mapStateToProps = state => ({
  example: state.example,
  file: state.file
});
const mapDispatchToProps = dispatch => ({
  exampleFn: () => dispatch(exampleActions.incrementAction()),
  uploadFn: file => dispatch(fileActions.uploadAction(file))
});

class Main extends Component {
  render() {
    const { uploadFn } = this.props;
    return (
      <div>
        <input
          ref="fileInput"
          type="file"
          onClick={event => {
            event.target.value = null;
          }}
        />
        <button
          onClick={() => {
            const file = this.refs.fileInput.files[0];
            uploadFn(file);
          }}
        >
          Upload a file.
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
