const fs = require('fs-extra');
const parseTorrent = require('parse-torrent');

/* represents a local torrent file on the FS */
module.exports = class TorrentFile {
  constructor(path) {
    this.path = path;
    this._metainfo;
  }

  static async fromPath(file) {
    var torrent = new TorrentFile(file);
    await torrent.loadMetainfo();
    return torrent;
  }

  async loadMetainfo() {
    if (!this._metainfo) {
      this._metainfo = parseTorrent(await fs.readFile(this.path));
    }
    return this._metainfo;
  }

  metainfo() {
    return this._metainfo;
  }

  hash(casename = 'UPPER') {
    var hash = this.metainfo.infoHash;
    switch (casename) {
      case 'UPPER':
        return hash.toUpperCase();
        break;
      case 'LOWER':
        return hash.toLowerCase();
        break;
    }
  }

  hashUpper() {
    return this.hash('UPPER');
  }

  hashLower() {
    return this.hash('LOWER');
  }

  files() {
    return this.metainfo().files;
  }

  async copy(file) {}
  async hardlink(file) {}
  async symlink(file) {}
};
