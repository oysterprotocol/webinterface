import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";

import { API, FILE } from "config";
import ICON_UPLOAD from "assets/images/icon_upload.png";
import ICON_FOLDER from "assets/images/icon_folder.png";
import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";

const DEFAULT_FILE_INPUT_TEXT = "No file selected";
const DEFAULT_FILE_INPUT_SIZE = 0;
const DEFAULT_FILE_INPUT_COST = 0;
const BYTES_IN_GIGABYTE = 1073741824;

class UploadSlide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: DEFAULT_FILE_INPUT_TEXT,
      fileSize: DEFAULT_FILE_INPUT_SIZE,
      storageCost: DEFAULT_FILE_INPUT_COST
    };
  }

  render() {
    const {
      alphaBroker,
      betaBroker,
      upload,
      selectAlphaBroker,
      selectBetaBroker,
      retentionYears,
      selectRetentionYears
    } = this.props;
    return (
      <Slide title="Upload a File" image={ICON_UPLOAD}>
        <div className="broker-select-wrapper">
          <div className="upload-column">
            <label htmlFor="broker-node-1">Broker Node 1</label>
            <Select
              name="broker-node-1"
              disabled
              clearable={false}
              searchable={false}
              value={alphaBroker}
              onChange={option => selectAlphaBroker(option.value)}
              options={[
                {
                  value: API.BROKER_NODE_A,
                  label: "broker-1.oysternodes.com"
                },
                {
                  value: API.BROKER_NODE_B,
                  label: "broker-2.oysternodes.com"
                }
              ]}
            />
          </div>
          <div className="upload-column">
            <label htmlFor="broker-node-2">Broker Node 2</label>
            <Select
              name="broker-node-2"
              disabled
              clearable={false}
              searchable={false}
              value={betaBroker}
              onChange={option => selectBetaBroker(option.value)}
              options={[
                {
                  value: API.BROKER_NODE_A,
                  label: "broker-1.oysternodes.com"
                },
                {
                  value: API.BROKER_NODE_B,
                  label: "broker-2.oysternodes.com"
                }
              ]}
            />
          </div>
        </div>
        <div className="upload-section">
          <p>Select Retention File</p>
          <form className="retention-wrapper">
            <div className="upload-column">
              <input
                className="retention-slider"
                type="range"
                min="0"
                max="10"
                value={retentionYears}
                onChange={slider => {
                  selectRetentionYears(slider.target.value);
                  this.setState({
                    storageCost: ((this.state.fileSize / BYTES_IN_GIGABYTE) * slider.target.value).toFixed(8)
                  });
                }}
              />
            </div>
            <div className="upload-column">
              <select id="sel" disabled value={retentionYears}>
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
        <div className="file-select-wrapper upload-section">
          <div className="upload-column">
            <p>Select a file</p>
            <div className="file-input-wrapper">
              <label htmlFor="upload-input" className="file-input-label">
                <span className="upload-filename">{this.state.fileName}</span>
                <span className="upload-folder">
                  <img src={ICON_FOLDER} width="25" alt="folder" />
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
                  this.setState({
                    fileName: file.name,
                    fileSize: file.size,
                    humanFileSize: this.humanFileSize(file.size, true),
                    storageCost: ((file.size / BYTES_IN_GIGABYTE) * retentionYears).toFixed(8)
                  });
                } else {
                  this.setState({
                    fileName: DEFAULT_FILE_INPUT_TEXT,
                    fileSize: DEFAULT_FILE_INPUT_SIZE,
                    humanFileSize: this.humanFileSize(DEFAULT_FILE_INPUT_SIZE, true),
                    storageCost: DEFAULT_FILE_INPUT_COST
                  });
                }
              }}
              type="file"
              required
            />
          </div>
          <div className="upload-column">
            <p>Cost</p>
            <h3 className="storage-fees">
              {this.state.humanFileSize} for {retentionYears} years:
              <span> {this.state.storageCost} PRL</span>
            </h3>
          </div>
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
              } else if (retentionYears === '0') {
                alert(
                  `Please select retention years`
                );
              } else {
                upload(file, retentionYears);
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

  humanFileSize(bytes, si) {
    let thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    let units = si
      ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
      : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
  }
}

export default UploadSlide;
