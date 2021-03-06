import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";

import { API, FILE } from "../../config";
import Slide from "../shared/slide";
import Button from "../shared/button";
import Spinner from "../shared/spinner";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");
const ICON_FOLDER = require("../../assets/images/icon_folder.png");

const DEFAULT_FILE_INPUT_TEXT = "No file selected";
const DEFAULT_FILE_INPUT_SIZE = 0;
const DEFAULT_FILE_INPUT_COST = 0;
const DEFAULT_HUMAN_FILE_SIZE = 0;
const CHUNKS_IN_SECTOR = 1000000;
const STORAGE_PEG = 64;

interface UploadSlideProps {
  alphaBroker;
  betaBroker;
  selectAlphaBroker;
  selectBetaBroker;
  retentionYears;
  selectRetentionYears;
  streamUploadFn;
}

interface UploadSlideState {
  fileName;
  fileSize;
  storageCost;
  humanFileSize;
  isInitializing: boolean; // TODO: Enum this.
}

class UploadSlide extends Component<UploadSlideProps, UploadSlideState> {
  constructor(props) {
    super(props);

    this.state = {
      fileName: DEFAULT_FILE_INPUT_TEXT,
      fileSize: DEFAULT_FILE_INPUT_SIZE,
      storageCost: DEFAULT_FILE_INPUT_COST,
      humanFileSize: DEFAULT_HUMAN_FILE_SIZE,
      isInitializing: false
    };
  }

  render() {
    const {
      alphaBroker,
      betaBroker,
      selectAlphaBroker,
      selectBetaBroker,
      retentionYears,
      selectRetentionYears,
      streamUploadFn
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
                disabled
                value={retentionYears}
                onChange={event => {
                  let retentionYears = event.target.value;
                  selectRetentionYears(retentionYears);
                  this.setState({
                    storageCost: this.calculateStorageCost(
                      this.state.fileSize,
                      retentionYears
                    )
                  });
                }}
              />
            </div>
            <div className="upload-column">
              <select
                id="sel"
                value={retentionYears}
                disabled
                onChange={event => {
                  let retentionYears = event.target.value;
                  selectRetentionYears(retentionYears);
                  this.setState({
                    storageCost: this.calculateStorageCost(
                      this.state.fileSize,
                      retentionYears
                    )
                  });
                }}
              >
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
                let file: any = [];
                if (event.target.files) {
                  file = event.target.files[0];
                }
                if (!!file) {
                  this.setState({
                    fileName: file.name,
                    fileSize: file.size,
                    humanFileSize: this.humanFileSize(file.size, true),
                    storageCost: this.calculateStorageCost(
                      file.size,
                      retentionYears
                    )
                  });
                } else {
                  this.setState({
                    fileName: DEFAULT_FILE_INPUT_TEXT,
                    fileSize: DEFAULT_FILE_INPUT_SIZE,
                    humanFileSize: this.humanFileSize(
                      DEFAULT_FILE_INPUT_SIZE,
                      true
                    ),
                    storageCost: this.calculateStorageCost(
                      file.size,
                      retentionYears
                    )
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
          <Button
            id="start-upload-btn"
            className="btn btn-upload primary-button"
            disabled={this.state.isInitializing}
            type="button"
            onClick={() => {
              const fileInput: any = this.refs.fileInput;
              const file = fileInput.files[0];
              if (!file || file.size > FILE.MAX_FILE_SIZE) {
                alert(
                  `Please select a file under ${FILE.MAX_FILE_SIZE /
                    (1000 * 1000)} MB.`
                );
              } else if (retentionYears === "0") {
                alert(`Please select retention years`);
              } else if (Number(retentionYears) > 1) {
                alert(`For the beta mainnet, max storage years is 1.`);
              } else {
                const brokers = { alpha: alphaBroker, beta: betaBroker };
                streamUploadFn(file, retentionYears, brokers);
              }
            }}
          >
            {this.state.isInitializing
              ? "Initializing Upload..."
              : "Start Upload"}
          </Button>
          <Spinner
            isActive={this.state.isInitializing}
            className="download-spinner"
          />
        </div>
        <aside className="disclaimer">
          DISCLAIMER: No PRL is required to use the beta Mainnet.
          <br />
          This is a beta phase and should not be used for important data.
          <br />
          Uploads cost 1 PRL per 64GB per year (paid for by Oyster). <br />
          Current filesize limit is 125MB per file.
        </aside>
      </Slide>
    );
  }

  calculateStorageCost(fileSizeBytes, years) {
    let chunks = Math.ceil(fileSizeBytes / 1000) + 1; // 1 kb for metadata
    let numSectors = Math.ceil(chunks / CHUNKS_IN_SECTOR);
    let costPerYear = numSectors / STORAGE_PEG;
    return costPerYear * years;
  }

  humanFileSize(bytes, si) {
    let thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
    let units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + " " + units[u];
  }
}

export default UploadSlide;
