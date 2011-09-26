(function() {
  var DB, app, collectionName, db, express, parseFile;
  express = require("express");
  DB = (require("./db")).DB;
  collectionName = 'transloadit';
  db = new DB(collectionName);
  app = module.exports = express.createServer();
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'jade');
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'lasa'
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/../public'));
  });
  app.get("/", function(req, res) {
    return res.render('test');
  });
  app.post("/filesready", function(req, res) {
    return console.log(req.params.transloadit);
  });
  app.get("/done", function(req, res) {
    var data;
    data = req.query;
    return db.insert(data, function(err, success) {
      return res.end(JSON.stringify(data));
    });
  });
  app.listen(3000);
  console.log("Express app started on port 3000");
  parseFile = function(url) {
    return console.log(url);
  };
  setInterval(function() {
    return db.find({}, function(err, docs) {
      var doc, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        _results.push(parseFile(doc.assembly_url));
      }
      return _results;
    });
  }, 5000);
}).call(this);
