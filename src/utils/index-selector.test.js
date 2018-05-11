import _ from "lodash";

import IndexSelector from "./index-selector";
import { NUM_POLLING_ADDRESSES } from "../config";
import { IOTA_API } from "../config";

const BUNDLE_SIZE = IOTA_API.BUNDLE_SIZE;

const generateAddresses = length => {
  const someAddress =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ9ABCDEFGHIJKLMNOPQRSTUVWXYZ9ABCDEFGHIJKLMNOPQRSTUVWXYZ9";
  return Array(length).fill(someAddress);
};

test(
  "selectPollingIndexes, for small files it should not necessarily insist on NUM_POLLING_ADDRESSES " +
    "indexes",
  done => {
    let addresses = generateAddresses(101);
    let indexes = IndexSelector.selectPollingIndexes(
      addresses,
      NUM_POLLING_ADDRESSES,
      BUNDLE_SIZE
    );
    let uniqueIndexes = _.uniq(indexes);

    // there should be exactly NUM_POLLING_ADDRESSES
    expect(indexes.length).not.toEqual(NUM_POLLING_ADDRESSES);
    // first and last should be equal to 0 and addresses.length - 1
    expect(indexes[0]).toEqual(0);
    expect(indexes[indexes.length - 1]).toEqual(100);
    // they should all be unique
    expect(indexes).toEqual(uniqueIndexes);

    done();
  }
);

test(
  "selectPollingIndexesLarge, huge file -- for datamap length > NUM_POLLING_ADDRESSES, " +
    "it should return 100 unique indexes",
  done => {
    let addresses = generateAddresses(5845888);
    let indexes = IndexSelector.selectPollingIndexesLarge(
      addresses,
      NUM_POLLING_ADDRESSES
    );
    let uniqueIndexes = _.uniq(indexes);

    // there should be exactly NUM_POLLING_ADDRESSES
    expect(indexes.length).toEqual(NUM_POLLING_ADDRESSES);
    // first and last should be equal to 0 and addresses.length - 1
    expect(indexes[0]).toEqual(0);
    expect(indexes[NUM_POLLING_ADDRESSES - 1]).toEqual(5845887);
    // they should all be unique
    expect(indexes).toEqual(uniqueIndexes);

    done();
  }
);

test("selectPollingIndexesLarge, should still work with a number that is not NUM_POLLING_ADDRESSES", done => {
  let numPollingForThisTest = 10;

  let addresses = generateAddresses(8000);
  let indexes = IndexSelector.selectPollingIndexesLarge(
    addresses,
    numPollingForThisTest
  );
  let uniqueIndexes = _.uniq(indexes);

  // there should be exactly numPollingForThisTest
  expect(indexes.length).toEqual(numPollingForThisTest);
  // first and last should be equal to 0 and addresses.length - 1
  expect(indexes[0]).toEqual(0);
  expect(indexes[numPollingForThisTest - 1]).toEqual(7999);
  // they should all be unique
  expect(indexes).toEqual(uniqueIndexes);

  done();
});
