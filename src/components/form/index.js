import React, { Component } from "react";
import { connect } from "react-redux";

import { UPLOAD_STATUSES } from "config";

import uploadActions from "../../redux/actions/upload-actions";
import downloadActions from "../../redux/actions/download-actions";
import IconFolder from "../shared/icon_folder";
import IconSidebar from "../shared/icon_sidebar";


const mapStateToProps = state => ({
  uploadHistory: state.upload.history
});
const mapDispatchToProps = dispatch => ({
  beginDownloadFn: ({ fileName, handle, numberOfChunks }) =>
    dispatch(
      downloadActions.beginDownloadAction({ fileName, handle, numberOfChunks })
    ),
  initializeUploadFn: file =>
    dispatch(uploadActions.initializeUploadAction(file))
});

class Form extends Component {
  renderUploadRow(upload, downloadFileFn) {
    const { fileName, uploadProgress, handle, numberOfChunks, status } = upload;
    if (uploadProgress < 100) {
      return (
        <p key={handle}>
          {fileName}:{" "}
          {status === UPLOAD_STATUSES.FAILED
            ? "UPLOAD FAILED, PLEASE TRY AGAIN"
            : `UPLOAD PROGRESS: ${uploadProgress}%`}
        </p>
      );
    } else {
      return (
        <span key={handle}>
          <button
            onClick={() => downloadFileFn({ fileName, handle, numberOfChunks })}
          >
            DOWNLOAD {fileName}
          </button>
        </span>
      );
    }
  }

  render() {
    const { initializeUploadFn, uploadHistory, beginDownloadFn } = this.props;
    return (
    <section id="upload">
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-1">
            <div className="body_form">
              <div className="form_title">
                <h2>Upload a File</h2>
                <span></span>
              </div>
              <div className="rights">
                <div className="book_list">
                  <label for="broker-node-1">Broker Node 1</label>
                  <select name="broker-node-1" id="broker-node-1">
                    <option disabled="">Select broker node</option>
                    <option selected="" value="broker-1.oysternodes.com">broker-1.oysternodes.com</option>
                  </select>
                </div>
              </div>
              <div className="lefts">
                <div className="book_list">
                  <label for="broker-node-2">Broker Node 2</label>
                  <select name="broker-node-2" id="broker-node-2">
                    <option disabled="">Select broker node</option>
                    <option selected="" value="broker-2.oysternodes.com">broker-2.oysternodes.com</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="select_list">
              <p>Select Retention File</p>
              <form id="demo">
                <div className="rights">
                   <input data-fix-max-value="10"  data-bound-select-id="sel" data-orientation="horizontal" value="0" type="range" min="0" max="10"/>  
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
                  <div className="years"><h3>Years of retention</h3></div>
                </div>
              </form>         
            </div>
            <div className="lefts myfile">
              <p>Select a file</p>
              <div className="input-group image-preview">
                <input
                  name="upload"
                  placeholder="Select a file"
                  className="form-control image-preview-filename input"
                  accept="image/png, image/jpeg, image/gif"
                  ref="fileInput"
                  type="file"
                  onClick={event => {
                    event.target.value = null;
                  }}
                  required
                />
                <span className="input-group-btn">
                  <button type="button" className="btn btn-default image-preview-clear btn-hidden">
                    <span className="glyphicon glyphicon-remove"></span> Clear
                  </button>
                  <div className="btn btn-default image-preview-input">
                    <span className="image-preview-input-title">
                      <IconFolder />
                    </span>
                    <input
                      className="input"
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      name="input-file-preview"
                      required
                      />
                  </div>
                </span>
              </div>
            </div>
            <div className="rights myfiler">
              <p>Cost</p>
              <h3>3 Gb for 10 years: <span> 30 PRL</span></h3>
            </div>
            <div className="upload_button">
              <button
                className="btn btn-upload"
                type="button"
                onClick={() => {
                  const file = this.refs.fileInput.files[0];
                  initializeUploadFn(file);
                }}
              >
                Start Upload
              </button>
              <div>
                {uploadHistory.map(upload =>
                  this.renderUploadRow(upload, beginDownloadFn)
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3 space">
            <div className="upload_img">
              <IconSidebar />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <aside className="disclaimer">
              DISCLAIMER: No PRL is required to use the Testnet.<br />
              Uploads cost 1 PRL per 64GB per Year.
            </aside>
          </div>
        </div>
      </div> 
    </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
