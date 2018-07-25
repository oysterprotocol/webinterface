import { Observable } from "rxjs";

import Backend from "../../services/backend";

export const execObsverableIfBackendAvailable = obsFn =>
  Observable.fromPromise(Backend.checkStatus())
    .filter((available: any) => available)
    .mergeMap(obsFn);
