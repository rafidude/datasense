(function() {
  var DB, collectionName, db, insertTwoDocs;
  DB = (require("../lib/db")).DB;
  collectionName = 'testcoll';
  db = new DB(collectionName);
  insertTwoDocs = function(callback) {
    var doc1;
    doc1 = {
      name: "BMCM",
      age: 40
    };
    return db.removeAll(function(success) {
      return db.insert(doc1, function(err, success) {
        var doc2;
        doc2 = {
          name: "RFP",
          age: 1
        };
        return db.insert(doc2, function(err, success) {
          return callback(true);
        });
      });
    });
  };
  describe("Core database functionality", function() {
    it("should empty the table", function() {
      db.removeAll(function(success) {
        return db.find({}, function(err, docs) {
          expect(docs.length).toBe(0);
          return asyncSpecDone();
        });
      });
      return asyncSpecWait();
    });
    it("should insert two documents Asynchronously into testcoll", function() {
      db.removeAll(function(success) {
        var doc1;
        doc1 = {
          name: "BMCM",
          age: 40
        };
        return db.insertAsync(doc1, function(err, success) {
          var doc2;
          doc2 = {
            name: "RFP",
            age: 1
          };
          return db.insertAsync(doc2, function(err, success) {
            return db.find({}, function(err, docs) {
              expect(docs.length).toBe(2);
              return asyncSpecDone();
            });
          });
        });
      });
      return asyncSpecWait();
    });
    it("should insert two documents into testcoll", function() {
      var doc1;
      doc1 = {
        name: "BMCM",
        age: 40
      };
      insertTwoDocs(function(success) {
        return db.find({}, function(err, docs) {
          expect(docs.length).toBe(2);
          return asyncSpecDone();
        });
      });
      return asyncSpecWait();
    });
    it("should update a document in testcoll", function() {
      var criteria, doc1;
      doc1 = {
        name: "Industry",
        age: 4
      };
      criteria = {
        name: "Industry"
      };
      db.insert(doc1, function(err, success) {
        var docUpdate;
        docUpdate = {
          name: "Industry",
          age: 4
        };
        return db.update(criteria, docUpdate, function(err, success) {
          return db.findOne(criteria, function(err, doc) {
            expect(doc.age).toBe(4);
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
    it("should delete two documents from testcoll", function() {
      var doc1;
      doc1 = {
        name: "BMCM",
        age: 40
      };
      insertTwoDocs(function(success) {
        return db.remove({}, function(err, success) {
          expect(success).toBe(true);
          return asyncSpecDone();
        });
      });
      return asyncSpecWait();
    });
    return it("should find two documents in testcoll", function() {
      var doc1;
      doc1 = {
        name: "BMCM",
        age: 40
      };
      insertTwoDocs(function(success) {
        return db.find({}, function(err, docs) {
          expect(docs.length).toBe(2);
          expect(docs[0].name).toBe('BMCM');
          expect(docs[1].name).toBe('RFP');
          expect(docs[0].age).toBe(40);
          expect(docs[1].age).toBe(1);
          return asyncSpecDone();
        });
      });
      return asyncSpecWait();
    });
  });
}).call(this);
