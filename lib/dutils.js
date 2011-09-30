(function() {
  var CSV2JS, FileUpload, ParsedData, S3File, auth_key, auth_secret, crypto, fileUpload, getUploadParams, parseFile, parsedData, request, sanitize, template_id, toJS;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  crypto = require('crypto');
  sanitize = require("validator").sanitize;
  auth_key = '1580cee65f904f7399ca08a1a844cfab';
  auth_secret = '61b3703ab1a24f1b8be97b73dc2b33c50a2260a0';
  template_id = 'b902f75dba8a4fadb054ab068e705b97';
  getUploadParams = function() {
    var encodedParams, hash, params, paramsStr;
    params = {
      auth: {
        expires: "2011/10/01 16:53:14+00:00",
        key: auth_key
      },
      template_id: template_id,
      redirect_url: "http://localhost:3000/done",
      notify_url: "http://localhost:3000/filesready"
    };
    paramsStr = JSON.stringify(params);
    encodedParams = sanitize(paramsStr).entityEncode();
    hash = crypto.createHmac("sha1", auth_secret).update(paramsStr).digest("hex");
    console.log([encodedParams, paramsStr, hash]);
    return [encodedParams, paramsStr, hash];
  };
  S3File = (require('../lib/s3file')).S3File;
  CSV2JS = require('../lib/CSV2JS');
  toJS = CSV2JS.csvToJs;
  ParsedData = (require('../lib/commonModels')).ParsedData;
  parsedData = new ParsedData;
  request = require("request");
  FileUpload = (require('../lib/commonModels')).FileUpload;
  fileUpload = new FileUpload;
  exports.parseFile = parseFile = function(url) {
    return request(url, __bind(function(error, response, body) {
      var account, arrurl, fileName, result, s3, s3url;
      if (!error && response.statusCode === 200) {
        result = JSON.parse(body);
        s3url = result.results[':original'][0].url;
        arrurl = s3url.split('/');
        account = arrurl[3];
        fileName = '/' + arrurl[4] + '/' + arrurl[5];
        s3 = new S3File(account, fileName);
        return s3.get(__bind(function(err, res) {
          var parsedRet;
          if (err) {
            return console.log(err);
          } else {
            parsedRet = toJS(res);
            return parsedData.save(parsedRet.data, __bind(function(err, success) {
              console.log("Saved data after parsing the file uploaded: " + url);
              return fileUpload.remove({
                assembly_url: url
              }, function(err, success) {
                if (err) {
                  return console.log(err);
                } else {
                  return console.log("removed row");
                }
              });
            }, this));
          }
        }, this));
      }
    }, this));
  };
}).call(this);
