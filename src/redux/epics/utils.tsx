import { Observable } from "rxjs";

import Backend from "../../services/backend";

export const execObsverableIfBackendAvailable = (hosts, obsFn) =>
  Observable.fromPromise(Backend.checkStatus(hosts))
    .filter((available: any) => available)
    .mergeMap(obsFn);
