(function() {
  var app, express, port, utils;
  express = require("express");
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
  app.get("*", function(req, res, next) {
    var sessionUrl, url, _ref;
    if (req.url === "/" || req.url === "/login" || req.url === "/newaccount" || req.url === "/favicon.ico") {
      return next();
    } else {
      url = req.url.split('/')[1];
      sessionUrl = (_ref = req.session) != null ? _ref.url : void 0;
      if (req.headers.host.substring(0, 9) === 'localhost') {
        sessionUrl = 'test';
      }
      if ((sessionUrl != null) && url === sessionUrl) {
        return next();
      } else {
        return res.redirect('/login');
      }
    }
  });
  require('./signupLogin')(app);
  require('./dashboard')(app);
  require('./uploadProcess')(app);
  port = process.env.PORT || 3000;
  if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d", app.address().port);
  }
  process.on('uncaughtException', function() {
    return console.log('Uncaught Exception: %s', err.message);
  });
}).call(this);
