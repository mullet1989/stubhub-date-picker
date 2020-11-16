const DELIMITER = '-';
const TIMESUFFIX = 'T00:00';

const cache = {
  1: '0',
  2: '00'
};

function padZeros(n, td) {
  var ns = n.toString(), l = ns.length, z = '';
  if (td > l) {
    z = cache[td - l];
  }
  return z + ns;
}

// return a yyyy-mm-dd format for date d;
function yyyymmdd(d) {
  return d.getFullYear() + DELIMITER +
			padZeros(d.getMonth() + 1, 2) + DELIMITER +
			padZeros(d.getDate(), 2);
}
// return a yyyy-mm-ddThh:mm:ssZ format for date d;
function yyyymmddhhmmss (d) {
  return yyyymmdd(d) + "T" +
			padZeros(d.getHours(), 2) + ":" +
			padZeros(d.getMinutes(), 2) + ":" +
			padZeros(d.getSeconds(), 2) + "Z";
}

class DateTimeFormat {
  // TODO more format support
  static toAPIString(date/**, format = 'YYYY-MM-dd'**/, suffix = TIMESUFFIX) {

    if (!date) {
      return '';
    }
    return yyyymmdd(new Date(date)) + suffix;
  }

  static now() {
    var d = new Date();
    return yyyymmddhhmmss(d);
  }
}

export default DateTimeFormat;
