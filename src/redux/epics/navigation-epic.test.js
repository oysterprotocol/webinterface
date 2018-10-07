import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toArray";

import navigationActions from "../actions/navigation-actions";
import uploadActions from "../actions/upload-actions";
import navigationEpic from "./navigation-epic";

import { ActionsObservable } from "redux-observable";
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([]);

test("navigationEpic goToDownloadForm", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    { type: navigationActions.VISIT_DOWNLOAD_FORM }
  );
  const expected = [
    {
      "payload": {
        "args": ["/download-form"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToUploadForm", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    { type: navigationActions.VISIT_UPLOAD_FORM }
  );
  const expected = [
    {
      "payload": {
        "args": ["/upload-form"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToUploadStartedStream", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    {
      type: uploadActions.PAYMENT_CONFIRMED,
      payload: { handle: "handle" }
    }
  );
  const expected = [
    {
      "payload": {
        "args": ["/upload-started"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToUploadCompleteStream", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    {
      type: uploadActions.UPLOAD_SUCCESS
    }
  );
  const expected = [
    {
      "payload": {
        "args": ["/upload-complete"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToPaymentInvoiceStream", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    {
      type: uploadActions.INVOICED
    }
  );
  const expected = [
    {
      "payload": {
        "args": ["/payment-invoice"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToPaymentConfirmationStream", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    {
      type: uploadActions.PAYMENT_PENDING
    }
  );
  const expected = [
    {
      "payload": {
        "args": ["/payment-confirm"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});

test("navigationEpic goToErrorPage", () => {
  const state = {};
  const store = mockStore(state);
  const action = ActionsObservable.of(
    {
      type: navigationActions.ERROR_PAGE
    }
  );
  const expected = [
    {
      "payload": {
        "args": ["/error-page"],
        "method": "push"
      },
      "type": "@@router/CALL_HISTORY_METHOD"
    }
  ];
  navigationEpic(action, store)
    .toArray()
    .subscribe(actions => {
      expect(actions).toEqual(expected);
    });
});
