require.paths.unshift "~/node_modules"
mongodb = require "mongodb"
mongouri = process.env.MONGOLAB_URI
mongouri = "mongodb://localhost/test" if not mongouri #default to localbox

exports.DB = class DB
  constructor: (@collectionName) ->

  connection: (callback) ->
    mongodb.connect mongouri, (err, conn) ->
      if err then callback err, null else callback null, conn
    
  # db.connCollection "collectionName", (err, conn, coll) ->
  connCollection : (callback) ->
    @connection (err, conn) =>
      if err then callback err, null, null
      return if err
      conn.collection @collectionName, (err, coll) ->
        if err then callback err, null, null else callback null, conn, coll

  # SELECT db.find "collectionName", criteria, (err, doc) ->
  find : (criteria, callback) ->
    @connCollection (err, conn, coll) ->
      if err
        callback err, null
      else
        coll.find criteria, (err, cursor) ->
          cursor.toArray (err, docs) ->
            conn.close()
            if err then callback err, null else callback null, docs

  # INSERT db.insert "collectionName", document, (err, success) ->
  insert : (document, callback) ->
    @connCollection (err, conn, coll) ->
      coll.insert document, {safe: true}, (err, success) ->
        conn.close()
        if err then callback err, false else callback null, true

  # INSERT db.insert "collectionName", document, (err, success) ->
  insertAsync : (document, callback) ->
    @connCollection (err, conn, coll) ->
      coll.insert document, (err, success) ->
        conn.close()
        if err then callback err, false else callback null, true

  # UPDATE db.collection.update( criteria, objNew, upsert, multi )
  update : (criteria, document, callback) ->
    @connCollection (err, conn, coll) ->
      coll.update criteria, document, {safe: true}, (err, success) ->
        conn.close()
        if err then callback err, false else callback null, true
  
  # DELETE db.remove "collectionName", criteria, (err, success) ->
  remove : (criteria = null, callback = null) ->
    criteria = {} if not criteria?
    @connCollection (err, conn, coll) ->
      console.log err if err
      coll.remove criteria, {safe: true}, (err, success) ->
        conn.close()
        if err then callback err, false if callback else callback null, true if callback?

  # COUNT db.count "collectionName", criteria, (err, doc) ->
  count : (criteria, callback) ->
    @connCollection (err, conn, coll) ->
      criteria = {} if criteria is null
      coll.count criteria, (err, count) ->
        conn.close()
        if err then callback err, null else callback null, count

  # TOP 1 db.findOne "collectionName", criteria, (err, doc) ->
  findOne : (criteria, callback) ->
    criteria = {} if not criteria
    @connCollection (err, conn, coll) ->
      if err
        callback err, null
      else
        coll.findOne criteria, (err, doc) ->
          conn.close()
          if err then callback err, null else callback null, doc

  # WHERE ID 
  getDocumentById : (id, callback) ->
    @connCollection (err, conn, coll) ->
      if err
        callback err, null
      else
        objectId = new conn.bson_serializer.ObjectID(id)
        criteria = {_id: objectId}
        coll.findOne criteria, (err, document) ->
          conn.close()
          if err then callback err, null else callback null, document

  # DELETE FROM SET db.subscriptions.update({userid:"U1"}, {$pull: {groups: "S2"}})
  removeFromSet : (condition, arrayName, element, callback) ->
    @connCollection (err, conn, coll) ->
      setCriteria = {}
      mergeCondition = {}
      mergeCondition[attrname] = condition[attrname] for attrname of condition
      setCriteria[arrayName] = element
      mergeCondition[arrayName] = element
      @find mergeCondition, (err, res) ->
        if res
          coll.update condition, {$pull: setCriteria}, {safe: true}, (err, success) ->
            conn.close()
            if err then callback err, success else callback null, success
        else
          conn.close()
          callback null, false

  # ADD TO SET db.subscriptions.update({userid:"U1"}, {$addToSet: {groups: "S4"}}, true)
  addToSet : (condition, arrayName, element, callback) ->
    @connCollection (err, conn, coll) ->
      setCriteria = {}
      setCriteria[arrayName] = element
      coll.update condition, {$addToSet: setCriteria}, {safe: true, upsert:true}, (err, success) ->
        conn.close()
        if err then callback err, false else callback null, true

  # Remove all rows from a collection
  emptyTable : (callback) ->
    @remove null, (err, success) ->
      if err then callback false else callback true if callback?
