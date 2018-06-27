var filesizeParser = require('filesize-parser');

H = {};
module.exports = H;

// human to bytes
H.filesize_parse = string => {
  return filesizeParser(string);
};

/*
size: number of bytes | human string size
return int
*/
H.filesize_MB = size => {
  if (typeof size == 'string') {
    size = size.toUpperCase();
    size.replace('O', 'B');
    size = H.filesize_parse(size);
  }
  return Math.floor(size / 1024 / 1024);
};

H.re_firstMatch = (data, re) => {
  var m = re.exec(data);
  return m != null && m.length > 0 ? m[1] : null;
};
