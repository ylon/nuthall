/*
const URL = require('url').URL;
url= new URL(url)
url.hostname='ww3.yggtorrent.is'
console.log(url.href);
*/

const format = require('string-format');
const H = require('./H');

class Yggtorrent {
  constructor() {
    require('yggtorrent-auth');
    // this.torrentSearch = new(require('torrent-search-api'))()
    // this.torrentSearch = new(require('../../torrent-search-api-0.2'))()
    // this.torrentSearch = new (require('../../ylon.torrent-search-api'))();
    this.torrentSearch = new (require('ylon.torrent-search-api'))();
    this.torrentSearch.enableProvider(
      'Yggtorrent',
      YGGTORRENT_USER,
      YGGTORRENT_PASS
    );
    this.ygg = this.torrentSearch._getProvider('Yggtorrent');
  }

  search(query, category, limit) {
    limit = limit ? parseInt(limit) : null;
    return this.torrentSearch
      .search(query, category, limit)
      .then(torrents => this.format_torrents(torrents));
  }

  search_serie(query, limit) {
    return this.search(query, 'TV', limit);
  }

  last(category, limit) {
    limit = limit ? parseInt(limit) : null;
    return this.torrentSearch
      .last(category, limit)
      .then(torrents => this.format_torrents(torrents));
  }

  last_presse(limit) {
    return this.last('Presse', limit);
  }

  format_torrents(torrents) {
    for (let t of torrents) {
      t.source = 'yggtorrent';
      t.id = H.re_firstMatch(t.link, /id=(\d+)/);
      t.prez = t.desc;
      t.size_MB = H.filesize_MB(t.size);
      t.size = 1024 * 1024 * t.size_MB;
      t.category = H.re_firstMatch(t.desc, /\/torrent\/(.+)\/[^\/]+/);
      delete t.provider;
      delete t.desc;
    }
    return torrents;
  }

  download(arg, file = null) {
    var torrent = {
      provider: 'Yggtorrent',
      link: (arg => {
        switch (typeof arg) {
          case 'object':
            if (arg.link) return arg.link;
            if (arg.id) return this.torrent_link_from_id(arg.id);
          case 'string':
            if (/^https?:/i.test(arg)) return arg;
            if (/^\d+$/.test(arg)) return this.torrent_link_from_id(arg);
          default:
            return null;
        }
      })(arg)
    };
    return this.torrentSearch.downloadTorrent(torrent, file);
  }

  torrent_link_from_id(id) {
    return (
      this.ygg.scrapeDatas.baseUrl +
      format('/engine/download_torrent?id={id}', {
        id: id
      })
    );
  }
}
module.exports = Yggtorrent;
