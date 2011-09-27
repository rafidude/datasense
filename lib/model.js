(function() {
  var DB, Model;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  DB = (require("./db")).DB;
  exports.Model = Model = (function() {
    function Model(collectionName, criteria) {
      this.criteria = criteria;
      this.remove = __bind(this.remove, this);
      this.removeAll = __bind(this.removeAll, this);
      this.save = __bind(this.save, this);
      this.getAll = __bind(this.getAll, this);
      this.get = __bind(this.get, this);
      this.db = new DB(collectionName);
    }
    Model.prototype.get = function(callback) {
      return this.db.findOne(this.criteria, function(err, result) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, result);
        }
      });
    };
    Model.prototype.getAll = function(callback) {
      return this.db.find({}, function(err, result) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, result);
        }
      });
    };
    Model.prototype.save = function(object, callback) {
      return this.db.insert(object, function(err, result) {
        if (err) {
          return callback(err, null);
        } else {
          if (callback != null) {
            return callback(null, result);
          }
        }
      });
    };
    Model.prototype.removeAll = function(callback) {
      return this.db.removeAll(function(success) {
        if (callback != null) {
          return callback();
        }
      });
    };
    Model.prototype.remove = function(criteria, callback) {
      return this.db.remove(function(err, success) {
        if (callback != null) {
          return callback();
        }
      });
    };
    return Model;
  })();
}).call(this);
