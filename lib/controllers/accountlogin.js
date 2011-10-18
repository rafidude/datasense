(function() {
  var User;
  User = (require('../models/commonModels')).User;
  module.exports = function(app) {
    app.get("/", function(req, res) {
      var url;
      url = req.session.url;
      if (url) {
        return res.redirect('#{url}/charts');
      } else {
        return res.render('login');
      }
    });
    app.get("/login", function(req, res) {
      return res.render('login');
    });
    app.post("/login", function(req, res) {
      var email, password, userI;
      email = req.body.data.email;
      password = req.body.data.password;
      userI = new User(email);
      return userI.get(function(err, user) {
        var url;
        if (err) {
          throw err;
        }
        if (user && user.password === password) {
          req.session.url = user.url;
          url = "/" + user.url + "/charts";
          return res.redirect(url);
        } else {
          return res.redirect('/', {
            locals: {
              redir: req.body.redir
            }
          });
        }
      });
    });
    app.get("/newaccount", function(req, res) {
      return res.render('newaccount');
    });
    return app.post("/newaccount", function(req, res) {
      var data, user;
      data = req.body.data;
      user = new User;
      return user.save(data, function(err, success) {
        return res.redirect('/login');
      });
    });
  };
}).call(this);
