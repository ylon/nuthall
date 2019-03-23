const dirname = require('path').dirname;
const fs = require('fs-extra');
const format = require('string-format');
const H = require('../H');
const Source = require('../Source');

const confDefault = { itemsPerPage: 50 };

module.exports = class Yggtorrent extends Source {
  constructor(conf = {}) {
    super('yggtorrent');
    Object.assign(this, confDefault, require('ygg.conf'), conf);
    this.torrentSearch = require('torrent-search-api');
    this.torrentSearch.enableProvider('Yggtorrent', this.user, this.pass);
    this.ygg = this.torrentSearch.getProvider('Yggtorrent');
    if (this.baseUrl) this.ygg.baseUrl = this.baseUrl;
    this.ygg.resultsPerPageCount = this.itemsPerPage;
    this.ygg.categories['LastPresse'] =
      'url:/engine/search?do=search&category=2140&sub_category=2156';
  }

  async download(arg, file = null) {
    var torrent = {
      provider: 'Yggtorrent',
      link: (arg => {
        switch (typeof arg) {
          case 'object':
            if (arg.link) return arg.link;
            if (arg.id) return this.torrentLinkFromId(arg.id);
          case 'string':
            if (/^https?:/i.test(arg)) return arg;
            if (/^\d+$/.test(arg)) return this.torrentLinkFromId(arg);
          default:
            return null;
        }
      })(arg)
    };
    if (file) await fs.ensureDir(dirname(file));
    return this.torrentSearch.downloadTorrent(torrent, file);
  }

  formatTorrent(torrent) {
    torrent.source = this.name;
    torrent.id = H.re_firstMatch(torrent.link, /id=(\d+)/);
    torrent.prez = torrent.desc;
    torrent.size_MB = H.filesize_MB(torrent.size);
    torrent.size = 1024 * 1024 * torrent.size_MB;
    torrent.category = H.re_firstMatch(torrent.desc, /\/torrent\/(.+)\/[^\/]+/);
    delete torrent.provider;
    delete torrent.desc;
    return torrent;
  }

  last(category, limit) {
    limit = limit ? parseInt(limit) : null;
    return this.torrentSearch
      .search('', 'Last' + category, limit)
      .then(torrents => this.formatTorrents(torrents));
  }

  lastPresse(limit) {
    return this.last('Presse', limit);
  }

  search(query, category, limit) {
    limit = limit ? parseInt(limit) : null;
    return this.torrentSearch
      .search(query, category, limit)
      .then(torrents => this.formatTorrents(torrents));
  }

  searchSerie(query, limit) {
    return this.search(query, 'TV', limit);
  }

  pageCount2itemCount(pages = null) {
    return pages && this.itemsPerPage ? pages * this.itemsPerPage : null;
  }

  torrentLinkFromId(id) {
    return `${this.ygg.baseUrl}/engine/download_torrent?id=${id}`;
  }
};
