User = (require '../models/commonModels').User

module.exports = (app) ->
  app.get "/", (req, res) ->
    res.render 'login'

  app.get "/login", (req, res) ->
    res.render 'login'

  app.post "/login", (req, res) ->
    email = req.body.data.email
    password = req.body.data.password
    userI = new User email
    userI.get (err, user) ->
      throw err if err
      if user and user.password is password
        req.session.user = user
        res.redirect req.body.redir or '/charts'
      else
        res.redirect '/', locals: redir: req.body.redir

  app.get "/newaccount", (req, res) ->
    res.render 'newaccount'

  app.post "/newaccount", (req, res) ->
    data = req.body
    user = new User
    user.save data, (err, success) ->
      res.end JSON.stringify(data)
