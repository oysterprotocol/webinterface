import actions from "./upload-actions";

test("upload-action SELECT_ALPHA_BROKER", () => {
  const url = "url";
  const expected = {
    type: actions.SELECT_ALPHA_BROKER,
    payload: url
  };
  expect(actions.selectAlphaBrokerAction(url)).toEqual(expected);
});

test("upload-action SELECT_BETA_BROKER", () => {
  const url = "handle";
  const expected = {
    type: actions.SELECT_BETA_BROKER,
    payload: url
  };
  expect(actions.selectBetaBrokerAction(url)).toEqual(expected);
});

test("upload-action SELECT_RETENTION_YEARS", () => {
  const value = "value";
  const expected = {
    type: actions.SELECT_RETENTION_YEARS,
    payload: value
  };
  expect(actions.selectRetentionYears(value)).toEqual(expected);
});

// Stream actions
test("upload-action UPLOAD", () => {
  const file = "file";
  const retentionYears = "retentionYears";
  const brokers = "brokers";
  const expected = {
    type: actions.UPLOAD,
    payload: { file, retentionYears, brokers }
  };
  expect(actions.streamUpload({ file, retentionYears, brokers })).toEqual(expected);
});

test("upload-action INVOICED", () => {
  const cost = "cost";
  const ethAddress = "ethAddress";
  const expected = {
    type: actions.INVOICED,
    payload: { cost, ethAddress }
  };
  expect(actions.streamInvoiced({ cost, ethAddress })).toEqual(expected);
});

test("upload-action PAYMENT_PENDING", () => {
  const expected = {
    type: actions.PAYMENT_PENDING
  };
  expect(actions.streamPaymentPending()).toEqual(expected);
});


test("upload-action PAYMENT_CONFIRMED", () => {
  const filename = "filename";
  const handle = "handle";
  const numberOfChunks = "numberOfChunks";
  const expected = {
    type: actions.PAYMENT_CONFIRMED,
    payload: { filename, handle, numberOfChunks }
  };
  expect(actions.streamPaymentConfirmed({ filename, handle, numberOfChunks })).toEqual(expected);
});


test("upload-action CHUNKS_DELIVERED", () => {
  const handle = "handle";
  const expected = {
    type: actions.CHUNKS_DELIVERED,
    payload: { handle }
  };
  expect(actions.streamChunksDelivered({ handle })).toEqual(expected);
});


test("upload-action UPLOAD_PROGRESS", () => {
  const progress = 0.18;
  const expected = {
    type: actions.UPLOAD_PROGRESS,
    payload: { progress }
  };
  expect(actions.streamUploadProgress({ progress })).toEqual(expected);
});


test("upload-action UPLOAD_SUCCESS", () => {
  const handle = "handle";
  const expected = {
    type: actions.UPLOAD_SUCCESS,
    payload: { handle }
  };
  expect(actions.streamUploadSuccess({ handle })).toEqual(expected);
});


test("upload-action UPLOAD_ERROR", () => {
  const handle = "handle";
  const err = "err";
  const expected = {
    type: actions.UPLOAD_ERROR,
    payload: { err }
  };
  expect(actions.streamUploadError({ handle, err })).toEqual(expected);
});
