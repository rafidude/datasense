express = require("express")
utils = (require '../utils/dutils')

app = module.exports = express.createServer()
app.set 'views', __dirname + '/../../views'
app.set 'view engine', 'jade'
app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session secret: 'lasa'
  app.use express.static __dirname + '/../../public'
  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true

app.get "*", (req, res, next) ->
  if req.url is "/" or req.url is "/login" or req.url is "/newaccount" or req.url is "/favicon.ico"
    next()
  else
    url = req.url.split('/')[1]
    sessionUrl = req.session?.url
    sessionUrl = 'test' if req.headers.host.substring(0,9) is 'localhost'
    if sessionUrl? and url is sessionUrl then next() else res.redirect '/login'

require('./signupLogin')(app)
require('./dashboard')(app)
require('./uploadProcess')(app)

port = process.env.PORT or 3000

unless module.parent
  app.listen port
  console.log "Express server listening on port %d", app.address().port

process.on 'uncaughtException', ->
  console.log 'Uncaught Exception: %s', err.message

