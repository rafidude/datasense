(function() {
  var FileUpload, app, express, fileUpload, getOrgs, orgs, port, utils;
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
  orgs = [];
  getOrgs = function() {
    return orgs = ['bmcm', 'rfp'];
  };
  getOrgs();
  app.get("/upload", function(req, res) {
    return res.render('upload');
  });
  require('./accountlogin')(app);
  require('./dashboard')(app);
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
