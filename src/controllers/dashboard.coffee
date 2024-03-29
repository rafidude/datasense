DataColl = (require '../models/commonModels').DataColl
utils = (require '../utils/dutils')
DB = (require "../models/db").DB
dbviews = require "../utils/dbviews"

module.exports = (app) ->
  app.get "/:url/alldata", (req, res) ->
    url = req.params.url
    db = new DB ''
    db.getAccountCollections url, (err, data) ->
      columns = []
      for k, v of data[0]
        columns.push k
      res.render "grid", data: data, columns: columns

  app.get "/:url/generatedata/:rows?", (req, res) ->
    rows = req.params.rows
    url = req.params.url
    if not rows? and isNaN parseInt(rows) then rows = 100 else rows = parseInt(rows)
    utils.saveDonors rows, url
    utils.saveDonorsHistory rows, url
    utils.saveDonorsView rows, url, (err, result) ->
      res.redirect "/#{url}/charts"

  app.get "/:url/createview", (req, res) ->
    # The viewStr is parsed into the following viewDef object
    # viewStr = '''select ID, name, sum(amount), count(amount) as total
    # from persons, history
    # groupBy ID, name'''
    viewDef =
      name: 'testDonorReport'
      fields: ['ID', 'name']
      calculatedFields: [{function: 'sum', on:'amount', as:'total'}, 
      {function: 'count', on:'date', as:'count'}],
      from: ['testPersons', 'testHistory']
      join: [{'testPersons.ID':'testHistory.ID'}]
      groupBy: ['ID', 'name']
      keys: ['ID']

    dbviews.populateData viewDef, (err, data) ->
      console.log data
      columns = []
      for k, v of data[0]
        columns.push k
      console.log columns
      res.render "grid", data: data, columns: columns

  app.get "/:url/charts", (req, res) ->  
    url = req.params.url
    dataColl = new DataColl url + 'DonorView', id: ' '
    dataColl.getAll (err, data) ->
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
          utils.descBy(data, "amount")
          data.splice(top)
      top = null if top is -1
      res.render "table", data: data, top: top

  app.get "/:url/charts.json", (req, res) ->
    url = req.params.url
    utils.getDonorViewChart url, (err, chartData) ->
      msgs_json = JSON.stringify(chartData)
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(msgs_json)

  app.get "/:url/donors.csv", (req, res) ->
    url = req.params.url
    utils.getCollDataAsCSV 'Donors', url, (err, csv) ->
      res.writeHead(200, {'Content-Type': 'application/csv'})
      res.end(csv)
