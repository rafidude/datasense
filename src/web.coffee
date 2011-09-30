express = require("express")
FileUpload = (require './commonModels').FileUpload
fileUpload = new FileUpload
utils = (require './dutils')
ParsedData = (require './commonModels').ParsedData

app = module.exports = express.createServer()
app.set 'views', __dirname + '/../views'
app.set 'view engine', 'jade'
app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session secret: 'lasa'
  app.use express.static __dirname + '/../public'
  app.use app.router

app.get "/", (req, res) ->
  res.render 'test'

app.post "/filesready", (req, res) ->
  console.log req.params.transloadit

app.get "/done", (req, res) ->
  data = req.query
  fileUpload.save data, (err, success) ->
    res.end JSON.stringify(data)

app.get "/generatedata/:rows?", (req, res) ->
  rows = req.params.rows
  if not rows? and isNaN parseInt(rows) then rows = 100 else rows = parseInt(rows)
  maleNames = ['James','John','Robert','Michael','William','David','Richard','Charles','Joseph','Thomas','Christopher','Daniel','Paul','Mark','Donald','George','Kenneth','Steven','Edward','Brian','Ronald','Anthony','Kevin','Jason','Matthew','Gary','Timothy','Jose','Larry','Jeffrey','Frank','Scott','Eric','Stephen','Andrew','Raymond','Gregory','Joshua','Jerry','Dennis','Walter','Patrick','Peter','Harold','Douglas','Henry','Carl','Arthur','Ryan','Roger','Joe','Juan','Jack','Albert','Jonathan','Justin','Terry','Gerald','Keith','Samuel','Willie','Ralph','Lawrence','Nicholas','Roy','Benjamin','Bruce','Brandon','Adam','Harry','Fred','Wayne','Billy','Steve','Louis','Jeremy','Aaron','Randy','Howard','Eugene','Carlos','Russell','Bobby','Victor','Martin','Ernest','Phillip','Todd','Jesse','Craig','Alan','Shawn','Clarence','Sean','Philip','Chris','Johnny','Earl','Jimmy','Antonio','Danny','Bryan','Tony','Luis','Mike','Stanley','Leonard','Nathan','Dale','Manuel','Rodney','Curtis','Norman','Allen','Marvin','Vincent','Glenn','Jeffery','Travis','Jeff','Chad','Jacob','Lee','Melvin','Alfred','Kyle','Francis','Bradley','Jesus','Herbert','Frederick','Ray','Joel','Edwin','Don','Eddie','Ricky','Troy','Randall','Barry','Alexander','Bernard','Mario','Leroy','Francisco','Marcus','Micheal','Theodore','Clifford','Miguel','Oscar','Jay','Jim','Tom','Calvin','Alex','Jon','Ronnie','Bill','Lloyd','Tommy','Leon','Derek','Warren','Darrell','Jerome','Floyd','Leo','Alvin','Tim','Wesley','Gordon','Dean','Greg','Jorge','Dustin','Pedro','Derrick','Dan','Lewis','Zachary','Corey','Herman','Maurice','Vernon','Roberto','Clyde','Glen','Hector','Shane','Ricardo','Sam','Rick','Lester','Brent','Ramon','Charlie','Tyler','Gilbert','Gene','Marc','Reginald','Ruben','Brett','Angel','Nathaniel','Rafael','Leslie','Edgar','Milton','Raul','Ben','Chester','Cecil','Duane','Franklin','Andre','Elmer','Brad','Gabriel','Ron','Mitchell','Roland','Arnold','Harvey','Jared','Adrian','Karl','Cory','Claude','Erik','Darryl','Jamie','Neil','Jessie','Christian','Javier','Fernando','Clinton','Ted','Mathew','Tyrone','Darren','Lonnie','Lance','Cody','Julio','Kelly','Kurt','Allan','Nelson','Guy','Clayton','Hugh','Max','Dwayne','Dwight','Armando','Felix','Jimmie','Everett','Jordan','Ian','Wallace','Ken','Bob','Jaime','Casey','Alfredo','Alberto','Dave','Ivan','Johnnie','Sidney','Byron','Julian','Isaac','Morris','Clifton','Willard','Daryl','Ross','Virgil','Andy','Marshall','Salvador','Perry','Kirk','Sergio','Marion','Tracy','Seth','Kent','Terrance','Rene','Eduardo','Terrence','Enrique','Freddie','Wade']
  surNames =['Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson','Martinez','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson','Hill','Ramirez','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook','Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson','Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price','Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan','Russell','Ortiz','Jenkins','Gutierrez','Perry','Butler','Barnes','Fisher','Henderson','Coleman','Simmons','Patterson','Jordan','Reynolds','Hamilton','Graham','Kim','Gonzales','Alexander','Ramos','Wallace','Griffin','West','Cole','Hayes','Chavez','Gibson','Bryant','Ellis','Stevens','Murray','Ford','Marshall','Owens','Mcdonald','Harrison']
  nameCount = maleNames.length
  surnameCount = surNames.length
  columns = 
    ID:'auto'
    memberID: 'number random 1000'
    name: 'string function getName'
    dateDonated: 'date random 365'
    amount: 'number function getAmount'
  transforms =
    getName: ->
      idx = Math.floor(Math.random()*nameCount)
      idx2 = Math.floor(Math.random()*surnameCount)
      maleNames[idx] + ' ' + surNames[idx2]
    getAmount: ->
      amount = Math.floor(Math.random()*1000)
      donation = amount
      donation = amount*50 if amount%100 is 0
      donation = amount*10 if amount%20 is 0
      donation
  console.log rows
  dataGen = new (require "./dataGen").DataGen columns, rows, transforms
  data = dataGen.generateData()
  dataGen.saveData data, (err, result) ->
    res.redirect "/charts"
    
