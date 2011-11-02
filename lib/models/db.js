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
        if ((document._id != null) && document._id === ' ') {
          document._id = new conn.bson_serializer.ObjectID();
        }
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
    DB.prototype.removeAll = function(callback) {
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
    DB.prototype.getAccountCollections = function(url, callback) {
      return this.connection(__bind(function(err, conn) {
        return conn.collectionNames(function(err, names) {
          var collName, counter, filteredNames, name, objArr, total, _i, _len, _results;
          objArr = [];
          counter = 0;
          filteredNames = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = names.length; _i < _len; _i++) {
              name = names[_i];
              if (name.name.split('.')[1].indexOf(url) >= 0) {
                _results.push(name);
              }
            }
            return _results;
          })();
          total = filteredNames.length;
          try {
            _results = [];
            for (_i = 0, _len = filteredNames.length; _i < _len; _i++) {
              name = filteredNames[_i];
              collName = name.name.split('.')[1];
              _results.push(conn.collection(collName, __bind(function(err, coll) {
                var cName;
                cName = collName;
                return coll.count({}, __bind(function(err, count) {
                  var obj;
                  obj = {
                    name: cName,
                    amount: count
                  };
                  ++counter;
                  objArr.push(obj);
                  if (counter === total) {
                    conn.close();
                    return callback(null, objArr);
                  }
                }, this));
              }, this)));
            }
            return _results;
          } catch (error) {
            return console.log(error);
          }
        });
      }, this));
    };
    return DB;
  })();
}).call(this);
