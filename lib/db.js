(function() {
  var DB, mongodb, mongouri;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  require.paths.unshift("~/node_modules");
  mongodb = require("mongodb");
  mongouri = process.env.MONGOLAB_URI;
  if (!mongouri) {
    mongouri = "mongodb://localhost/test";
  }
  exports.DB = DB = (function() {
    function DB(collectionName) {
      this.collectionName = collectionName;
    }
    DB.prototype.connection = function(callback) {
      return mongodb.connect(mongouri, function(err, conn) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, conn);
        }
      });
    };
    DB.prototype.connCollection = function(callback) {
      return this.connection(__bind(function(err, conn) {
        if (err) {
          callback(err, null, null);
        }
        if (err) {
          return;
        }
        return conn.collection(this.collectionName, function(err, coll) {
          if (err) {
            return callback(err, null, null);
          } else {
            return callback(null, conn, coll);
          }
        });
      }, this));
    };
    DB.prototype.find = function(criteria, callback) {
      return this.connCollection(function(err, conn, coll) {
        if (err) {
          return callback(err, null);
        } else {
          return coll.find(criteria, function(err, cursor) {
            return cursor.toArray(function(err, docs) {
              conn.close();
              if (err) {
                return callback(err, null);
              } else {
                return callback(null, docs);
              }
            });
          });
        }
      });
    };
    DB.prototype.insert = function(document, callback) {
      return this.connCollection(function(err, conn, coll) {
        return coll.insert(document, {
          safe: true
        }, function(err, success) {
          conn.close();
          if (err) {
            return callback(err, false);
          } else {
            return callback(null, true);
          }
        });
      });
    };
    DB.prototype.insertAsync = function(document, callback) {
      return this.connCollection(function(err, conn, coll) {
        return coll.insert(document, function(err, success) {
          conn.close();
          if (err) {
            return callback(err, false);
          } else {
            return callback(null, true);
          }
        });
      });
    };
    DB.prototype.update = function(criteria, document, callback) {
      return this.connCollection(function(err, conn, coll) {
        return coll.update(criteria, document, {
          safe: true
        }, function(err, success) {
          conn.close();
          if (err) {
            return callback(err, false);
          } else {
            return callback(null, true);
          }
        });
      });
    };
    DB.prototype.remove = function(criteria, callback) {
      if (criteria == null) {
        criteria = null;
      }
      if (callback == null) {
        callback = null;
      }
      if (!(criteria != null)) {
        criteria = {};
      }
      return this.connCollection(function(err, conn, coll) {
        if (err) {
          console.log(err);
        }
        return coll.remove(criteria, {
          safe: true
        }, function(err, success) {
          conn.close();
          if (err) {
            if (callback) {
              return callback(err, false);
            }
          } else {
            if (callback != null) {
              return callback(null, true);
            }
          }
        });
      });
    };
    DB.prototype.count = function(criteria, callback) {
      return this.connCollection(function(err, conn, coll) {
        if (criteria === null) {
          criteria = {};
        }
        return coll.count(criteria, function(err, count) {
          conn.close();
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, count);
          }
        });
      });
    };
    DB.prototype.findOne = function(criteria, callback) {
      if (!criteria) {
        criteria = {};
      }
      return this.connCollection(function(err, conn, coll) {
        if (err) {
          return callback(err, null);
        } else {
          return coll.findOne(criteria, function(err, doc) {
            conn.close();
            if (err) {
              return callback(err, null);
            } else {
              return callback(null, doc);
            }
          });
        }
      });
    };
    DB.prototype.getDocumentById = function(id, callback) {
      return this.connCollection(function(err, conn, coll) {
        var criteria, objectId;
        if (err) {
          return callback(err, null);
        } else {
          objectId = new conn.bson_serializer.ObjectID(id);
          criteria = {
            _id: objectId
          };
          return coll.findOne(criteria, function(err, document) {
            conn.close();
            if (err) {
              return callback(err, null);
            } else {
              return callback(null, document);
            }
          });
        }
      });
    };
    DB.prototype.removeFromSet = function(condition, arrayName, element, callback) {
      return this.connCollection(function(err, conn, coll) {
        var attrname, mergeCondition, setCriteria;
        setCriteria = {};
        mergeCondition = {};
        for (attrname in condition) {
          mergeCondition[attrname] = condition[attrname];
        }
        setCriteria[arrayName] = element;
        mergeCondition[arrayName] = element;
        return this.find(mergeCondition, function(err, res) {
          if (res) {
            return coll.update(condition, {
              $pull: setCriteria
            }, {
              safe: true
            }, function(err, success) {
              conn.close();
              if (err) {
                return callback(err, success);
              } else {
                return callback(null, success);
              }
            });
          } else {
            conn.close();
            return callback(null, false);
          }
        });
      });
    };
    DB.prototype.addToSet = function(condition, arrayName, element, callback) {
      return this.connCollection(function(err, conn, coll) {
        var setCriteria;
        setCriteria = {};
        setCriteria[arrayName] = element;
        return coll.update(condition, {
          $addToSet: setCriteria
        }, {
          safe: true,
          upsert: true
        }, function(err, success) {
          conn.close();
          if (err) {
            return callback(err, false);
          } else {
            return callback(null, true);
          }
        });
      });
    };
    DB.prototype.emptyTable = function(callback) {
      return this.remove(null, function(err, success) {
        if (err) {
          return callback(false);
        } else {
          if (callback != null) {
            return callback(true);
          }
        }
      });
    };
    return DB;
  })();
}).call(this);
