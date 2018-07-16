import React, { Component } from "react";
import { connect } from "react-redux";

import playgroundActions from "../../redux/actions/playground-actions";
import PrimaryButton from "../shared/primary-button";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  testUploadFn: file => dispatch(playgroundActions.testUploadAction(file))
});

class Playground extends Component {
  render() {
    const { testUploadFn } = this.props;
    return (
      <div>
        <h1>PLAYGROUND</h1>
        <input ref="fileInput" type="file" required />
        <PrimaryButton
          className="btn btn-upload"
          type="button"
          onClick={() => {
            const file = this.refs.fileInput.files[0];
            if (!file) {
              alert("Please select a file.");
            } else {
              testUploadFn(file);
            }
          }}
        >
          Upload and then Download
        </PrimaryButton>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
