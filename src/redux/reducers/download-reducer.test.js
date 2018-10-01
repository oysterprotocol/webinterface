import download from "./download-reducer";
import downloadActions from "../actions/download-actions";
import { DOWNLOAD_STATUSES } from "../../config";

const initState = { status: DOWNLOAD_STATUSES.STANDBY };

test("download-reducer DOWNLOAD", () => {

  const action = {
    type: downloadActions.DOWNLOAD,
    payload: { handle: "handle" }
  };

  const expected = {
    status: DOWNLOAD_STATUSES.PENDING
  };

  expect(download(initState, action)).toEqual(expected);
});

test("download-reducer DOWNLOAD_SUCCESS", () => {

  const action = {
    type: downloadActions.DOWNLOAD_SUCCESS,
    payload: {}
  };

  expect(download(initState, action)).toEqual(initState);
});

test("download-reducer DOWNLOAD_ERROR", () => {

  const action = {
    type: downloadActions.DOWNLOAD_ERROR,
    payload: { err: "error" }
  };

  expect(download(initState, action)).toEqual(initState);
});