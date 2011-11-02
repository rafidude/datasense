DB = (require "../models/db").DB
DataColl = (require '../models/commonModels').DataColl

getAllRows = (coll, callback)->
  coll.find {}, (err, docs) =>
    collName = coll.collectionName
    data = {}
    data['key'] = collName 
    data['docs'] = docs
    callback null, data

getData = (collections, callback) ->
  db1 = {}
  total = collections.length
  count = 0
  for collectionName in collections
    coll = new DB collectionName
    getAllRows coll, (err, data) ->
      count++
      db1[data.key] = data.docs
      callback null, db1 if count is total

exports.populateData = (viewDef, callback) ->
  getData viewDef.from, (err, data) ->
    rows = getView data, viewDef
    dataRows = []
    for key, row of rows
      dataRows.push row
    dataColl = new DataColl viewDef.name, id: ' '
    dataColl.removeAll =>
      dataColl.save dataRows, (err, result) =>
        if err
          console.log "Error saving data in a view: ", err 
          callback err, null
        else
          dataColl.count (err, count) =>
            if err then console.log "Parse Count: " + err
            console.log "Saved #{count} rows to #{viewDef.name} collection."
            callback null, dataRows

getView = (data, viewDef) ->
  rows = {}
  key = viewDef.keys[0]
  fields = viewDef.fields
  for calc in viewDef.calculatedFields
    fields.push calc.as
  # Loop through each collection
  for coll in viewDef.from
    # Loop through each row in the collection
    for row in data[coll]
      # Assign a key to each row
      rowObj = rows[row[key]]
      obj = {}
      if rowObj
        # If a key exists simply append the columns
        obj = rowObj
        # Merge new keys into existing ones
        for k, v of row
          obj[k] = v
          for calc in viewDef.calculatedFields
            if k is calc.on
              switch calc.function 
                when 'sum'
                  if obj[calc.as] then obj[calc.as] += obj[k] else obj[calc.as] = obj[k]
                when 'count'
                  if obj[calc.as] then obj[calc.as] += 1 else obj[calc.as] = 1
      else
        # If there is no key just assign the row for the key
        obj = row
      # delete all properties not needed in the view
      for k, v of obj
        delete obj[k] if fields.indexOf(k) is -1
      rows[row[key]] = obj
  rows