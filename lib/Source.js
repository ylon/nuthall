module.exports = class Source {
  constructor(name) {
    this.name = name;
  }

  download(arg) {}

  formatTorrent(torrent) {
    return torrent;
  }

  formatTorrents(torrents) {
    return torrents.map(torrent => this.formatTorrent(torrent));
  }

  searchSerie(search = {}) {}
};
