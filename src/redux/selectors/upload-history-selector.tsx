import { createSelector } from "reselect";

const historySelector = state => state.uploadHistory;

export const getSortedHistoryDesc = createSelector([historySelector], history =>
  Object.values(history).sort((x: any, y: any) => y.createdAt - x.createdAt)
);
