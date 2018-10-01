import * as uploadHistorySelectors from "./upload-history-selector";

test("upload-history-selectors", () => {

  const object1 = Date.now() - 1;
  const object2 = Date.now();
  const object3 = Date.now() + 2;
  const object4 = Date.now() + 3;
  const object5 = Date.now() - 3;

  const state = {
    uploadHistory: {
      0: { createdAt: object1 },
      1: { createdAt: object2 },
      2: { createdAt: object3 },
      3: { createdAt: object4 },
      4: { createdAt: object5 },
    }
  };

  const treasureHuntableGenesisHashExpected = [
    { createdAt: object4 },
    { createdAt: object3 },
    { createdAt: object2 },
    { createdAt: object1 },
    { createdAt: object5 },
  ];

  expect(uploadHistorySelectors.getSortedHistoryDesc(state)).toEqual(
    treasureHuntableGenesisHashExpected
  );
});
