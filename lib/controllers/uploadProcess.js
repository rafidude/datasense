(function() {
  var FileUpload, fileUpload, utils;
  FileUpload = (require('../models/commonModels')).FileUpload;
  fileUpload = new FileUpload;
  utils = require('../utils/dutils');
  module.exports = function(app) {
    app.get("/:url/upload", function(req, res) {
      var doneUrl, encodedParams, hash, paramsStr, url, _ref;
      url = req.params.url;
      doneUrl = "http://" + req.headers.host + "/" + url + "/done";
      _ref = utils.getUploadParams(doneUrl), encodedParams = _ref[0], paramsStr = _ref[1], hash = _ref[2];
      return res.render('upload', {
        encodedParams: encodedParams,
        hash: hash
      });
    });
    app.get("/:url/done", function(req, res) {
      var data;
      data = req.query;
      data.account = req.params.url;
      return fileUpload.save(data, function(err, success) {
        return res.end(JSON.stringify(data));
      });
    });
    return setInterval(function() {
      return fileUpload.getAll(function(err, docs) {
        var doc, _i, _len, _results;
        if (!err && docs.length > 0) {
          console.log(docs);
        }
        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          _results.push(utils.parseFile(doc.account, doc.assembly_url));
        }
        return _results;
      });
    }, 5000);
  };
}).call(this);
