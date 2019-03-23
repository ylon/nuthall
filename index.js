module.exports = {
  rarbg: (...args) => new (require('./lib/sources/Rarbg'))(...args),
  Torrent: require('./lib/Torrent'),
  torrentSearchApi: () => require('torrent-search-api'),
  Transmission: require('./lib/Transmission'),
  yggtorrent: (...args) => new (require('./lib/sources/Yggtorrent'))(...args),
  Yggtorrent: require('./lib/sources/Yggtorrent')
};
