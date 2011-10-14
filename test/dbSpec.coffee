DB = (require "../lib/models/db").DB

collectionName = 'testcoll'
db = new DB collectionName

insertTwoDocs = (callback) ->
  doc1 = {name: "BMCM", age: 40}
  db.removeAll (success)->
    db.insert doc1, (err, success) ->
      doc2 = {name: "RFP", age: 1}
      db.insert doc2, (err, success) ->
        callback true

describe "Core database functionality", ->
  it "should empty the table", ->
    db.removeAll (success) ->
      db.find {}, (err, docs) ->
        expect(docs.length).toBe 0
        asyncSpecDone()
    asyncSpecWait()

  it "should insert two documents Asynchronously into testcoll", ->
    db.removeAll (success)->
      doc1 = {name: "BMCM", age: 40}
      db.insertAsync doc1, (err, success) ->
        doc2 = {name: "RFP", age: 1}
        db.insertAsync doc2, (err, success) ->
          db.find {}, (err, docs) ->
            expect(docs.length).toBe 2
            asyncSpecDone()
    asyncSpecWait()
  
  it "should insert two documents into testcoll", ->
    doc1 = {name: "BMCM", age: 40}
    insertTwoDocs (success) ->
      db.find {}, (err, docs) ->
        expect(docs.length).toBe 2
        asyncSpecDone()
    asyncSpecWait()
  
  it "should update a document in testcoll", ->
    doc1 = {name: "Industry", age: 4}
    criteria = {name: "Industry"}
    db.insert doc1, (err, success) ->
      docUpdate = {name: "Industry", age: 4}
      db.update criteria, docUpdate, (err, success) ->
        db.findOne criteria, (err, doc) ->
          expect(doc.age).toBe 4
          asyncSpecDone()
    asyncSpecWait()
    
  it "should delete two documents from testcoll", ->
    doc1 = {name: "BMCM", age: 40}
    insertTwoDocs (success) ->
      db.remove {}, (err, success) ->
        expect(success).toBe true
        asyncSpecDone()
    asyncSpecWait()
  
  it "should find two documents in testcoll", ->
    doc1 = {name: "BMCM", age: 40}
    insertTwoDocs (success) ->
      db.find {}, (err, docs) ->
        expect(docs.length).toBe 2
        expect(docs[0].name).toBe 'BMCM'
        expect(docs[1].name).toBe 'RFP'
        expect(docs[0].age).toBe 40
        expect(docs[1].age).toBe 1
        asyncSpecDone()
    asyncSpecWait()
