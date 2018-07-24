import React from "react";
import MDSpinner from "react-md-spinner";

const Spinner = ({ isActive, className }) => {
  return isActive ? <MDSpinner className={className} /> : null;
};

export default Spinner;
