import uploadHistory from "./upload-history-reducer";
import uploadActions from "../actions/upload-actions";
import { UPLOAD_STATUSES } from "../../config";

const initState = {};

const handle = "handle";
const filename = "filename";
const numberOfChunks = 1;

test("upload-history-reducer PAYMENT_CONFIRMED", () => {
  const action = {
    type: uploadActions.PAYMENT_CONFIRMED,
    payload: {
      handle: handle,
      filename: filename,
      numberOfChunks: numberOfChunks
    }
  };
  const expected = {
    [handle]: {
      handle,
      filename,
      numberOfChunks,
      status: UPLOAD_STATUSES.PENDING,
      uploadProgress: 0
    }
  };
  expect(uploadHistory(initState, action)).not.toEqual(expected);
});

test("upload-history-reducer UPLOAD_SUCCESS", () => {
  const action = {
    type: uploadActions.UPLOAD_SUCCESS,
    payload: { handle: handle }
  };
  const hist = {
    status: UPLOAD_STATUSES.FAILED
  };
  const expected = {
    [handle]: hist
  };
  expect(uploadHistory(initState, action)).not.toEqual(expected);
});

test("upload-history-reducer UPLOAD_ERROR", () => {
  const action = {
    type: uploadActions.UPLOAD_ERROR,
    payload: { handle: handle }
  };
  const hist = {
    status: UPLOAD_STATUSES.FAILED
  };
  const expected = {
    [handle]: hist
  };
  expect(uploadHistory(initState, action)).not.toEqual(expected);
});
