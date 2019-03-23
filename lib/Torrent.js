const TorrentFile = require('./TorrentFile');

module.exports = class Torrent {
  // returns: (object) torrent metainfo
  static async metainfo(file) {
    return (await TorrentFile.fromPath(file)).metainfo();
  }
};
