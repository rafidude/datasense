express = require("express")
FileUpload = (require '../models/commonModels').FileUpload
fileUpload = new FileUpload
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

urls = []
getUrls = ->
  urls = ['bmcm', 'rfp']
getUrls()

app.get "*", (req, res, next) ->
  if req.url is "/" or req.url is "/login" or req.url is "/newaccount" or req.url is "/favicon.ico"
  else
    url = req.session?.url
    if url?
      validUrl = url in urls
  next()

require('./accountlogin')(app)
require('./dashboard')(app)

app.get "/upload", (req, res) ->
  res.render 'upload'

app.post "/filesready", (req, res) ->
  console.log req.params.transloadit

app.get "/done", (req, res) ->
  data = req.query
  fileUpload.save data, (err, success) ->
    res.end JSON.stringify(data)

setInterval ->
    fileUpload.getAll (err, docs) ->
      # console.log docs
      utils.parseFile(doc.assembly_url) for doc in docs
  , 5000

port = process.env.PORT or 3000

unless module.parent
  app.listen port
  console.log "Express server listening on port %d", app.address().port

process.on 'uncaughtException', ->
  console.log 'Uncaught Exception: %s', err.message

