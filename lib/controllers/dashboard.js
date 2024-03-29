(function() {
  var DB, DataColl, dbviews, utils;
  DataColl = (require('../models/commonModels')).DataColl;
  utils = require('../utils/dutils');
  DB = (require("../models/db")).DB;
  dbviews = require("../utils/dbviews");
  module.exports = function(app) {
    app.get("/:url/alldata", function(req, res) {
      var db, url;
      url = req.params.url;
      db = new DB('');
      return db.getAccountCollections(url, function(err, data) {
        var columns, k, v, _ref;
        columns = [];
        _ref = data[0];
        for (k in _ref) {
          v = _ref[k];
          columns.push(k);
        }
        return res.render("grid", {
          data: data,
          columns: columns
        });
      });
    });
    app.get("/:url/generatedata/:rows?", function(req, res) {
      var rows, url;
      rows = req.params.rows;
      url = req.params.url;
      if (!(rows != null) && isNaN(parseInt(rows))) {
        rows = 100;
      } else {
        rows = parseInt(rows);
      }
      utils.saveDonors(rows, url);
      utils.saveDonorsHistory(rows, url);
      return utils.saveDonorsView(rows, url, function(err, result) {
        return res.redirect("/" + url + "/charts");
      });
    });
    app.get("/:url/createview", function(req, res) {
      var viewDef;
      viewDef = {
        name: 'testDonorReport',
        fields: ['ID', 'name'],
        calculatedFields: [
          {
            "function": 'sum',
            on: 'amount',
            as: 'total'
          }, {
            "function": 'count',
            on: 'date',
            as: 'count'
          }
        ],
        from: ['testPersons', 'testHistory'],
        join: [
          {
            'testPersons.ID': 'testHistory.ID'
          }
        ],
        groupBy: ['ID', 'name'],
        keys: ['ID']
      };
      return dbviews.populateData(viewDef, function(err, data) {
        var columns, k, v, _ref;
        console.log(data);
        columns = [];
        _ref = data[0];
        for (k in _ref) {
          v = _ref[k];
          columns.push(k);
        }
        console.log(columns);
        return res.render("grid", {
          data: data,
          columns: columns
        });
      });
    });
    app.get("/:url/charts", function(req, res) {
      var dataColl, url;
      url = req.params.url;
      dataColl = new DataColl(url + 'DonorView', {
        id: ' '
      });
      return dataColl.getAll(function(err, data) {
        var curr_date, curr_month, curr_year, d, obj, pctPos, top, totalRows, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          obj = data[_i];
          d = new Date(obj.dateDonated);
          curr_date = d.getDate();
          curr_month = d.getMonth();
          curr_month++;
          curr_year = d.getFullYear();
          obj.date = curr_month + "/" + curr_date + "/" + curr_year;
        }
        top = req.query.top;
        if (top != null) {
          pctPos = -1;
          totalRows = data.length;
          pctPos = top.indexOf("p");
          if (pctPos > -1) {
            top = top.slice(0, pctPos);
            if (isNaN(parseInt(top))) {
              top = -1;
            }
            if (top >= 0 && top <= 100) {
              top = Math.ceil(totalRows * top / 100);
            } else {
              top = -1;
            }
          } else {
            if (isNaN(parseInt(top))) {
              top = -1;
            } else {
              top = parseInt(top);
            }
          }
          if (top !== -1) {
            utils.descBy(data, "amount");
            data.splice(top);
          }
        }
        if (top === -1) {
          top = null;
        }
        return res.render("table", {
          data: data,
          top: top
        });
      });
    });
    app.get("/:url/charts.json", function(req, res) {
      var url;
      url = req.params.url;
      return utils.getDonorViewChart(url, function(err, chartData) {
        var msgs_json;
        msgs_json = JSON.stringify(chartData);
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        return res.end(msgs_json);
      });
    });
    return app.get("/:url/donors.csv", function(req, res) {
      var url;
      url = req.params.url;
      return utils.getCollDataAsCSV('Donors', url, function(err, csv) {
        res.writeHead(200, {
          'Content-Type': 'application/csv'
        });
        return res.end(csv);
      });
    });
  };
}).call(this);
