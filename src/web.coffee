express = require("express")
FileUpload = (require '../lib/commonModels').FileUpload
fileUpload = new FileUpload
utils = (require '../lib/dutils')

app = module.exports = express.createServer()
app.set 'views', __dirname + '/../views'
app.set 'view engine', 'jade'
app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session secret: 'lasa'
  app.use app.router
  app.use express.static __dirname + '/../public'

app.get "/", (req, res) ->
  res.render 'test'

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

app.listen 3000
console.log "Express app started on port 3000"
