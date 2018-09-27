import { Observable } from "rxjs";

import Backend from "../../services/backend";

export const execObservableIfBackendAvailable = (
  hosts,
  availableObsFn,
  unavailableObsFn
) =>
  Observable.fromPromise(Backend.checkStatus(hosts)).mergeMap(
    (available: any) => {
      return available ? availableObsFn() : unavailableObsFn();
    }
  );
