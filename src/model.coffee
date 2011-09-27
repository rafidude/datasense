DB = (require "./db").DB

exports.Model = class Model
  constructor: (collectionName, @criteria) ->
    @db = new DB collectionName

  get: (callback) =>
    @db.findOne @criteria, (err, result) ->
      if err then callback err, null else callback null, result

  getAll: (callback) =>
    @db.find {}, (err, result) ->
      if err then callback err, null else callback null, result

  save: (object, callback) =>
    @db.insert object, (err, result) ->
      if err then callback err, null else callback null, result if callback?
  
  removeAll: (callback) =>
    @db.removeAll (success) ->
      callback() if callback?
      
  remove: (criteria, callback) =>
    @db.remove (err, success) ->
      callback() if callback?
