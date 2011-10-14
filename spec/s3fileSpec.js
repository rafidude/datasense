(function() {
  var S3File, account, fileName;
  S3File = (require('../lib/utils/s3file')).S3File;
  fileName = 'test.csv';
  account = 'global';
  describe("Amazon S3 file save, get and delete", function() {
    it("delete a file from Amazon S3", function() {
      var s3;
      s3 = new S3File(account, fileName);
      s3["delete"](function(err, res) {
        expect(err).toBe(null);
        expect(res).toNotBe(null);
        return asyncSpecDone();
      });
      return asyncSpecWait();
    });
    it("saves a local file to Amazon S3", function() {
      var path, s3;
      s3 = new S3File(account, fileName);
      path = process.cwd() + '/test';
      s3.save(path, function(err, res) {
        expect(err).toBe(null);
        expect(res).toNotBe(null);
        return asyncSpecDone();
      });
      return asyncSpecWait();
    });
    return it("gets a file from Amazon S3", function() {
      var s3;
      s3 = new S3File(account, fileName);
      s3.get(function(err, res) {
        expect(res).toContain('AgileSense');
        return asyncSpecDone();
      });
      return asyncSpecWait();
    });
  });
}).call(this);
