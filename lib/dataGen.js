(function() {
  var DataGen, ParsedData;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ParsedData = (require('../lib/commonModels')).ParsedData;
  exports.DataGen = DataGen = (function() {
    function DataGen(definition, dataRows, transforms) {
      this.definition = definition;
      this.dataRows = dataRows != null ? dataRows : 10;
      this.transforms = transforms != null ? transforms : null;
    }
    DataGen.prototype.generateData = function() {
      var colAttr, data, day, daysAgo, key, row, rowData, today, val, _ref, _ref2;
      today = new Date();
      data = [];
      for (row = 0, _ref = this.dataRows - 1; 0 <= _ref ? row <= _ref : row >= _ref; 0 <= _ref ? row++ : row--) {
        rowData = {};
        _ref2 = this.definition;
        for (key in _ref2) {
          val = _ref2[key];
          colAttr = val.split(' ');
          switch (colAttr[0]) {
            case 'auto':
              rowData[key] = row + 1;
              break;
            case 'number':
              switch (colAttr[1]) {
                case 'random':
                  rowData[key] = Math.floor(Math.random() * colAttr[2]);
                  break;
                case 'function':
                  rowData[key] = this.transforms['getAmount']();
              }
              break;
            case 'date':
              switch (colAttr[1]) {
                case 'random':
                  day = Math.floor(Math.random() * colAttr[2]);
                  daysAgo = new Date().setDate(today.getDate() - day);
                  rowData[key] = daysAgo;
              }
              break;
            default:
              console.log("Error: " + colAttr[0] + " " + key + " " + val);
          }
        }
        data.push(rowData);
      }
      return data;
    };
    DataGen.prototype.saveData = function(data, callback) {
      var parsedData;
      parsedData = new ParsedData;
      return parsedData.removeAll(__bind(function() {
        return parsedData.save(data, __bind(function(err, result) {
          return callback(err, result);
        }, this));
      }, this));
    };
    return DataGen;
  })();
}).call(this);
