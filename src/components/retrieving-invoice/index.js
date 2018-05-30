import React from "react";
import { connect } from "react-redux";

import RetrievingInvoiceSlide from "./retrieving-invoice-slide";

const RetrievingInvoice = () => (
  <RetrievingInvoiceSlide
  />
);

export default connect()(RetrievingInvoice);
