(function() {
  var FileUpload, app, express, fileUpload, getUrls, port, urls, utils;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  express = require("express");
  FileUpload = (require('../models/commonModels')).FileUpload;
  fileUpload = new FileUpload;
  utils = require('../utils/dutils');
  app = module.exports = express.createServer();
  app.set('views', __dirname + '/../../views');
  app.set('view engine', 'jade');
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'lasa'
    }));
    app.use(express.static(__dirname + '/../../public'));
    return app.use(app.router);
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  urls = [];
  getUrls = function() {
    return urls = ['bmcm', 'rfp'];
  };
  getUrls();
  app.get("*", function(req, res, next) {
    var url, validUrl, _ref;
    if (req.url === "/" || req.url === "/login" || req.url === "/newaccount" || req.url === "/favicon.ico") {} else {
      url = (_ref = req.session) != null ? _ref.url : void 0;
      if (url != null) {
        validUrl = __indexOf.call(urls, url) >= 0;
      }
    }
    return next();
  });
  require('./accountlogin')(app);
  require('./dashboard')(app);
  app.get("/upload", function(req, res) {
    return res.render('upload');
  });
  app.post("/filesready", function(req, res) {
    return console.log(req.params.transloadit);
  });
  app.get("/done", function(req, res) {
    var data;
    data = req.query;
    return fileUpload.save(data, function(err, success) {
      return res.end(JSON.stringify(data));
    });
  });
  setInterval(function() {
    return fileUpload.getAll(function(err, docs) {
      var doc, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        _results.push(utils.parseFile(doc.assembly_url));
      }
      return _results;
    });
  }, 5000);
  port = process.env.PORT || 3000;
  if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d", app.address().port);
  }
  process.on('uncaughtException', function() {
    return console.log('Uncaught Exception: %s', err.message);
  });
}).call(this);
