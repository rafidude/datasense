(function() {
  var S3File, client, knox;
  knox = require('knox');
  client = knox.createClient({
    key: 'AKIAIEF5PSDVAXWUIQWQ',
    secret: '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',
    bucket: 'agilesense'
  });
  exports.S3File = S3File = (function() {
    function S3File(account, fileName) {
      this.account = account;
      this.fileName = fileName;
      this.destinationFileName = this.account + "/" + this.fileName;
    }
    S3File.prototype.get = function() {
      return client.get(this.destinationFileName).on("response", function(res) {
        res.setEncoding("utf8");
        return res.on("data", function(chunk) {
          return console.log(chunk);
        });
      }).end();
    };
    S3File.prototype.save = function(path, callback) {
      var fileName;
      if (path == null) {
        path = null;
      }
      fileName = this.fileName;
      fileName = path + '/' + this.fileName;
      return client.putFile(fileName, this.destinationFileName, function(err, res) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, res);
        }
      });
    };
    S3File.prototype["delete"] = function(callback) {
      return client.deleteFile(this.destinationFileName, function(err, res) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, res);
        }
      });
    };
    return S3File;
  })();
}).call(this);
