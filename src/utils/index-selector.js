const selectPollingIndexes = (addresses, numPollingAddresses, bundleSize) => {
  // What this if is checking for is basically medium-sized uploads
  // which would have been better off with the old random index selection.
  // For those uploads, pick indexes the old way.
  if (
    addresses.length <
    (bundleSize + bundleSize / 2) / 2 * numPollingAddresses
  ) {
    let indexArray = [0];
    while (addresses.length - 1 > indexArray[indexArray.length - 1]) {
      indexArray = indexArray.concat(
        Math.min(
          ...[
            indexArray[indexArray.length - 1] +
              Math.floor(Math.random() * (bundleSize / 2)) +
              bundleSize / 2,
            addresses.length - 1
          ]
        )
      );
    }
    if (indexArray.length === 2) {
      //make sure there's always at least 3 addresses
      indexArray.splice(1, 0, Math.floor(addresses.length / 2));
    }
    return indexArray;
  } else {
    return selectPollingIndexesLarge(addresses, numPollingAddresses);
  }
};

const selectPollingIndexesLarge = (addresses, numPollingAddresses) => {
  const offset = addresses.length / (numPollingAddresses - 1);

  let indexes = [];
  for (let i = 0; i <= numPollingAddresses - 2; i++) {
    indexes.push(Math.floor(i * offset));
  }
  indexes.push(addresses.length - 1);

  return indexes;
};

export default {
  selectPollingIndexesLarge,
  selectPollingIndexes
};
