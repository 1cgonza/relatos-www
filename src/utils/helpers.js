export function random(min, max, isFloat) {
  var random = Math.floor(Math.random() * (max - min)) + min;

  if (isFloat) {
    random = Math.random() * (max - min) + min;
  }

  return random;
}

export function sizeFromPercentage(percent, totalSize) {
  return (percent / 100) * totalSize;
}

export function getPercent(section, total) {
  return (section / total) * 100;
}

// https://stackoverflow.com/a/12646864/3661186
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export class Debouncer {
  constructor() {
    this.timer;
  }

  debounce(hold) {
    hold = hold || 250;
    return new Promise((resolve, reject) => {
      // trick for runing code only when resize ends
      // https://css-tricks.com/snippets/jquery/done-resizing-event/
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        resolve();
      }, hold);
    });
  }
}

export function debounce(hold) {
  let debounceTimer;
  hold = hold || 250;
  return new Promise((resolve, reject) => {
    // trick for runing code only when resize ends
    // https://css-tricks.com/snippets/jquery/done-resizing-event/
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      resolve();
    }, hold);
  });
}

export function rgbToHex(r, g, b) {
  if (!r) {
    return;
  }
  var g = g || r;
  var b = b || r;

  var rgb = b | (g << 8) | (r << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(3);
}

// https://stackoverflow.com/a/6565988/3661186
export function fitElement(sourceW, sourceH, parentW, parentH) {
  const sourceRatio = sourceW / sourceH;
  const parentRatio = parentW / parentH;
  let w;
  let h;

  if (parentRatio > sourceRatio) {
    w = (sourceW * parentH) / sourceH;
    h = parentH;
  } else {
    w = parentW;
    h = (sourceH * parentW) / sourceW;
  }

  return { w: w, h: h };
}

// http://www.jacklmoore.com/notes/mouse-position/
export function getXY(e) {
  let rect = e.target.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function getVideoId(str) {
  if (typeof str !== 'string') {
    throw new TypeError('getVideoId expects a string');
  }

  // remove surrounding whitespaces or linefeeds
  str = str.trim();

  // remove the '-nocookie' flag from youtube urls
  str = str.replace('-nocookie', '');

  // remove any leading `www.`
  str = str.replace('/www.', '/');

  let metadata = {};

  // Try to handle google redirection uri
  if (/\/\/google/.test(str)) {
    // Find the redirection uri
    const matches = str.match(/url=([^&]+)&/);

    // Decode the found uri and replace current url string - continue with final link
    if (matches) {
      // Javascript can get encoded URI
      str = decodeURIComponent(matches[1]);
    }
  }

  if (/youtube|youtu\.be|y2u\.be|i.ytimg\./.test(str)) {
    metadata = {
      id: youtube(str),
      service: 'youtube'
    };
  } else if (/vimeo/.test(str)) {
    metadata = {
      id: vimeo(str),
      service: 'vimeo'
    };
  } else if (/vine/.test(str)) {
    metadata = {
      id: vine(str),
      service: 'vine'
    };
  } else if (/videopress/.test(str)) {
    metadata = {
      id: videopress(str),
      service: 'videopress'
    };
  }
  return metadata;
}

/**
 * Get the Youtube Video id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function youtube(str) {
  // shortcode
  var shortcode = /youtube:\/\/|https?:\/\/youtu\.be\/|http:\/\/y2u\.be\//g;

  if (shortcode.test(str)) {
    var shortcodeid = str.split(shortcode)[1];
    return stripParameters(shortcodeid);
  }

  // /v/ or /vi/
  var inlinev = /\/v\/|\/vi\//g;

  if (inlinev.test(str)) {
    var inlineid = str.split(inlinev)[1];
    return stripParameters(inlineid);
  }

  // v= or vi=
  var parameterv = /v=|vi=/g;

  if (parameterv.test(str)) {
    var arr = str.split(parameterv);
    return arr[1].split('&')[0];
  }

  // v= or vi=
  var parameterwebp = /\/an_webp\//g;

  if (parameterwebp.test(str)) {
    var webp = str.split(parameterwebp)[1];
    return stripParameters(webp);
  }

  // embed
  var embedreg = /\/embed\//g;

  if (embedreg.test(str)) {
    var embedid = str.split(embedreg)[1];
    return stripParameters(embedid);
  }

  // ignore /user/username pattern
  var usernamereg = /\/user\/([a-zA-Z0-9]*)$/g;

  if (usernamereg.test(str)) {
    return undefined;
  }

  // user
  var userreg = /\/user\/(?!.*videos)/g;

  if (userreg.test(str)) {
    var elements = str.split('/');
    return stripParameters(elements.pop());
  }

  // attribution_link
  var attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/;

  if (attrreg.test(str)) {
    return str.match(attrreg)[1];
  }
}

/**
 * Get the VideoPress id.
 * @param {string} str - the url from which you want to extract the id
 * @returns {string|undefined}
 */
function videopress(str) {
  var idRegex;
  if (str.indexOf('embed') > -1) {
    idRegex = /embed\/(\w{8})/;
    return str.match(idRegex)[1];
  }

  idRegex = /\/v\/(\w{8})/;

  var match = str.match(idRegex);

  if (match && match.length > 0) {
    return str.match(idRegex)[1];
  }
  return undefined;
}

/**
 * Strip away any parameters following `?` or `/`
 * @param str
 * @returns {*}
 */
function stripParameters(str) {
  // Split parameters or split folder separator
  if (str.indexOf('?') > -1) {
    return str.split('?')[0];
  } else if (str.indexOf('/') > -1) {
    return str.split('/')[0];
  }
  return str;
}
