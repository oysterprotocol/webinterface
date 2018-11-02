import React, { Component } from "react";
import styled from "styled-components";
import Select from "react-select";
import "react-select/dist/react-select.css";

import { API, FILE } from "../../config";
import Slide from "../shared/slide";
import Button from "../shared/button";
import Spinner from "../shared/spinner";

import { Flexbox } from "../generic";

const ICON_UPLOAD = require("../../assets/images/icon_upload.png");
const ICON_FOLDER = require("../../assets/images/icon_folder.png");

const DEFAULT_FILE_INPUT_TEXT = "No file selected";
const DEFAULT_FILE_INPUT_SIZE = 0;
const DEFAULT_FILE_INPUT_COST = 0;
const DEFAULT_HUMAN_FILE_SIZE = 0;
const CHUNKS_IN_SECTOR = 1000000;
const STORAGE_PEG = 64;

const Paragraph = styled.p`
  color: #778291;
  font-weight: 500;
  font-size: 15px;
  line-height: 26px;
`;

const SpanYearsRetantion = styled.span`
  margin-left: 10px;
`;

const StorageFees = styled.h3`
  color: #778291;
  font-weight: 500;
  font-size: 18px;
`;

const SpanStorageFees = styled.span`
  color: #0068ea;
`;

const Disclaimer = styled.aside`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  padding-top: 20px;
`;

const RetentionWrapperForm = styled.form`
  display: flex;
`;

const SelectBox = styled.select`
  border: 1px solid #ecedef;
  width: 44px;
  font-size: 16px;
  padding: 1px 0;
  line-height: 26px;
  margin: 0 auto;
  text-align: center;
  padding-left: 15px;
  border-radius: 5px;
  font-weight: 500;
`;

const FlexContainer = styled.div`
  flex: 1;
  padding-right: 10px;
`;


const FlexboxStyled = styled(Flexbox)`
  marginTop="20px"
`;

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
        <Flexbox>
          <FlexContainer>
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
          </FlexContainer>
          <FlexContainer>
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
          </FlexContainer>
        </Flexbox>
        <FlexboxStyled>
          <Paragraph>Select Retention File</Paragraph>
          <RetentionWrapperForm>
            <FlexContainer>
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
            </FlexContainer>
            <FlexContainer>
              <SelectBox
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
              </SelectBox>
              <SpanYearsRetantion>Years of retention</SpanYearsRetantion>
            </FlexContainer>
          </RetentionWrapperForm>
        </FlexboxStyled>
        <FlexboxStyled>
          <FlexContainer>
            <Paragraph>Select a file</Paragraph>
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
          </FlexContainer>
          <FlexContainer>
            <Paragraph>Cost</Paragraph>
            <StorageFees>
              {this.state.humanFileSize} for {retentionYears} years:
              <SpanStorageFees> {this.state.storageCost} PRL</SpanStorageFees>
            </StorageFees>
          </FlexContainer>
        </FlexboxStyled>
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
        <Disclaimer>
          DISCLAIMER: No PRL is required to use the beta Mainnet.
          <br />
          This is a beta phase and should not be used for important data.
          <br />
          Uploads cost 1 PRL per 64GB per year (paid for by Oyster). <br />
          Current filesize limit is 125MB per file.
        </Disclaimer>
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
