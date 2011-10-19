exports.requiresLogin = (req, res, next) ->
  url = req.url.split('/')[1]
  sessionUrl = req.session?.url
  if sessionUrl? and url is sessionUrl then next() else res.redirect '/login'

dynamicSort = (property) ->
  func = (a, b) ->
    return -1 if (a[property] < b[property])
    return 1 if (a[property] > b[property])
    return 0
  return func

exports.ascBy = ascBy = (arr, property) ->
  return arr.sort(dynamicSort(property))

exports.descBy = descBy = (arr, property) ->
  return arr.sort(dynamicSort(property)).reverse()
  
crypto = require 'crypto'
sanitize = require("validator").sanitize

auth_key = '1580cee65f904f7399ca08a1a844cfab'
auth_secret = '61b3703ab1a24f1b8be97b73dc2b33c50a2260a0'
template_id = 'b902f75dba8a4fadb054ab068e705b97'

exports.getUploadParams = getUploadParams = (doneUrl) ->
  dn = new Date()
  # CDT is UTC - 5 hours, Pacific PDT is UTC -7, 7 hours and 10 mins in milliseconds 
  d = new Date(dn.getTime() + 25200000 + 600000) 
  cDay = d.getDate().toString()
  cDay = "0" + cDay if cDay.length is 1
  cMonth = d.getMonth().toString()
  cMonth++
  cMonth = "0" + cMonth if cMonth.length is 1
  cYear = d.getFullYear().toString()
  cHours = d.getHours()
  cHours = "0" + cHours if cHours.length is 1
  cMinutes = d.getMinutes().toString()
  cMinutes = "0" + cMinutes if cMinutes.length is 1
  cSeconds = d.getSeconds().toString()
  cSeconds = "0" + cSeconds if cSeconds.length is 1
  expiration = cYear + "/" + cMonth + "/" + cDay + " " + cHours + ":" + cMinutes + ":" + cSeconds
  params = 
    auth:
      expires: expiration
      key: auth_key
    template_id: template_id
    redirect_url: doneUrl

  paramsStr = JSON.stringify(params)
  encodedParams = sanitize(paramsStr).entityEncode()
  hash = crypto.createHmac("sha1", auth_secret).update(paramsStr).digest("hex")
  [encodedParams, paramsStr, hash]

getUploadParams("2011/11/01 16:53:14", "http://localhost:3000/test/done")
S3File = (require './s3file').S3File
CSV2JS = require './CSV2JS'
toJS = CSV2JS.csvToJs
DataColl = (require '../models/commonModels').DataColl
request = require("request")
FileUpload = (require '../models/commonModels').FileUpload
fileUpload = new FileUpload
DataGen = (require "../utils/dataGen").DataGen

exports.parseFile = parseFile = (collectionName, url) ->
  # if the status is complete, get the amazon file, parse the file, store results in mongoDB
  request url, (error, response, body) =>
    console.log error if error
    if not error and response.statusCode == 200
      result = JSON.parse(body)
      s3url = result.results[':original'][0].url
      arrurl = s3url.split('/')
      account = arrurl[3]
      fileName = '/' + arrurl[4] + '/' + arrurl[5]
      s = arrurl[5].split('.')[0]
      collectionName += s[0].toUpperCase() + s[1..s.length]
      console.log collectionName
      s3 = new S3File account, fileName
      s3.get (err, res) =>
        if err
          console.log err
        else 
          parsedRet = toJS res
          console.log "Parse Error: ", parsedRet.error, parsedRet.message if parsedRet.error
          dataColl = new DataColl collectionName, id: ' '
          dataColl.save parsedRet.data, (err, success) =>
            console.log "Saved data after parsing the file uploaded: #{url}"
            # May be instead of remove we need to move it to archive
            fileUpload.remove {assembly_url: url}, (err, success) ->
              if err then console.log err else console.log "removed row"

exports.saveDonorsView = (numRows, url, callback) ->
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
  dataGen = new (require "../utils/dataGen").DataGen columns, numRows, transforms
  data = dataGen.generateData()
  dataGen.saveData url + 'DonorView', data, (err, result) ->
    callback err, result if callback?

