(function() {
  var DB, DataColl, getAllRows, getData, getView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  DB = (require("../models/db")).DB;
  DataColl = (require('../models/commonModels')).DataColl;
  getAllRows = function(coll, callback) {
    return coll.find({}, __bind(function(err, docs) {
      var collName, data;
      collName = coll.collectionName;
      data = {};
      data['key'] = collName;
      data['docs'] = docs;
      return callback(null, data);
    }, this));
  };
  getData = function(collections, callback) {
    var coll, collectionName, count, db1, total, _i, _len, _results;
    db1 = {};
    total = collections.length;
    count = 0;
    _results = [];
    for (_i = 0, _len = collections.length; _i < _len; _i++) {
      collectionName = collections[_i];
      coll = new DB(collectionName);
      _results.push(getAllRows(coll, function(err, data) {
        count++;
        db1[data.key] = data.docs;
        if (count === total) {
          return callback(null, db1);
        }
      }));
    }
    return _results;
  };
  exports.populateData = function(viewDef, callback) {
    return getData(viewDef.from, function(err, data) {
      var dataColl, dataRows, key, row, rows;
      rows = getView(data, viewDef);
      dataRows = [];
      for (key in rows) {
        row = rows[key];
        dataRows.push(row);
      }
      dataColl = new DataColl(viewDef.name, {
        id: ' '
      });
      return dataColl.removeAll(__bind(function() {
        return dataColl.save(dataRows, __bind(function(err, result) {
          if (err) {
            console.log("Error saving data in a view: ", err);
            return callback(err, null);
          } else {
            return dataColl.count(__bind(function(err, count) {
              if (err) {
                console.log("Parse Count: " + err);
              }
              console.log("Saved " + count + " rows to " + viewDef.name + " collection.");
              return callback(null, dataRows);
            }, this));
          }
        }, this));
      }, this));
    });
  };
  getView = function(data, viewDef) {
    var calc, coll, fields, k, key, obj, row, rowObj, rows, v, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
    rows = {};
    key = viewDef.keys[0];
    fields = viewDef.fields;
    _ref = viewDef.calculatedFields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      calc = _ref[_i];
      fields.push(calc.as);
    }
    _ref2 = viewDef.from;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      coll = _ref2[_j];
      _ref3 = data[coll];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        row = _ref3[_k];
        rowObj = rows[row[key]];
        obj = {};
        if (rowObj) {
          obj = rowObj;
          for (k in row) {
            v = row[k];
            obj[k] = v;
            _ref4 = viewDef.calculatedFields;
            for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
              calc = _ref4[_l];
              if (k === calc.on) {
                switch (calc["function"]) {
                  case 'sum':
                    if (obj[calc.as]) {
                      obj[calc.as] += obj[k];
                    } else {
                      obj[calc.as] = obj[k];
                    }
                    break;
                  case 'count':
                    if (obj[calc.as]) {
                      obj[calc.as] += 1;
                    } else {
                      obj[calc.as] = 1;
                    }
                }
              }
            }
          }
        } else {
          obj = row;
        }
        for (k in obj) {
          v = obj[k];
          if (fields.indexOf(k) === -1) {
            delete obj[k];
          }
        }
        rows[row[key]] = obj;
      }
    }
    return rows;
  };
}).call(this);
