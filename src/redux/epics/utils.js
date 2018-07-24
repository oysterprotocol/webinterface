import { Observable } from "rxjs";

import Backend from "../../services/backend";

export const execObsverableIfBackendAvailable = obsFn =>
  Observable.fromPromise(Backend.checkStatus())
    .filter(available => available)
    .mergeMap(obsFn);
