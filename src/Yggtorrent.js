const dirname = require('path').dirname;
const fs = require('fs-extra');
const format = require('string-format');
const H = require('./H');

module.exports = class Yggtorrent {
  constructor() {
    this.yggConf = require('ygg.conf');
    this.torrentSearch = require('torrent-search-api');
    this.torrentSearch.enableProvider(
      'Yggtorrent',
      this.yggConf.user,
      this.yggConf.pass
    );
    this.ygg = this.torrentSearch.getProvider('Yggtorrent');
    this.ygg.baseUrl = this.yggConf.baseUrl;
    this.ygg.resultsPerPageCount = 50;
    this.ygg.categories['LastPresse'] =
      'url:/engine/search?do=search&category=2140&sub_category=2156';
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
      .search('', 'Last' + category, limit)
      .then(torrents => this.format_torrents(torrents));
  }

  last_presse(limit) {
    return this.last('Presse', limit);
  }

  format_torrents(torrents) {
    return torrents.map(torrent => this.format_torrent(torrent));
  }

  format_torrent(t) {
    t.source = 'yggtorrent';
    t.id = H.re_firstMatch(t.link, /id=(\d+)/);
    t.prez = t.desc;
    t.size_MB = H.filesize_MB(t.size);
    t.size = 1024 * 1024 * t.size_MB;
    t.category = H.re_firstMatch(t.desc, /\/torrent\/(.+)\/[^\/]+/);
    delete t.provider;
    delete t.desc;
    return t;
  }

  async download(arg, file = null) {
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
    await fs.ensureDir(dirname(file));
    return this.torrentSearch.downloadTorrent(torrent, file);
  }

  torrent_link_from_id(id) {
    return (
      this.ygg.baseUrl +
      format('/engine/download_torrent?id={id}', {
        id: id
      })
    );
  }
};
