ParsedData = (require '../models/commonModels').ParsedData

exports.DataGen = class DataGen
  constructor: (@definition, @dataRows = 10, @transforms = null) ->
  
  generateData: ->
    today = new Date()
    data = []
    for row in [0..@dataRows-1]
      rowData = {}
      for key, val of @definition
        colAttr = val.split(' ')
        switch colAttr[0]
          when 'auto' then rowData[key] = row + 1
          when 'string'
            switch colAttr[1]
              when 'function' then rowData[key] = @transforms[colAttr[2]]()
              else
                console.log "Error: #{colAttr} #{key} #{val}"
          when 'number'
            switch colAttr[1]
              when 'random' then rowData[key] = Math.floor(Math.random()*colAttr[2])
              when 'function' then rowData[key] = @transforms[colAttr[2]]()
              else
                console.log "Error: #{colAttr} #{key} #{val}"
          when 'date'
            switch colAttr[1]
              when 'random'
                day = Math.floor(Math.random()*colAttr[2])
                daysAgo = new Date().setDate(today.getDate()-day)
                rowData[key] = daysAgo
              else
                console.log "Error: #{colAttr} #{key} #{val}"
          else
            console.log "Error: #{colAttr[0]} #{key} #{val}"
      data.push rowData
    data
  
  saveData: (data, callback) ->
    parsedData = new ParsedData
    parsedData.removeAll =>
      parsedData.save data, (err, result) =>
        callback err, result
