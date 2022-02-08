function checkAdUnitSetup(adUnits) {
  const validatedAdUnits = [];

  adUnits.forEach(adUnit => {
    const mediaTypes = adUnit.mediaTypes;
    const bids = adUnit.bids;
    let sizeList

    if (mediaTypes.banner) {
      sizeList = validateSizes(mediaTypes.banner.sizes);
    }

    if (mediaTypes.video) {
      sizeList = validateSizes(mediaTypes.video.playerSize);
    }

    let sizes = prepareSizes(sizeList)

    bids.forEach(bid => {
      if (bid.bidder == 'alkimi') {
        const validatedAdUnit = {}
        validatedAdUnit.token = bid.params.token
        validatedAdUnit.pos = bid.params.pos
        validatedAdUnit.bidFloor = bid.params.bidFloor
        validatedAdUnit.impMediaType = getFormatType(adUnit)
        validatedAdUnit.width = sizes[0].width
        validatedAdUnit.height = sizes[0].height

        validatedAdUnits.push(validatedAdUnit);
      }
    })
  });

  return validatedAdUnits;
}

function dlv(obj, key, def, p, undef) {
  key = key.split ? key.split('.') : key;
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }
  return obj === undef ? def : obj;
}

function prepareSizes(sizes) {
  return sizes && sizes.map(size => ({ width: size[0], height: size[1] }));
}

function getFormatType(bidRequest) {
  if (dlv(bidRequest, 'mediaTypes.banner')) return 'Banner'
  if (dlv(bidRequest, 'mediaTypes.video')) return 'Video'
  if (dlv(bidRequest, 'mediaTypes.audio')) return 'Audio'
}

function validateSizes(sizes, targLength) {
  let cleanSizes = [];
  if (isArray(sizes) && ((targLength) ? sizes.length === targLength : sizes.length > 0)) {
    // check if an array of arrays or array of numbers
    if (sizes.every(sz => isArrayOfNums(sz, 2))) {
      cleanSizes = sizes;
    } else if (isArrayOfNums(sizes, 2)) {
      cleanSizes.push(sizes);
    }
  }
  return cleanSizes;
}

function isArray(object) {
  return isA(object, 'Array');
}

function isA(object, _t) {
  return toString.call(object) === '[object ' + _t + ']';
}

function isArrayOfNums(val, size) {
  return (isArray(val)) && ((size) ? val.length === size : true) && (val.every(v => isInteger(v)));
}

function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
}

function generateUUID(placeholder) {
  return placeholder
    ? (placeholder ^ _getRandomData() >> placeholder / 4).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

function _getRandomData() {
  if (window && window.crypto && window.crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0] % 16;
  } else {
    return Math.random() * 16;
  }
}
