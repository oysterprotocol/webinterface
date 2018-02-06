import React, { Component } from "react";

import { FILE } from "config";
import ICON_UPLOAD from "assets/images/icon_upload.png";
import ICON_FOLDER from "assets/images/icon_folder.png";
import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";

const DEFAULT_FILE_INPUT_TEXT = "No file selected";

class UploadSlide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: DEFAULT_FILE_INPUT_TEXT
    };
  }

  render() {
    const { upload } = this.props;
    return (
      <Slide title="Upload a File" image={ICON_UPLOAD}>
        <div className="body_form">
          <div className="rights">
            <div className="book_list">
              <label htmlFor="broker-node-1">Broker Node 1</label>
              <select
                disabled
                name="broker-node-1"
                id="broker-node-1"
                defaultValue="broker-1.oysternodes.com"
              >
                <option disabled="">Select broker node</option>
                <option value="broker-1.oysternodes.com">
                  broker-1.oysternodes.com
                </option>
              </select>
            </div>
          </div>
          <div className="lefts">
            <div className="book_list">
              <label htmlFor="broker-node-2">Broker Node 2</label>
              <select
                disabled
                name="broker-node-2"
                id="broker-node-2"
                defaultValue="broker-2.oysternodes.com"
              >
                <option disabled="">Select broker node</option>
                <option value="broker-2.oysternodes.com">
                  broker-2.oysternodes.com
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="select_list">
          <p>Select Retention File</p>
          <form>
            <div className="rights">
              <input
                className="retention-slider"
                type="range"
                min="0"
                max="10"
                defaultValue="0"
              />
            </div>
            <div className="lefts">
              <select id="sel" disabled>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
              <span className="years-retention">Years of retention</span>
            </div>
          </form>
        </div>
        <div className="lefts myfile">
          <p>Select a file</p>
          <div className="file-input-wrapper">
            <label htmlFor="upload-input" className="file-input-label">
              <span className="upload-filename">{this.state.fileName}</span>
              <span className="upload-folder">
                <img src={ICON_FOLDER} width="25" />
              </span>
            </label>
          </div>
          <input
            name="upload"
            id="upload-input"
            ref="fileInput"
            onChange={event => {
              const file = event.target.files[0];
              if (!!file) {
                this.setState({ fileName: file.name });
              } else {
                this.setState({ fileName: DEFAULT_FILE_INPUT_TEXT });
              }
            }}
            type="file"
            required
          />
        </div>
        <div className="rights myfiler">
          <p>Cost</p>
          <h3>
            3 Gb for 10 years: <span> 30 PRL</span>
          </h3>
        </div>
        <div className="upload_button">
          <PrimaryButton
            className="btn btn-upload"
            type="button"
            onClick={() => {
              const file = this.refs.fileInput.files[0];
              if (!file || file.size > FILE.MAX_FILE_SIZE) {
                alert(
                  `Please select a file under ${FILE.MAX_FILE_SIZE / 1000} KB.`
                );
              } else {
                upload(file);
              }
            }}
          >
            Start Upload
          </PrimaryButton>
        </div>
        <aside className="disclaimer">
          DISCLAIMER: No PRL is required to use the Testnet.<br />
          Uploads cost 1 PRL per 64GB per Year.
        </aside>
      </Slide>
    );
  }
}

export default UploadSlide;
