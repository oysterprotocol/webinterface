import upload, { UPLOAD_STATE } from "./upload-reducer";
import uploadActions from "../actions/upload-actions";
import { API } from "../../config";

const initState = {
  alphaBroker: API.BROKER_NODE_A,
  betaBroker: API.BROKER_NODE_B,
  indexes: { indexes: [], startingLength: 0 },
  dataMapLength: 0,
  history: [], // object returned by uploadedFileGenerator()
  retentionYears: 1,
  invoice: null, // { cost, ethAddress }
  gasPrice: 20,
  uploadProgress: 0,
  handle: ""
};

test("upload-reducer SELECT_ALPHA_BROKER", () => {
  const action = {
    type: uploadActions.SELECT_ALPHA_BROKER,
    payload: "url"
  };
  const expected = {
    alphaBroker: "url",
    betaBroker: API.BROKER_NODE_B,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: 0
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer SELECT_BETA_BROKER", () => {
  const action = {
    type: uploadActions.SELECT_BETA_BROKER,
    payload: "url"
  };
  const expected = {
    betaBroker: "url",
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: 0
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer SELECT_RETENTION_YEARS", () => {
  const action = {
    type: uploadActions.SELECT_RETENTION_YEARS,
    payload: 10
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 10,
    uploadProgress: 0
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer INVOICED", () => {
  const cost = 10;
  const ethAddress = "ethAddress";
  const action = {
    type: uploadActions.INVOICED,
    payload: { cost, ethAddress }
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: { cost, ethAddress },
    retentionYears: 1,
    uploadProgress: 0
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer CHUNKS_DELIVERED", () => {
  const handle = "handle";
  const action = {
    type: uploadActions.CHUNKS_DELIVERED,
    payload: { handle }
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: 0,
    uploadState: UPLOAD_STATE.COMPLETE,
    handle: handle,
    chunksProgress: 100
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer PAYMENT_CONFIRMED", () => {
  const action = {
    type: uploadActions.PAYMENT_CONFIRMED
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: 0
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer UPLOAD_PROGRESS", () => {
  const progress = 10;
  const action = {
    type: uploadActions.UPLOAD_PROGRESS,
    payload: { progress }
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: "",
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: progress
  };
  expect(upload(initState, action)).toEqual(expected);
});

test("upload-reducer UPLOAD_SUCCESS", () => {
  const handle = "handle";
  const action = {
    type: uploadActions.UPLOAD_SUCCESS,
    payload: { handle }
  };
  const expected = {
    betaBroker: API.BROKER_NODE_B,
    alphaBroker: API.BROKER_NODE_A,
    dataMapLength: 0,
    gasPrice: 20,
    handle: handle,
    history: [],
    indexes: {
      indexes: [],
      startingLength: 0
    },
    invoice: null,
    retentionYears: 1,
    uploadProgress: 100
  };
  expect(upload(initState, action)).toEqual(expected);
});
