import React, { Component } from "react";
import { connect } from "react-redux";

import fileActions from "../../redux/actions/file-actions";

const mapStateToProps = state => ({
  file: state.file
});
const mapDispatchToProps = dispatch => ({
  initializeUploadFn: file => dispatch(fileActions.initializeUploadAction(file))
});

class Main extends Component {
  render() {
    const { file, initializeUploadFn } = this.props;
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
            initializeUploadFn(file);
          }}
        >
          Upload a file.
        </button>
        <span>UPLOAD PROGRESS: {file.progressBarPercentage}%</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
