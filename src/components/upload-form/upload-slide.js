import React, { Component } from "react";

import ICON_UPLOAD from "assets/images/icon_upload.png";
import ICON_FOLDER from "assets/images/icon_folder.png";
import Slide from "components/shared/slide";
import PrimaryButton from "components/shared/primary-button";

class UploadSlide extends Component {
  render() {
    const { upload } = this.props;
    return (
      <Slide title="Upload a File" image={ICON_UPLOAD}>
        <div className="body_form">
          <div className="rights">
            <div className="book_list">
              <label htmlFor="broker-node-1">Broker Node 1</label>
              <select
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
          <form id="demo">
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
              <select id="sel">
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
              <div className="years">
                <h3>Years of retention</h3>
              </div>
            </div>
          </form>
        </div>
        <div className="lefts myfile">
          <p>Select a file</p>
          <div className="input-group image-preview">
            <input
              name="upload"
              id="upload-input"
              placeholder="Select a file"
              className="form-control image-preview-filename input"
              ref="fileInput"
              type="file"
              required
            />
            <span className="input-group-btn">
              <button
                type="button"
                className="btn btn-default image-preview-clear btn-hidden"
              >
                <span className="glyphicon glyphicon-remove" /> Clear
              </button>
              <div className="btn btn-default image-preview-input">
                <label
                  htmlFor="upload-input"
                  className="image-preview-input-title"
                >
                  <img src={ICON_FOLDER} width="20" />
                </label>
              </div>
            </span>
          </div>
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
              if (!file) {
                alert("Please select a file.");
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
