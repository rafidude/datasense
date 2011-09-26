express = require("express")
DB = (require "./db").DB
collectionName = 'transloadit'
db = new DB collectionName

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
  # res.end req.params.transloadit

app.get "/done", (req, res) ->
  data = req.query
  db.insert data, (err, success) ->
    res.end JSON.stringify(data)

app.listen 3000
console.log "Express app started on port 3000"

parseFile = (url) ->
  console.log url
  # if the status is complete
  # get the amazon file
  # parse the file
  # store results in mongoDB

setInterval ->
    db.find {}, (err, docs) ->
      # console.log docs
      parseFile(doc.assembly_url) for doc in docs
  , 5000
