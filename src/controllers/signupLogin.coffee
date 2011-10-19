User = (require '../models/commonModels').User

module.exports = (app) ->
  app.get "/", (req, res) ->
    url = req.session.url
    if url? then res.redirect '#{url}/charts' else res.render 'login'

  app.get "/login", (req, res) ->
    res.render 'login'

  app.post "/login", (req, res) ->
    email = req.body.data.email
    password = req.body.data.password
    userI = new User email
    userI.get (err, user) ->
      throw err if err
      if user and user.password is password
        req.session.url = user.url
        url = "/#{user.url}/charts"
        res.redirect url
      else
        res.redirect '/login'

  app.get "/newaccount", (req, res) ->
    res.render 'newaccount'

  app.post "/newaccount", (req, res) ->
    data = req.body.data
    user = new User
    user.save data, (err, success) ->
      res.redirect '/login'