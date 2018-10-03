import React from "react";
import styled from "styled-components";

const ProgressBorder = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  border: solid 1px #2184fc;
  border-radius: 6px;
  background-color: transparent;
  height: 48px;
  max-width: 450px;
`;

const ProgressBar = ({ progress }) => (
  <ProgressBorder className="progress">
    <div
      class="progress-bar"
      role="progressbar"
      style={{
        "background-color": "#2184fc",
        width: `${progress}%`
      }}
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    />
  </ProgressBorder>
);

export default ProgressBar;
