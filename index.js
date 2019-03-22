module.exports = {
  yggtorrent: (...args) => new (require('./src/Yggtorrent'))(...args),
  yggtorrentClass: (...args) => require('./src/Yggtorrent')
};