setInterval ->
    fileUpload.getAll (err, docs) ->
      # console.log docs
      utils.parseFile(doc.assembly_url) for doc in docs
  , 5000

app.listen 3000
console.log "Express app started on port 3000"
process.on 'uncaughtException', ->
  console.log 'Uncaught Exception: %s', err.message

app.get "/charts", (req, res) ->  
  parsedData = new ParsedData
  parsedData.getAll (err, data) ->
    for obj in data
      d = new Date(obj.dateDonated)
      curr_date = d.getDate()
      curr_month = d.getMonth()
      curr_month++
      curr_year = d.getFullYear()
      obj.date = curr_month + "/" + curr_date + "/" + curr_year
    top = req.query.top
    if top?
      pctPos = -1
      totalRows = data.length
      pctPos = top.indexOf("p")
      if  pctPos > -1
        top = top.slice(0, pctPos)
        top = -1 if isNaN parseInt(top)
        if top >=0 and top <= 100 then top = Math.ceil(totalRows * top/100) else top = -1
      else
        if isNaN parseInt(top) then top = -1 else top = parseInt(top)
      #splice the data
      if top != -1
        descBy(data, "amount")
        data.splice(top)
    top = null if top is -1
    res.render "table", data: data, top: top

app.get "/donations", (req, res) ->
  parsedData = new ParsedData
  parsedData.getAll (err, data) ->
    donationsArray = []
    for obj in data
      donationsArray.push obj.amount
    mult = 100
    x = (num*mult for num in [1..10])
    y = (0 for num in [1..10])
    for item in donationsArray
      for num in [0..9]
        y[num]++ if num*mult < item <= (num + 1)*mult
    chartData = {x: x, y: y}
    msgs_json = JSON.stringify(chartData)
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(msgs_json)

dynamicSort = (property) ->
  func = (a, b) ->
    return -1 if (a[property] < b[property])
    return 1 if (a[property] > b[property])
    return 0
  return func

ascBy = (arr, property) ->
  return arr.sort(dynamicSort(property))

descBy = (arr, property) ->
  return arr.sort(dynamicSort(property)).reverse()