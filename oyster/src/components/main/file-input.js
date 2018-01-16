import React, { Component } from "react";

class FileInput extends Component {
  render() {
    const { onSelect } = this.props;
    return (
      <input
        ref="fileInput"
        type="file"
        onChange={event => {
          const file = this.refs.fileInput.files[0];
          onSelect(file);
        }}
        onClick={event => {
          event.target.value = null;
        }}
      />
    );
  }
}

export default FileInput;
