const jsonfile = require('jsonfile');
const Source = require('../Source');

var reHashFromMagnet = new RegExp('btih:([0-9A-F]{40})', 'i');

module.exports = class Rarbg extends Source {
  constructor() {
    super('rarbg');
    this.torrentSearch = require('torrent-search-api');
    this.torrentSearch.enableProvider('Rarbg');
  }

  formatTorrent(torrent) {
    let m = reHashFromMagnet.exec(torrent.magnet);
    if (m) torrent.hash = m[1].toUpperCase();
    torrent.name = torrent.title;
    return torrent;
  }

  searchSerie(string, file = null) {
    var search = { string: string, toFile: file };
    return this.torrentSearch
      .search(search.string, 'TV')
      .then(torrents => this.formatTorrents(torrents))
      .then(torrents => {
        if (search.toFile) {
          return jsonfile.writeFile(search.toFile, torrents, {
            spaces: 4
          });
        } else {
          return torrents;
        }
      });
  }
};