exports.saveDonors = (numRows, url, callback) ->
  maleNames = ['James','John','Robert','Michael','William','David','Richard','Charles','Joseph','Thomas','Christopher','Daniel','Paul','Mark','Donald','George','Kenneth','Steven','Edward','Brian','Ronald','Anthony','Kevin','Jason','Matthew','Gary','Timothy','Jose','Larry','Jeffrey','Frank','Scott','Eric','Stephen','Andrew','Raymond','Gregory','Joshua','Jerry','Dennis','Walter','Patrick','Peter','Harold','Douglas','Henry','Carl','Arthur','Ryan','Roger','Joe','Juan','Jack','Albert','Jonathan','Justin','Terry','Gerald','Keith','Samuel','Willie','Ralph','Lawrence','Nicholas','Roy','Benjamin','Bruce','Brandon','Adam','Harry','Fred','Wayne','Billy','Steve','Louis','Jeremy','Aaron','Randy','Howard','Eugene','Carlos','Russell','Bobby','Victor','Martin','Ernest','Phillip','Todd','Jesse','Craig','Alan','Shawn','Clarence','Sean','Philip','Chris','Johnny','Earl','Jimmy','Antonio','Danny','Bryan','Tony','Luis','Mike','Stanley','Leonard','Nathan','Dale','Manuel','Rodney','Curtis','Norman','Allen','Marvin','Vincent','Glenn','Jeffery','Travis','Jeff','Chad','Jacob','Lee','Melvin','Alfred','Kyle','Francis','Bradley','Jesus','Herbert','Frederick','Ray','Joel','Edwin','Don','Eddie','Ricky','Troy','Randall','Barry','Alexander','Bernard','Mario','Leroy','Francisco','Marcus','Micheal','Theodore','Clifford','Miguel','Oscar','Jay','Jim','Tom','Calvin','Alex','Jon','Ronnie','Bill','Lloyd','Tommy','Leon','Derek','Warren','Darrell','Jerome','Floyd','Leo','Alvin','Tim','Wesley','Gordon','Dean','Greg','Jorge','Dustin','Pedro','Derrick','Dan','Lewis','Zachary','Corey','Herman','Maurice','Vernon','Roberto','Clyde','Glen','Hector','Shane','Ricardo','Sam','Rick','Lester','Brent','Ramon','Charlie','Tyler','Gilbert','Gene','Marc','Reginald','Ruben','Brett','Angel','Nathaniel','Rafael','Leslie','Edgar','Milton','Raul','Ben','Chester','Cecil','Duane','Franklin','Andre','Elmer','Brad','Gabriel','Ron','Mitchell','Roland','Arnold','Harvey','Jared','Adrian','Karl','Cory','Claude','Erik','Darryl','Jamie','Neil','Jessie','Christian','Javier','Fernando','Clinton','Ted','Mathew','Tyrone','Darren','Lonnie','Lance','Cody','Julio','Kelly','Kurt','Allan','Nelson','Guy','Clayton','Hugh','Max','Dwayne','Dwight','Armando','Felix','Jimmie','Everett','Jordan','Ian','Wallace','Ken','Bob','Jaime','Casey','Alfredo','Alberto','Dave','Ivan','Johnnie','Sidney','Byron','Julian','Isaac','Morris','Clifton','Willard','Daryl','Ross','Virgil','Andy','Marshall','Salvador','Perry','Kirk','Sergio','Marion','Tracy','Seth','Kent','Terrance','Rene','Eduardo','Terrence','Enrique','Freddie','Wade']
  surNames =['Smith','Johnson','Williams','Brown','Jones','Miller','Davis','Garcia','Rodriguez','Wilson','Martinez','Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez','Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young','Allen','Sanchez','Wright','King','Scott','Green','Baker','Adams','Nelson','Hill','Ramirez','Campbell','Mitchell','Roberts','Carter','Phillips','Evans','Turner','Torres','Parker','Collins','Edwards','Stewart','Flores','Morris','Nguyen','Murphy','Rivera','Cook','Rogers','Morgan','Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox','Diaz','Richardson','Wood','Watson','Brooks','Bennett','Gray','James','Reyes','Cruz','Hughes','Price','Myers','Long','Foster','Sanders','Ross','Morales','Powell','Sullivan','Russell','Ortiz','Jenkins','Gutierrez','Perry','Butler','Barnes','Fisher','Henderson','Coleman','Simmons','Patterson','Jordan','Reynolds','Hamilton','Graham','Kim','Gonzales','Alexander','Ramos','Wallace','Griffin','West','Cole','Hayes','Chavez','Gibson','Bryant','Ellis','Stevens','Murray','Ford','Marshall','Owens','Mcdonald','Harrison']
  nameCount = maleNames.length
  surnameCount = surNames.length
  columns = 
    ID:'auto'
    name: 'string function getName'
    email: 'string function getEmail'
  transforms =
    getName: ->
      idx = Math.floor(Math.random()*nameCount)
      idx2 = Math.floor(Math.random()*surnameCount)
      maleNames[idx] + ' ' + surNames[idx2]
    getEmail: ->
      idx = Math.floor(Math.random()*nameCount)
      idx2 = Math.floor(Math.random()*surnameCount)
      maleNames[idx] + '@' + surNames[idx2] + ".com"
  dataGen = new DataGen columns, numRows, transforms
  data = dataGen.generateData()
  dataGen.saveData url + 'Donors', data, (err, result) ->
    callback err, result if callback?

exports.saveDonorsHistory = (numRows, url, callback) ->
  columns = 
    ID:'auto'
    donorID: 'number function getDonorID'
    dateDonated: 'date random 365'
    amount: 'number function getAmount'
  transforms =
    getDonorID: ->
      donorID = Math.floor(Math.random()*numRows)
    getAmount: ->
      amount = Math.floor(Math.random()*1000)
      donation = amount
      donation = amount*50 if amount%100 is 0
      donation = amount*10 if amount%20 is 0
      donation
  dataGen = new DataGen columns, numRows, transforms
  data = dataGen.generateData()
  dataGen.saveData url + 'DonorsHistory', data, (err, result) ->
    callback err, result if callback?

exports.getDonorViewChart = (url, callback) ->
  dataColl = new DataColl url + 'DonorView', id: ' '
  dataColl.getAll (err, data) ->
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
    callback err, chartData

exports.getCollDataAsCSV = (collectionName, url, callback) ->
  dataColl = new DataColl url + collectionName, id: ' '
  dataColl.getAll (err, data) ->
    str = convertToCSV data
    callback err, str if callback?

convertToCSV = (objArray) ->
  array = (if typeof objArray isnt "object" then JSON.parse(objArray) else objArray)
  str = ""
  i = 0
  obj = array[0] if array.length > 0
  for key, value of obj
    str += key + ","
  str = str[0..str.length-2] + "\r\n"
  while i < array.length
    line = ""
    for index of array[i]
      line += ","  unless line is ""
      line += array[i][index]
    str += line + "\r\n"
    i++
  str