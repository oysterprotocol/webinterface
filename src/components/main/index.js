import React, { Component } from "react";
import { connect } from "react-redux";

import fileActions from "../../redux/actions/file-actions";

const mapStateToProps = state => ({
  file: state.file
});
const mapDispatchToProps = dispatch => ({
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
