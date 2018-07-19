import React from "react";
import { connect } from "react-redux";

import DownloadStartedSlide from "./download-started-slide";

const DownloadStarted = () => <DownloadStartedSlide />;

export default connect()(DownloadStarted);
