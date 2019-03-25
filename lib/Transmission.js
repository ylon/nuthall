const Powersteer = require('powersteer');

module.exports = class Transmission {
  constructor(conf) {
    //console.log(conf)
    this.transmissionRPC = new Powersteer({
      url: `http://${conf.host}:${conf.port}${conf.path}`,
      username: conf.user,
      password: conf.pass
    });
  }

  addFile(file, opts = {}) {
    opts.filename = file;
    return this.transmissionRPC.torrentAdd(opts);
  }

  addMeta(metainfo, opts = {}) {
    opts.metainfo = metainfo;
    return this.transmissionRPC.torrentAdd(opts);
  }

  remove(hash, delete_data = true) {
    return this.transmissionRPC.torrentRemove({
      ids: [hash],
      'delete-local-data': delete_data
    });
  }
};
