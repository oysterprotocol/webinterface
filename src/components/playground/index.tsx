import React, { Component } from "react";
import { connect } from "react-redux";

import playgroundActions from "../../redux/actions/playground-actions";
import PrimaryButton from "../shared/primary-button";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  testUploadFn: file => dispatch(playgroundActions.testUploadAction(file))
});

interface PlaygroundProps {
    testUploadFn
}

class Playground extends Component<PlaygroundProps> {
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
            const fileInput:any = this.refs.fileInput;
            const file = fileInput.files[0];
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
